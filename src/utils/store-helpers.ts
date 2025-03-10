
import { supabase } from "@/integrations/supabase/client";
import { normalizeStoreDomain } from "./url-helpers";

// Simple in-memory cache for store data
const storeCache: Record<string, {data: any, timestamp: number}> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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

  // Check the cache first
  const cachedData = storeCache[cleanDomain];
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    console.log("تم استرجاع المتجر من الذاكرة المؤقتة:", cleanDomain);
    return cachedData.data;
  }

  try {
    // Log all stores for debugging
    const { data: allStores, error: allError } = await supabase
      .from("stores")
      .select("id, domain_name, store_name, status")
      .order("created_at", { ascending: false });
      
    console.log("جميع المتاجر في النظام:", allStores || []);
    
    if (allError) {
      console.error("خطأ في جلب جميع المتاجر:", allError);
    }

    // تحقق مخصص باستخدام آلية البحث المزدوج
    let foundStore = null;
    
    // 1. First search: Exact match using .eq()
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
      foundStore = exactMatch;
    } else {
      // 2. Second search: Case-insensitive match using .ilike()
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
        foundStore = caseMatch;
      }
    }
    
    // 3. Manual search if no store found yet
    if (!foundStore && allStores) {
      console.log("محاولة البحث اليدوي عن المتجر:", cleanDomain);
      
      // Try exact lowercase comparison
      foundStore = allStores.find(store => 
        store.domain_name && store.domain_name.toLowerCase() === cleanDomain
      );
      
      if (foundStore) {
        console.log("تم العثور على المتجر بالمقارنة اليدوية:", foundStore);
        
        // Fetch full store data
        const { data: fullStoreData, error: fullStoreError } = await supabase
          .from("stores")
          .select("*")
          .eq("id", foundStore.id)
          .maybeSingle();
          
        if (fullStoreError) {
          console.error("خطأ في جلب البيانات الكاملة للمتجر:", fullStoreError);
        } else if (fullStoreData) {
          foundStore = fullStoreData;
        }
      }
    }

    if (foundStore) {
      // Update the cache
      storeCache[cleanDomain] = {
        data: foundStore,
        timestamp: Date.now()
      };
      return foundStore;
    }

    // يطبع معلومات مفصلة عن جميع المتاجر للمساعدة في التصحيح
    console.log("لم يتم العثور على متجر:", {
      searchedDomain: cleanDomain,
      availableStores: allStores?.map(s => ({ 
        id: s.id,
        domain: s.domain_name, 
        name: s.store_name,
        status: s.status,
        domainLowercase: s.domain_name ? s.domain_name.toLowerCase() : null,
        exactMatch: s.domain_name === cleanDomain,
        lowercaseMatch: s.domain_name && s.domain_name.toLowerCase() === cleanDomain.toLowerCase()
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

/**
 * مسح الذاكرة المؤقتة للمتاجر
 */
export const clearStoreCache = () => {
  Object.keys(storeCache).forEach(key => {
    delete storeCache[key];
  });
  console.log("تم مسح الذاكرة المؤقتة للمتاجر");
};
