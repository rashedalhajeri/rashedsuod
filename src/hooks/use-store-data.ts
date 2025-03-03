
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { secureRetrieve } from "@/lib/encryption";
import { toast } from "sonner";

// Hook لجلب بيانات المتجر
export const useStoreData = () => {
  const fetchStoreData = async () => {
    const userId = await secureRetrieve('user-id');
    
    if (!userId) {
      throw new Error("لم يتم العثور على معرف المستخدم");
    }
    
    console.log("Fetching store data for user:", userId);
    
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', userId)
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
    staleTime: 1000 * 60 * 5, // 5 دقائق
    retry: 1,
    meta: {
      onError: (error: Error) => {
        console.error("خطأ في جلب بيانات المتجر:", error);
        toast.error("حدث خطأ في جلب بيانات المتجر");
      }
    }
  });
};

// دالة مساعدة لتنسيق العملة بناءً على عملة المتجر
export const getCurrencyFormatter = (currency: string = 'SAR') => {
  return (price: number) => {
    let currencyCode = currency;
    let locale = 'ar-SA';
    
    // تحديد اللغة المناسبة للعملة
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
