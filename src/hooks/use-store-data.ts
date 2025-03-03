
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { secureRetrieve } from "@/lib/encryption";
import { toast } from "sonner";

// Extended store type with subscription_plan
type StoreData = {
  id: string;
  user_id: string;
  store_name: string;
  domain_name: string;
  phone_number: string;
  country: string;
  currency: string;
  created_at: string;
  updated_at: string;
  subscription_plan: "basic" | "premium"; // Add this property
};

// Hook for fetching store data
export const useStoreData = () => {
  const fetchStoreData = async () => {
    const userId = await secureRetrieve('user-id');
    
    if (!userId) {
      throw new Error("لم يتم العثور على معرف المستخدم");
    }
    
    console.log("Fetching store data for user:", userId);
    
    // استخدام limit(1) بدلاً من single() لتجنب الخطأ عند وجود أكثر من متجر
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
    
    // Add subscription_plan with a default value since it doesn't exist in the database yet
    return {
      ...data,
      subscription_plan: "basic" as "basic" | "premium" // Default to basic plan
    } as StoreData;
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

// دالة مساعدة لتنسيق العملة بناءً على عملة المتجر
export const getCurrencyFormatter = (currency: string = 'SAR') => {
  return (price: number) => {
    let currencyCode = currency;
    let locale = 'ar-SA';
    
    // تعيين اللغة المناسبة للعملة
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
