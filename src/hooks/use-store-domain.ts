
import { useParams } from "react-router-dom";
import { normalizeStoreDomain } from "@/utils/url-helpers";

/**
 * Hook to consistently handle store domain parameter across the application
 */
export function useStoreDomain() {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  
  // تتبع الدومين الأصلي قبل التحويل
  const rawDomainValue = storeDomain || '';
  
  // دائمًا قم بتنسيق الدومين للاتساق
  const normalizedDomain = normalizeStoreDomain(rawDomainValue);
  
  // معلومات تصحيح لمساعدة المطورين
  console.log("useStoreDomain - Raw domain from params:", rawDomainValue);
  console.log("useStoreDomain - Normalized domain:", normalizedDomain);
  
  // التحقق من وجود دومين صالح (ليس فارغًا ولا undefined)
  const isValidDomain = Boolean(normalizedDomain && normalizedDomain.length > 0);
  console.log("useStoreDomain - Is valid domain:", isValidDomain);
  
  // في حالة استخدام المسار /store بدون تحديد متجر
  const inStoresPath = window.location.pathname.includes('/store/');
  
  return {
    rawDomain: rawDomainValue,
    domain: normalizedDomain,
    isValidDomain,
    inStoresPath
  };
}
