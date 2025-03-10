
import { useParams } from "react-router-dom";
import { normalizeStoreDomain } from "@/utils/url-helpers";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchStoreByDomain } from "@/utils/store-helpers";

/**
 * Hook to consistently handle store domain parameter across the application
 */
export function useStoreDomain() {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const [storeExists, setStoreExists] = useState<boolean | null>(null);
  
  // Track original domain before normalization
  const rawDomainValue = storeDomain || '';
  
  // Always normalize domain for consistency
  const normalizedDomain = normalizeStoreDomain(rawDomainValue);
  
  // Check if domain is valid (not empty or undefined)
  const isValidDomain = Boolean(normalizedDomain && normalizedDomain.length > 0);
  
  // Check if using /store/ path without specifying a store
  const inStoresPath = window.location.pathname.includes('/store/');
  
  // Log additional debug information
  useEffect(() => {
    // Print debug info to help developers
    console.log("useStoreDomain - Raw domain from params:", rawDomainValue);
    console.log("useStoreDomain - Normalized domain:", normalizedDomain);
    console.log("useStoreDomain - Is valid domain:", isValidDomain);
    
    // Check if store exists in database
    const checkStoreExists = async () => {
      if (normalizedDomain) {
        try {
          const storeData = await fetchStoreByDomain(normalizedDomain);
          setStoreExists(Boolean(storeData));
          
          if (storeData) {
            console.log("useStoreDomain - Found store:", storeData);
          } else {
            console.log("useStoreDomain - Store not found with domain:", normalizedDomain);
            
            // Fallback: Try direct query as a last resort
            const { data, error } = await supabase
              .from('stores')
              .select('id, store_name')
              .eq('domain_name', normalizedDomain)
              .limit(1);
              
            if (error) {
              console.error("Error in fallback store check:", error);
            } else if (data && data.length > 0) {
              console.log("useStoreDomain - Fallback found stores:", data);
              setStoreExists(true);
            } else {
              console.log("useStoreDomain - No stores found even with fallback check");
            }
          }
        } catch (err) {
          console.error("Unexpected error in checkStoreExists:", err);
          setStoreExists(false);
        }
      }
    };
    
    checkStoreExists();
  }, [normalizedDomain, rawDomainValue, isValidDomain]);
  
  return {
    rawDomain: rawDomainValue,
    domain: normalizedDomain,
    isValidDomain,
    inStoresPath,
    storeExists,
    isOnCustomDomain: false, // Always false now since we only use linok.me/store/name format
    isSubdomain: false // Always false now since we only use linok.me/store/name format
  };
}
