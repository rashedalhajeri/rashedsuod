
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { detectStoreFromUrl } from "@/utils/url-utils";

/**
 * Hook for detecting and loading store data from URL (either subdomain or path parameter)
 * @returns Store detection state and store data
 */
export const useStoreDetection = () => {
  const { storeId: storeIdFromPath } = useParams<{ storeId?: string }>();
  const navigate = useNavigate();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const detectStore = async () => {
      try {
        setLoading(true);
        
        console.log('useStoreDetection running with path param:', storeIdFromPath);
        
        // Try to detect store from either subdomain or path parameter
        const { data, error } = await detectStoreFromUrl(supabase, storeIdFromPath);
        
        if (error) {
          console.error("Error detecting store:", error);
          setError("لم نتمكن من العثور على المتجر");
          setLoading(false);
          return;
        }
        
        if (!data) {
          console.error("No store found");
          setError("المتجر غير موجود");
          setLoading(false);
          return;
        }
        
        console.log("Store detected:", data);
        setStore(data);
        
        // If we're using a subdomain but URL has a different storeId
        // Update the URL to be consistent
        const subdomain = extractSubdomain();
        if (subdomain && storeIdFromPath && data.domain_name !== storeIdFromPath) {
          console.log('Redirecting to correct store URL');
          navigate(`/store/${data.id}`, { replace: true });
        }
      } catch (err) {
        console.error("Error in store detection:", err);
        setError("حدث خطأ أثناء محاولة تحميل بيانات المتجر");
      } finally {
        setLoading(false);
      }
    };
    
    detectStore();
  }, [storeIdFromPath, navigate]);
  
  return { store, loading, error };
};

// Also export the reusable function for direct import
export const extractSubdomain = () => {
  const hostname = window.location.hostname;
  
  // In development or non-linok.me domains, return null
  if (hostname === 'localhost' || 
      hostname.includes('lovableproject.com') || 
      hostname.includes('lovable.app') || 
      !hostname.includes('linok.me')) {
    return null;
  }
  
  // Parse the hostname to get subdomain in production
  const parts = hostname.split('.');
  
  // Valid subdomain pattern: subdomain.linok.me (3 parts)
  if (parts.length === 3 && parts[1] === 'linok' && parts[2] === 'me') {
    return parts[0];
  }
  
  return null;
};
