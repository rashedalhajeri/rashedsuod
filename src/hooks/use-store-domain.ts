
import { useParams } from "react-router-dom";
import { normalizeStoreDomain } from "@/utils/url-helpers";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to consistently handle store domain parameter across the application
 */
export function useStoreDomain() {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  
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
          } else {
            console.log(`useStoreDomain - Store exists check: ${count} matches for ${normalizedDomain}`);
            if (data && data.length > 0) {
              console.log("useStoreDomain - Found store:", data[0]);
            }
          }
        } catch (err) {
          console.error("خطأ غير متوقع في التحقق من وجود المتجر:", err);
        }
      }
    };
    
    checkStoreExists();
  }, [normalizedDomain, rawDomainValue, isValidDomain]);
  
  return {
    rawDomain: rawDomainValue,
    domain: normalizedDomain,
    isValidDomain,
    inStoresPath
  };
}
