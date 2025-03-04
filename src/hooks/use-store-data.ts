import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { secureRetrieve } from "@/lib/encryption";
import { toast } from "sonner";

// Extended store type with subscription_plan and logo_url
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
  subscription_plan: "free" | "basic" | "premium"; // Include free plan
  subscription_start_date?: string;
  subscription_end_date?: string;
  logo_url?: string | null; // Added logo_url property
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
    
    // Get user metadata for subscription info if not in store data
    const { data: userData } = await supabase.auth.getUser();
    const userMetadata = userData?.user?.user_metadata;
    
    // Default to free plan if no subscription info is found
    return {
      ...data,
      subscription_plan: data.subscription_plan || userMetadata?.subscription_plan || "free" as "free" | "basic" | "premium",
      subscription_start_date: data.subscription_start_date || userMetadata?.subscription_start_date,
      subscription_end_date: data.subscription_end_date || userMetadata?.subscription_end_date,
      logo_url: data.logo_url || null // Handle logo_url from data
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

// Helper function to check if a subscription is valid
export const isSubscriptionValid = (endDate?: string): boolean => {
  if (!endDate) return false;
  
  const now = new Date();
  const subscriptionEnd = new Date(endDate);
  
  return subscriptionEnd > now;
};

// Helper function to get remaining days in subscription
export const getRemainingDays = (endDate?: string): number => {
  if (!endDate) return 0;
  
  const now = new Date();
  const subscriptionEnd = new Date(endDate);
  
  // If subscription has expired, return 0
  if (subscriptionEnd <= now) return 0;
  
  // Calculate difference in days
  const diffTime = subscriptionEnd.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to check if plan is a paid plan (basic or premium)
export const isPaidPlan = (plan?: "free" | "basic" | "premium"): boolean => {
  return plan === "basic" || plan === "premium";
};

export default useStoreData;
