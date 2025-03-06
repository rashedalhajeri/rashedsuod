
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
}

const fetchStoreData = async (): Promise<StoreData | null> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Fetch the store data for the current user
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching store data:', error);
    throw error;
  }
  
  // Map store_name to name and domain_name to domain for interface compatibility
  if (data) {
    return {
      ...data,
      name: data.store_name,
      domain: data.domain_name
    };
  }
  
  return data;
};

export const useStoreData = () => {
  const storeQuery = useQuery({
    queryKey: ['storeData'],
    queryFn: fetchStoreData,
  });
  
  return { 
    data: storeQuery.data,
    storeData: storeQuery.data,
    isLoading: storeQuery.isLoading,
    error: storeQuery.error
  };
};

export const getCurrencyFormatter = (currency = 'SAR') => {
  return (value: number) => {
    try {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${value} ${currency}`;
    }
  };
};

export const isPaidPlan = (plan?: string) => {
  if (!plan) return false;
  return ['premium', 'business', 'enterprise'].includes(plan);
};

export default useStoreData;
