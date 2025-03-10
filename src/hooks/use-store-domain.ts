
import { useParams } from "react-router-dom";
import { normalizeStoreDomain, isCustomDomain } from "@/utils/url-helpers";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { fetchStoreByDomain } from "@/utils/store-helpers";

/**
 * Hook to consistently handle store domain parameter across the application
 */
export function useStoreDomain() {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const [storeExists, setStoreExists] = useState<boolean | null>(null);
  
  // Check if we're on a custom domain
  const [isOnCustomDomain, setIsOnCustomDomain] = useState(false);
  
  // Track original domain before normalization
  const rawDomainValue = storeDomain || '';
  
  // Detect if we're on a custom domain or a subdomain of our platform
  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Check if we're on a subdomain of our platform or a completely custom domain
    const isCustom = hostname !== 'localhost' && 
                      !hostname.includes('lovableproject.com') &&
                      !hostname.includes('vercel.app');
    
    setIsOnCustomDomain(isCustom);
    
    // Log the current hostname for debugging
    console.log("Current hostname:", hostname);
  }, []);
  
  // Handle custom domain case
  useEffect(() => {
    if (isOnCustomDomain && !storeDomain) {
      console.log("On custom domain or subdomain:", window.location.hostname);
      // We're on a custom domain or subdomain but don't have a storeDomain param
      // This means the domain/subdomain itself is the store identifier
    }
  }, [isOnCustomDomain, storeDomain]);
  
  // Always normalize domain for consistency
  const normalizedDomain = isOnCustomDomain && !storeDomain ? 
    normalizeStoreDomain(window.location.hostname) :
    normalizeStoreDomain(rawDomainValue);
  
  // Check if domain is valid (not empty or undefined)
  const isValidDomain = Boolean(normalizedDomain && normalizedDomain.length > 0);
  
  // Check if using /store/ path without specifying a store
  const inStoresPath = window.location.pathname.includes('/store/');
  
  // Check if we're on a subdomain of our platform (not a completely custom domain)
  const isSubdomain = isOnCustomDomain && 
                      window.location.hostname.includes('linok.me') && 
                      window.location.hostname !== 'linok.me';
  
  // Log additional debug information
  useEffect(() => {
    // Print debug info to help developers
    console.log("useStoreDomain - Raw domain from params:", rawDomainValue);
    console.log("useStoreDomain - Using custom domain/subdomain:", isOnCustomDomain);
    console.log("useStoreDomain - Is subdomain:", isSubdomain);
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
            const { data, error, count } = await supabase
              .from('stores')
              .select('*', { count: 'exact' })
              .or(`domain_name.eq.${normalizedDomain},custom_domain.eq.${normalizedDomain}`)
              .limit(10);
              
            if (error) {
              console.error("Error in fallback store check:", error);
            } else if (data && data.length > 0) {
              console.log("useStoreDomain - Fallback found stores:", data);
              setStoreExists(true);
            } else {
              console.log("useStoreDomain - No stores found even with fallback check");
              
              // If we're on a subdomain, try to extract the subdomain part
              if (isSubdomain) {
                const subdomain = window.location.hostname.split('.')[0];
                console.log("Checking subdomain part:", subdomain);
                
                const { data: subdomainStores } = await supabase
                  .from('stores')
                  .select('*')
                  .eq('domain_name', subdomain)
                  .limit(1);
                  
                if (subdomainStores && subdomainStores.length > 0) {
                  console.log("Found store by subdomain:", subdomainStores[0]);
                  setStoreExists(true);
                }
              }
              
              // Get all stores for manual debugging
              const { data: allStores } = await supabase
                .from('stores')
                .select('id, domain_name, custom_domain, store_name, status')
                .order('created_at', { ascending: false })
                .limit(20);
                
              console.log("useStoreDomain - All available stores:", allStores);
            }
          }
        } catch (err) {
          console.error("Unexpected error in checkStoreExists:", err);
          setStoreExists(false);
        }
      }
    };
    
    checkStoreExists();
  }, [normalizedDomain, rawDomainValue, isValidDomain, isOnCustomDomain, isSubdomain]);
  
  return {
    rawDomain: rawDomainValue,
    domain: normalizedDomain,
    isValidDomain,
    inStoresPath,
    storeExists,
    isOnCustomDomain,
    isSubdomain
  };
}
