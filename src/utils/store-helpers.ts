
import { supabase } from "@/integrations/supabase/client";
import { normalizeStoreDomain } from "./url-helpers";

// Simple in-memory cache for store data
const storeCache: Record<string, any> = {};

/**
 * Clears the store cache, useful when retrying fetches
 */
export const clearStoreCache = () => {
  Object.keys(storeCache).forEach(key => {
    delete storeCache[key];
  });
  console.log("Store cache cleared");
};

/**
 * Fetch a store by domain name with simplified, direct lookup
 */
export const fetchStoreByDomain = async (domainName: string) => {
  if (!domainName) return null;

  const cleanDomain = normalizeStoreDomain(domainName);
  console.log("Looking up store:", cleanDomain);

  // Check cache first
  if (storeCache[cleanDomain]) {
    console.log("Cache hit for domain:", cleanDomain);
    return storeCache[cleanDomain];
  }

  try {
    // Standard domain lookup - always using domain_name field
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("domain_name", cleanDomain.toLowerCase())
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching store:", error);
      return null;
    }
    
    // Cache the result for future lookups
    if (data) {
      storeCache[cleanDomain] = data;
    }
    
    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    return null;
  }
};

/**
 * Simplified store status check
 */
export const checkStoreStatus = async (domainName: string) => {
  try {
    const store = await fetchStoreByDomain(domainName);
    return { 
      exists: Boolean(store), 
      active: store?.status === 'active',
      store 
    };
  } catch (error) {
    console.error("Error checking store status:", error);
    return { exists: false, active: false, store: null };
  }
};
