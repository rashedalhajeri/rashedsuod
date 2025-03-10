
import { supabase } from "@/integrations/supabase/client";
import { normalizeStoreDomain } from "./url-helpers";

// Improved in-memory cache for store data with timestamp
const storeCache: Record<string, {data: any, timestamp: number}> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Robust function to fetch a store by domain name
 * Uses multiple fallback strategies to ensure reliable store lookup
 */
export const fetchStoreByDomain = async (domainName: string) => {
  if (!domainName) {
    console.error("Domain name is empty or undefined");
    return null;
  }

  const cleanDomain = normalizeStoreDomain(domainName);
  console.log("Searching for store with fetchStoreByDomain:", {
    originalDomain: domainName,
    cleanDomain,
    timestamp: new Date().toISOString()
  });

  // Check the cache first
  const cachedData = storeCache[cleanDomain];
  if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
    console.log("Retrieved store from cache:", cleanDomain);
    return cachedData.data;
  }

  try {
    // STRATEGY 1: Exact match using direct equals comparison
    const { data: exactMatch, error: exactError } = await supabase
      .from("stores")
      .select("*")
      .eq("domain_name", cleanDomain)
      .maybeSingle();

    if (exactError) {
      console.error("Error in direct search:", {
        error: exactError,
        domain: cleanDomain,
        timestamp: new Date().toISOString()
      });
    }

    if (exactMatch) {
      console.log("Found store (direct match):", exactMatch);
      // Update the cache
      storeCache[cleanDomain] = {
        data: exactMatch,
        timestamp: Date.now()
      };
      return exactMatch;
    }

    // STRATEGY 2: Case-insensitive match
    const { data: caseMatch, error: caseError } = await supabase
      .from("stores")
      .select("*")
      .ilike("domain_name", cleanDomain)
      .maybeSingle();

    if (caseError) {
      console.error("Error in case-insensitive search:", {
        error: caseError,
        domain: cleanDomain,
        timestamp: new Date().toISOString()
      });
    }

    if (caseMatch) {
      console.log("Found store (case-insensitive match):", caseMatch);
      // Update the cache
      storeCache[cleanDomain] = {
        data: caseMatch,
        timestamp: Date.now()
      };
      return caseMatch;
    }

    // STRATEGY 3: Fetch all stores for manual comparison
    const { data: allStores, error: allStoresError } = await supabase
      .from("stores")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
      
    if (allStoresError) {
      console.error("Error fetching all stores:", allStoresError);
    }
    
    if (allStores && allStores.length > 0) {
      console.log("Manual store search for:", cleanDomain);
      
      // Look for exact lowercase match
      const manualMatch = allStores.find(store => 
        store.domain_name && store.domain_name.toLowerCase() === cleanDomain.toLowerCase()
      );
      
      if (manualMatch) {
        console.log("Found store through manual comparison:", manualMatch);
        // Update the cache
        storeCache[cleanDomain] = {
          data: manualMatch,
          timestamp: Date.now()
        };
        return manualMatch;
      }
      
      // Look for partial matches as a last resort
      const partialMatches = allStores.filter(store => 
        store.domain_name && 
        (store.domain_name.toLowerCase().includes(cleanDomain.toLowerCase()) || 
         cleanDomain.toLowerCase().includes(store.domain_name.toLowerCase()))
      );
      
      if (partialMatches.length > 0) {
        console.log("Found partial domain matches:", partialMatches);
        
        // If we find only one partial match, return it
        if (partialMatches.length === 1) {
          const bestMatch = partialMatches[0];
          console.log("Using best partial match:", bestMatch);
          
          // Update the cache
          storeCache[cleanDomain] = {
            data: bestMatch,
            timestamp: Date.now()
          };
          return bestMatch;
        }
      }
    }

    // Print detailed info about all stores to help with debugging
    console.log("No store found:", {
      searchedDomain: cleanDomain,
      availableStores: allStores?.map(s => ({ 
        id: s.id,
        domain: s.domain_name, 
        name: s.store_name,
        status: s.status,
        domainLowercase: s.domain_name ? s.domain_name.toLowerCase() : null,
        cleanDomainLowercase: cleanDomain.toLowerCase(),
        matches: s.domain_name && s.domain_name.toLowerCase() === cleanDomain.toLowerCase()
      })) || []
    });

    return null;
  } catch (err) {
    console.error("Unexpected error in fetchStoreByDomain:", {
      error: err,
      domain: cleanDomain,
      timestamp: new Date().toISOString()
    });
    return null;
  }
};

/**
 * Check if a store exists and is active
 */
export const checkStoreStatus = async (domainName: string) => {
  const store = await fetchStoreByDomain(domainName);
  
  if (!store) {
    return { exists: false, active: false, store: null };
  }
  
  const isActive = store.status === 'active';
  return { exists: true, active: isActive, store };
};

/**
 * Clear the store cache
 */
export const clearStoreCache = () => {
  Object.keys(storeCache).forEach(key => {
    delete storeCache[key];
  });
  console.log("Store cache cleared");
};
