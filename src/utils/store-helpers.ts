
import { supabase } from "@/integrations/supabase/client";
import { normalizeStoreDomain } from "./url-helpers";

/**
 * Fetch a store by domain name with simplified, direct lookup
 */
export const fetchStoreByDomain = async (domainName: string) => {
  if (!domainName) return null;

  const cleanDomain = normalizeStoreDomain(domainName);
  console.log("Looking up store:", cleanDomain);

  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("domain_name", cleanDomain.toLowerCase())
      .maybeSingle();
      
    if (error) {
      console.error("Error fetching store:", error);
      return null;
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
  const store = await fetchStoreByDomain(domainName);
  return { 
    exists: Boolean(store), 
    active: store?.status === 'active',
    store 
  };
};
