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
    // تجربة البحث الأولية بدون أي قيود
    const { data: allStores, error: allError } = await supabase
      .from("stores")
      .select("domain_name, store_name, status")
      .order("created_at", { ascending: false });
      
    console.log("جميع المتاجر في النظام:", allStores || []);
    
    if (allError) {
      console.error("خطأ في جلب جميع المتاجر:", allError);
    }

    // محاولة البحث المباشر
    const { data: exactMatch, error: exactError } = await supabase
      .from("stores")
      .select("*")
      .eq("domain_name", cleanDomain)
      .maybeSingle();

    if (exactError) {
      console.error("خطأ في البحث المباشر:", {
        error: exactError,
        domain: cleanDomain,
        query: "eq",
        timestamp: new Date().toISOString()
      });
    }

    if (exactMatch) {
      console.log("تم العثور على المتجر (مطابقة مباشرة):", exactMatch);
      return exactMatch;
    }

    // محاولة البحث بدون حساسية لحالة الأحرف
    const { data: caseMatch, error: caseError } = await supabase
      .from("stores")
      .select("*")
      .ilike("domain_name", cleanDomain)
      .maybeSingle();

    if (caseError) {
      console.error("خطأ في البحث غير الحساس للأحرف:", {
        error: caseError,
        domain: cleanDomain,
        query: "ilike",
        timestamp: new Date().toISOString()
      });
    }

    if (caseMatch) {
      console.log("تم العثور على المتجر (مطابقة غير حساسة للأحرف):", caseMatch);
      return caseMatch;
    }

    console.log("لم يتم العثور على متجر:", {
      searchedDomain: cleanDomain,
      availableStores: allStores?.map(s => ({ 
        domain: s.domain_name, 
        name: s.store_name,
        status: s.status 
      })) || []
    });

    return null;
  } catch (err) {
    console.error("خطأ غير متوقع في fetchStoreByDomain:", {
      error: err,
      domain: cleanDomain,
      timestamp: new Date().toISOString()
    });
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
