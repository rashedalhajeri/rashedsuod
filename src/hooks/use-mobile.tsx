import { useState, useEffect } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // تحديث الحالة عندما يتغير mediaQuery
    const updateMatches = () => {
      setMatches(mediaQuery.matches);
    };
    
    // استدعاء الدالة مبدئياً
    updateMatches();
    
    // إضافة مستمع لتغييرات mediaQuery
    mediaQuery.addEventListener("change", updateMatches);
    
    // تنظيف المستمع عند فك المكون
    return () => {
      mediaQuery.removeEventListener("change", updateMatches);
    };
  }, [query]);

  return matches;
}

// Add useIsMobile hook for mobile detection
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 768px)");
}

// For backward compatibility, keep useMobile as an alias to useIsMobile
export const useMobile = useIsMobile;
