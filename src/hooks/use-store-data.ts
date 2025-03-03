
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { secureRetrieve } from "@/lib/encryption";
import { toast } from "sonner";

// Hook for fetching store data
export const useStoreData = () => {
  const fetchStoreData = async () => {
    const userId = await secureRetrieve('user-id');
    
    if (!userId) {
      throw new Error("لم يتم العثور على معرف المستخدم");
    }
    
    console.log("Fetching store data for user:", userId);
    
    // FIXED: استخدام limit(1) بدلاً من single() لتجنب الخطأ عند وجود أكثر من متجر
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error("خطأ في جلب بيانات المتجر:", error);
      throw new Error("فشل في جلب بيانات المتجر");
    }
    
    return data;
  };
  
  return useQuery({
    queryKey: ['storeData'],
    queryFn: fetchStoreData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error("خطأ في جلب بيانات المتجر:", error);
        toast.error("حدث خطأ في جلب بيانات المتجر");
      }
    }
  });
};

// Helper function for formatting currency based on store currency
export const getCurrencyFormatter = (currency: string = 'SAR') => {
  return (price: number) => {
    let currencyCode = currency;
    let locale = 'ar-SA';
    
    // Set appropriate locale for the currency
    switch (currency) {
      case 'KWD':
        locale = 'ar-KW';
        break;
      case 'AED':
        locale = 'ar-AE';
        break;
      case 'QAR':
        locale = 'ar-QA';
        break;
      case 'BHD':
        locale = 'ar-BH';
        break;
      case 'OMR':
        locale = 'ar-OM';
        break;
      default:
        locale = 'ar-SA';
    }
    
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode
    }).format(price);
  };
};

export default useStoreData;
