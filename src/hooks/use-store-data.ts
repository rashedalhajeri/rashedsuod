
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;
    
    // Fetch the store data for the current user
    const { data, error, count } = await supabase
      .from('stores')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .limit(1);
    
    if (error) {
      console.error('Error fetching store data:', error);
      throw error;
    }
    
    // If we have multiple stores, we'll just use the first one for now
    // In the future, we could add a store selector
    if (data && data.length > 0) {
      const firstStore = data[0];
      
      // If more than one store, show a toast notification
      if (count && count > 1) {
        toast({
          title: "تم العثور على أكثر من متجر",
          description: "تم تحديد المتجر الأول تلقائيًا. يمكنك إضافة ميزة تبديل المتاجر لاحقًا.",
          duration: 5000,
        });
        
        console.log(`User has ${count} stores, using first one:`, firstStore.store_name);
      }
      
      // Map store_name to name and domain_name to domain for interface compatibility
      const mappedData: StoreData = {
        ...firstStore,
        name: firstStore.store_name || '',
        domain: firstStore.domain_name || ''
      };
      
      return mappedData;
    }
    
    return null;
  } catch (error) {
    console.error("Error in fetchStoreData:", error);
    return null;
  }
};

export const useStoreData = () => {
  const storeQuery = useQuery({
    queryKey: ['storeData'],
    queryFn: fetchStoreData,
    retry: 1
  });
  
  return { 
    data: storeQuery.data,
    storeData: storeQuery.data,
    isLoading: storeQuery.isLoading,
    error: storeQuery.error
  };
};

export const getCurrencyFormatter = (currency = 'KWD') => {
  return (value: number) => {
    try {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'KWD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(value);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${value} د.ك`;
    }
  };
};

export const isPaidPlan = (plan?: string) => {
  if (!plan) return false;
  return ['premium', 'business', 'enterprise'].includes(plan);
};

export default useStoreData;
