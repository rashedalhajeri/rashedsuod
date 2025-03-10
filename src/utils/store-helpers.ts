
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
    // محاولة البحث المباشر
    const { data: exactMatch, error: exactError } = await supabase
      .from("stores")
      .select("*")
      .eq("domain_name", cleanDomain)
      .maybeSingle();

    if (exactMatch) {
      console.log("تم العثور على المتجر (مطابقة دقيقة):", exactMatch);
      return exactMatch;
    }

    // محاولة البحث بدون حساسية لحالة الأحرف
    const { data: caseInsensitiveMatch, error: caseError } = await supabase
      .from("stores")
      .select("*")
      .ilike("domain_name", cleanDomain)
      .maybeSingle();

    if (caseInsensitiveMatch) {
      console.log("تم العثور على المتجر (مطابقة غير حساسة للأحرف):", caseInsensitiveMatch);
      return caseInsensitiveMatch;
    }

    // طباعة جميع المتاجر للمساعدة في التصحيح
    const { data: allStores } = await supabase
      .from("stores")
      .select("domain_name, store_name, status")
      .order("created_at", { ascending: false });

    console.log("لم يتم العثور على متجر. المتاجر المتوفرة:", allStores || []);

    // تحقق من الأخطاء
    if (exactError && exactError.code !== 'PGRST116') {
      console.error("خطأ في البحث الدقيق:", exactError);
    }
    if (caseError) {
      console.error("خطأ في البحث غير الحساس للأحرف:", caseError);
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
