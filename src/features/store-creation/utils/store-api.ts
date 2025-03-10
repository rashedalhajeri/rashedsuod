import { supabase } from "@/integrations/supabase/client";
import { StoreFormData } from "../types";
import { toast } from "sonner";

/**
 * Creates a new store in the database
 */
export const createStore = async (formData: StoreFormData): Promise<boolean> => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      toast.error("لم يتم العثور على بيانات المستخدم");
      return false;
    }
    
    // Prepare store data for insertion
    const storeData = {
      user_id: userData.user.id,
      store_name: formData.storeName,
      domain_name: formData.domainName.trim().toLowerCase(),
      phone_number: formData.phoneNumber,
      country: formData.country,
      currency: formData.currency,
      description: formData.description,
      logo_url: formData.logoUrl,
    };
    
    // إضافة حقل banner_url فقط إذا كان موجوداً في formData وليس null
    if (formData.bannerUrl) {
      (storeData as any).banner_url = formData.bannerUrl;
    }
    
    const { data, error } = await supabase
      .from("stores")
      .insert(storeData)
      .select()
      .single();
    
    if (error) {
      console.error("خطأ في إنشاء المتجر:", error);
      
      // إذا كان الخطأ متعلقًا بحقل banner_url، نحاول مرة أخرى بدونه
      if (error.message?.includes("banner_url")) {
        const { data: retryData, error: retryError } = await supabase
          .from("stores")
          .insert({
            user_id: userData.user.id,
            store_name: formData.storeName,
            domain_name: formData.domainName.trim().toLowerCase(),
            phone_number: formData.phoneNumber,
            country: formData.country,
            currency: formData.currency,
            description: formData.description,
            logo_url: formData.logoUrl,
          })
          .select()
          .single();
          
        if (retryError) {
          console.error("خطأ في المحاولة الثانية لإنشاء المتجر:", retryError);
          toast.error("حدث خطأ أثناء إنشاء المتجر");
          return false;
        }
        
        toast.success("تم إنشاء المتجر بنجاح");
        return true;
      }
      
      toast.error("حدث خطأ أثناء إنشاء المتجر");
      return false;
    }
    
    toast.success("تم إنشاء المتجر بنجاح");
    return true;
  } catch (error) {
    console.error("خطأ غير متوقع:", error);
    toast.error("حدث خطأ غير متوقع");
    return false;
  }
};

/**
 * Checks if a domain name is available
 */
export const checkDomainAvailability = async (domainName: string): Promise<boolean> => {
  try {
    // تنظيف اسم الدومين وتحويله إلى أحرف صغيرة للتأكد من المطابقة الدقيقة
    const cleanDomainName = domainName.trim().toLowerCase();
    
    if (!cleanDomainName) {
      return false;
    }
    
    // استعلام دقيق للتحقق من توفر النطاق باستخدام المطابقة الدقيقة للاسم
    const { data, error } = await supabase
      .from("stores")
      .select("domain_name")
      .eq("domain_name", cleanDomainName)
      .maybeSingle();
    
    if (error) {
      console.error("خطأ في التحقق من توفر النطاق:", error);
      return false;
    }
    
    // إذا كانت البيانات فارغة، فإن النطاق متاح
    return !data;
  } catch (error) {
    console.error("خطأ غير متوقع:", error);
    return false;
  }
};

/**
 * Search stores by name, not by domain
 */
export const searchStoresByName = async (storeName: string): Promise<any[]> => {
  try {
    if (!storeName || storeName.trim().length < 2) {
      return [];
    }
    
    const searchTerm = storeName.trim().toLowerCase();
    
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .ilike("store_name", `%${searchTerm}%`)
      .eq("status", "active")
      .limit(10);
    
    if (error) {
      console.error("خطأ في البحث عن المتاجر:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("خطأ غير متوقع في البحث عن المتاجر:", error);
    return [];
  }
};

/**
 * Get store by exact domain name, with case-insensitive search
 */
export const getStoreByDomain = async (domainName: string): Promise<any> => {
  try {
    if (!domainName) {
      return null;
    }
    
    const cleanDomain = domainName.trim().toLowerCase();
    
    // Try first with case-insensitive search using ILIKE
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .ilike("domain_name", cleanDomain)
      .eq("status", "active")
      .maybeSingle();
    
    if (error) {
      console.error("خطأ في الحصول على بيانات المتجر:", error);
      return null;
    }
    
    if (!data) {
      // Try alternative search with case-insensitive OR condition
      const { data: altData, error: altError } = await supabase
        .from("stores")
        .select("*")
        .or(`domain_name.ilike.${cleanDomain},domain.ilike.${cleanDomain}`)
        .eq("status", "active")
        .maybeSingle();
      
      if (altError) {
        console.error("خطأ في البحث البديل عن بيانات المتجر:", altError);
        return null;
      }
      
      return altData;
    }
    
    return data;
  } catch (error) {
    console.error("خطأ غير متوقع في الحصول على بيانات المتجر:", error);
    return null;
  }
};
