
import { useParams } from "react-router-dom";
import { normalizeStoreDomain } from "@/utils/url-helpers";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to consistently handle store domain parameter across the application
 */
export function useStoreDomain() {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const [storeExists, setStoreExists] = useState<boolean | null>(null);
  
  // تتبع الدومين الأصلي قبل التحويل
  const rawDomainValue = storeDomain || '';
  
  // دائمًا قم بتنسيق الدومين للاتساق
  const normalizedDomain = normalizeStoreDomain(rawDomainValue);
  
  // التحقق من وجود دومين صالح (ليس فارغًا ولا undefined)
  const isValidDomain = Boolean(normalizedDomain && normalizedDomain.length > 0);
  
  // في حالة استخدام المسار /store بدون تحديد متجر
  const inStoresPath = window.location.pathname.includes('/store/');
  
  // تسجيل معلومات إضافية للتصحيح
  useEffect(() => {
    // طباعة معلومات تصحيح لمساعدة المطورين
    console.log("useStoreDomain - Raw domain from params:", rawDomainValue);
    console.log("useStoreDomain - Normalized domain:", normalizedDomain);
    console.log("useStoreDomain - Is valid domain:", isValidDomain);
    
    // التحقق من وجود المتجر في قاعدة البيانات
    const checkStoreExists = async () => {
      if (normalizedDomain) {
        try {
          const { data, error, count } = await supabase
            .from('stores')
            .select('domain_name, store_name, status', { count: 'exact' })
            .eq('domain_name', normalizedDomain);
            
          if (error) {
            console.error("خطأ في التحقق من وجود المتجر:", error);
            setStoreExists(false);
          } else {
            console.log(`useStoreDomain - Store exists check: ${count} matches for ${normalizedDomain}`);
            setStoreExists(count && count > 0);
            
            if (data && data.length > 0) {
              console.log("useStoreDomain - Found store:", data[0]);
            } else {
              // تجربة البحث الحساس لحالة الأحرف
              const { data: likeData, count: likeCount } = await supabase
                .from('stores')
                .select('domain_name, store_name, status', { count: 'exact' })
                .ilike('domain_name', normalizedDomain);
                
              console.log(`useStoreDomain - Store exists check (case insensitive): ${likeCount} matches for ${normalizedDomain}`);
              
              if (likeData && likeData.length > 0) {
                console.log("useStoreDomain - Found store (case insensitive):", likeData[0]);
              }
              
              // جلب جميع المتاجر للفحص اليدوي
              const { data: allStores } = await supabase
                .from('stores')
                .select('domain_name, store_name, status')
                .order('created_at', { ascending: false })
                .limit(10);
                
              if (allStores) {
                const manualMatch = allStores.find(store => 
                  store.domain_name && store.domain_name.toLowerCase() === normalizedDomain.toLowerCase()
                );
                
                if (manualMatch) {
                  console.log("useStoreDomain - Found store (manual comparison):", manualMatch);
                  setStoreExists(true);
                } else {
                  console.log("useStoreDomain - No matching stores found in the first 10 stores");
                }
              }
            }
          }
        } catch (err) {
          console.error("خطأ غير متوقع في التحقق من وجود المتجر:", err);
          setStoreExists(false);
        }
      }
    };
    
    checkStoreExists();
  }, [normalizedDomain, rawDomainValue, isValidDomain]);
  
  return {
    rawDomain: rawDomainValue,
    domain: normalizedDomain,
    isValidDomain,
    inStoresPath,
    storeExists
  };
}
