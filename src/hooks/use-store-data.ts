
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StoreData {
  id: string;
  name: string;
  domain: string;
  description?: string;
  logo_url?: string;
  theme_id?: string;
  created_at?: string;
  updated_at?: string;
  banner_url?: string;
  owner_id?: string;
}

const fetchStoreData = async (): Promise<StoreData | null> => {
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Fetch the store data for the current user
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();
  
  if (error) {
    console.error('Error fetching store data:', error);
    throw error;
  }
  
  return data;
};

const useStoreData = () => {
  const storeQuery = useQuery({
    queryKey: ['storeData'],
    queryFn: fetchStoreData,
  });
  
  return { 
    storeData: storeQuery.data,
    isLoading: storeQuery.isLoading,
    error: storeQuery.error
  };
};

export default useStoreData;
