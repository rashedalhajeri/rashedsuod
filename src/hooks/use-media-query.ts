
import { useState, useEffect } from "react";

/**
 * هوك لاختبار استعلام الميديا - يعمل أيضًا خلال العرض الأولي على الخادم
 * @param query استعلام الميديا المطلوب اختباره
 * @returns قيمة منطقية توضح إذا كان الاستعلام متطابقًا
 */
export function useMediaQuery(query: string): boolean {
  // تحديد القيمة الأولية استنادًا إلى المتصفح أو عرض الخادم
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    // تجاوز التأثير إذا كان الكود يعمل على الخادم
    if (typeof window === "undefined") {
      return;
    }

    // إنشاء كائن استعلام الميديا
    const mediaQueryList = window.matchMedia(query);
    
    // دالة الاستماع للتغييرات
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // إضافة المستمع للتغييرات في حجم الشاشة
    mediaQueryList.addEventListener("change", listener);
    
    // تنظيف المستمع عند إلغاء تركيب المكون
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}

/**
 * هوك لاكتشاف ما إذا كان الجهاز محمولاً
 * @returns قيمة منطقية تدل على ما إذا كان الجهاز محمولاً
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

/**
 * هوك لاكتشاف ما إذا كان الجهاز لوحيًا
 * @returns قيمة منطقية تدل على ما إذا كان الجهاز لوحيًا
 */
export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
}

/**
 * هوك لاكتشاف ما إذا كان الجهاز محمولاً أو لوحيًا
 * @returns قيمة منطقية تدل على ما إذا كان الجهاز محمولاً أو لوحيًا
 */
export function useIsMobileOrTablet(): boolean {
  return useMediaQuery("(max-width: 1024px)");
}

/**
 * هوك لاكتشاف ما إذا كان الجهاز حاسوبًا
 * @returns قيمة منطقية تدل على ما إذا كان الجهاز حاسوبًا
 */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1025px)");
}
