import { supabase } from "@/integrations/supabase/client";
import { normalizeStoreDomain } from "./url-helpers";

/**
 * يبحث عن متجر بناءً على اسم الدومين بطريقة أكثر قوة
 */
export const fetchStoreByDomain = async (domainName: string) => {
  if (!domainName) {
    console.error("اسم الدومين فارغ أو غير محدد");
    return null;
  }

  const cleanDomain = normalizeStoreDomain(domainName);
  console.log("البحث عن متجر بواسطة fetchStoreByDomain:", {
    originalDomain: domainName,
    cleanDomain,
    timestamp: new Date().toISOString()
  });

  try {
    // البحث المباشر عن المتجر
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("domain_name", cleanDomain)
      .single();
      
    if (error) {
      if (error.code === 'PGRST116') {
        console.log("لم يتم العثور على متجر:", cleanDomain);
      } else {
        console.error("خطأ في البحث عن المتجر:", error);
      }
    }

    if (data) {
      console.log("تم العثور على المتجر:", {
        storeName: data.store_name,
        domainName: data.domain_name,
        status: data.status
      });
      return data;
    }

    // طباعة جميع المتاجر للتصحيح
    console.log("محاولة جلب جميع المتاجر للتصحيح");
    const { data: allStores } = await supabase
      .from("stores")
      .select("domain_name, store_name, status")
      .order("created_at", { ascending: false });
      
    if (allStores && allStores.length > 0) {
      console.log("المتاجر المتوفرة:", allStores);
    } else {
      console.log("لا توجد متاجر في قاعدة البيانات");
    }

    return null;
  } catch (err) {
    console.error("خطأ غير متوقع في fetchStoreByDomain:", err);
    return null;
  }
};

/**
 * تحقق من وجود المتجر وحالته
 */
export const checkStoreStatus = async (domainName: string) => {
  const store = await fetchStoreByDomain(domainName);
  
  if (!store) {
    return { exists: false, active: false, store: null };
  }
  
  const isActive = store.status === 'active';
  return { exists: true, active: isActive, store };
};
