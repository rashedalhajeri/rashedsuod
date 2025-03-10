
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

    // محاولة ثانية باستخدام البحث غير الحساس لحالة الأحرف
    console.log("محاولة البحث بطريقة ثانية باستخدام ilike");
    const { data: altData, error: altError } = await supabase
      .from("stores")
      .select("*")
      .ilike("domain_name", cleanDomain)
      .eq("status", "active")
      .maybeSingle();

    if (altError) {
      console.error("خطأ في المحاولة الثانية للبحث:", altError);
      return null;
    }

    if (altData) {
      console.log("تم العثور على المتجر من المحاولة الثانية:", altData.domain_name);
      return altData;
    }

    // محاولة ثالثة باستخدام طريقة أكثر تساهلاً (يحتوي على)
    console.log("محاولة البحث بطريقة ثالثة أكثر تساهلاً");
    const { data: containsData, error: containsError } = await supabase
      .from("stores")
      .select("*")
      .filter("domain_name", "ilike", `%${cleanDomain}%`)
      .eq("status", "active")
      .maybeSingle();

    if (containsError) {
      console.error("خطأ في المحاولة الثالثة للبحث:", containsError);
      return null;
    }

    if (containsData) {
      console.log("تم العثور على المتجر من المحاولة الثالثة:", containsData.domain_name);
      return containsData;
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
