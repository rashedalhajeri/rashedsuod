
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { createCurrencyFormatter } from "./use-currency-formatter";

export interface StoreData {
  id: string;
  name: string;
  domain: string;
  store_name?: string;
  domain_name?: string;
  description?: string;
  logo_url?: string;
  theme_id?: string;
  created_at?: string;
  updated_at?: string;
  banner_url?: string;
  owner_id?: string;
  user_id?: string;
  country?: string;
  currency?: string;
  phone_number?: string;
  status?: string;
  subscription_plan?: string;
  subscription_end_date?: string;
  custom_domain?: string;
  custom_domain_verified?: boolean;
}

/**
 * Fetches the current user's store data from Supabase
 * @returns Promise with store data or null
 */
export const fetchStoreData = async (): Promise<StoreData | null> => {
  try {
    // Get the current user
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }
    
    if (!authData.user) {
      console.warn('No authenticated user found');
      return null;
    }
    
    const userId = authData.user.id;
    
    // Fetch the store data for the current user
    const { data, error, count } = await supabase
      .from('stores')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .limit(1);
    
    if (error) {
      console.error('Error fetching store data:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.warn('No store found for user:', userId);
      return null;
    }
    
    // Get the first store
    const firstStore = data[0];
    
    // Handle multiple stores case
    handleMultipleStores(count || 0, firstStore);
    
    // Map store data to interface
    return mapStoreData(firstStore);
  } catch (error) {
    console.error("Error in fetchStoreData:", error);
    throw error; // Re-throw to allow the query to handle the error
  }
};

/**
 * Shows a notification if multiple stores are found
 */
const handleMultipleStores = (count: number, firstStore: any): void => {
  if (count > 1) {
    toast("تم العثور على أكثر من متجر", {
      description: "تم تحديد المتجر الأول تلقائيًا. يمكنك إضافة ميزة تبديل المتاجر لاحقًا.",
      duration: 5000,
    });
    
    console.log(`User has ${count} stores, using first one:`, firstStore.store_name);
  }
};

/**
 * Maps raw store data from DB to StoreData interface
 */
const mapStoreData = (storeData: any): StoreData => {
  return {
    ...storeData,
    name: storeData.store_name || '',
    domain: storeData.domain_name || ''
  };
};

/**
 * Custom hook to fetch and manage store data
 */
export const useStoreData = () => {
  const storeQuery = useQuery({
    queryKey: ['storeData'],
    queryFn: fetchStoreData,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  return { 
    data: storeQuery.data,
    storeData: storeQuery.data,
    isLoading: storeQuery.isLoading,
    error: storeQuery.error,
    refetch: storeQuery.refetch
  };
};

/**
 * Creates a formatter function for a specific currency
 * @param currency Currency code (default: 'KWD')
 * @returns Formatter function that takes a number and returns formatted currency string
 */
export const getCurrencyFormatter = (currency?: string) => {
  return createCurrencyFormatter(currency);
};

/**
 * Gets currency symbol based on currency code
 */
const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'KWD':
      return 'د.ك';
    case 'SAR':
      return 'ر.س';
    case 'AED':
      return 'د.إ';
    case 'USD':
      return '$';
    default:
      return currency;
  }
};

/**
 * Checks if a subscription plan is a paid plan
 * @param plan Subscription plan name
 * @returns boolean indicating if it's a paid plan
 */
export const isPaidPlan = (plan?: string): boolean => {
  if (!plan) return false;
  return ['premium', 'business', 'enterprise'].includes(plan);
};

/**
 * Gets the plan tier level (0=free, 1=basic, 2=premium, 3=business, 4=enterprise)
 * @param plan Subscription plan name
 * @returns number representing the plan tier level
 */
export const getPlanTier = (plan?: string): number => {
  if (!plan) return 0;
  
  const tiers: Record<string, number> = {
    'free': 0,
    'basic': 1,
    'premium': 2,
    'business': 3,
    'enterprise': 4
  };
  
  return tiers[plan] || 0;
};

export default useStoreData;
