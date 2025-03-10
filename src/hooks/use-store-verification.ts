
import { useState, useEffect } from 'react';
import { useStoreDomain } from '@/hooks/use-store-domain';
import { checkStoreStatus } from '@/utils/store-helpers';

export const useStoreVerification = () => {
  const { domain, isValidDomain } = useStoreDomain();
  const [isVerifying, setIsVerifying] = useState(true);
  const [storeData, setStoreData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyStore = async () => {
      if (!isValidDomain || !domain) {
        setError('Invalid domain');
        setIsVerifying(false);
        return;
      }

      try {
        const { exists, active, store } = await checkStoreStatus(domain);
        
        if (!exists) {
          setError('Store not found');
        } else if (!active) {
          setError('Store is inactive');
        } else {
          setStoreData(store);
          setError(null);
        }
      } catch (err) {
        setError('Error verifying store');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyStore();
  }, [domain, isValidDomain]);

  return {
    isVerifying,
    storeData,
    error,
    isValid: !error && Boolean(storeData)
  };
};
