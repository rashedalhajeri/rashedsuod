
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
  console.log("البحث عن متجر بواسطة fetchStoreByDomain:", cleanDomain);

  try {
    // البحث المباشر بالدومين المنسق (حالة متطابقة)
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("domain_name", cleanDomain)
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      console.error("خطأ في البحث عن المتجر:", error);
      return null;
    }

    if (data) {
      console.log("تم العثور على المتجر من الطلب الأول:", data.domain_name);
      return data;
    }

    // طباعة جميع المتاجر للتصحيح
    console.log("لم يتم العثور على المتجر، استعلام عن جميع المتاجر للتصحيح");
    const { data: allStores } = await supabase
      .from("stores")
      .select("domain_name, store_name, status")
      .order("created_at", { ascending: false });
      
    console.log("جميع المتاجر المتاحة:", allStores);

    // محاولة ثانية بدون شرط الحالة
    console.log("محاولة ثانية بدون شرط الحالة");
    const { data: anyStatusData } = await supabase
      .from("stores")
      .select("*")
      .eq("domain_name", cleanDomain)
      .maybeSingle();
      
    if (anyStatusData) {
      console.log("تم العثور على المتجر ولكن حالته:", anyStatusData.status);
      return anyStatusData;
    }

    // محاولة ثالثة باستخدام البحث غير الحساس لحالة الأحرف
    console.log("محاولة البحث بطريقة ثالثة باستخدام ilike");
    const { data: ilikeData } = await supabase
      .from("stores")
      .select("*")
      .ilike("domain_name", cleanDomain)
      .maybeSingle();

    if (ilikeData) {
      console.log("تم العثور على المتجر من البحث ilike:", ilikeData.domain_name);
      return ilikeData;
    }

    console.log("لم يتم العثور على متجر بالدومين:", cleanDomain);
    return null;
  } catch (err) {
    console.error("خطأ غير متوقع:", err);
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
