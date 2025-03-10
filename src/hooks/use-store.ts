
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useStore = () => {
  const [storeData, setStoreData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        
        // Get the user's current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('No active session found');
        }
        
        // Get the user's store(s)
        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        if (error) throw error;
        
        setStoreData(data);
      } catch (err) {
        console.error('Error fetching store data:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStoreData();
  }, []);
  
  return { storeData, isLoading, error };
};
