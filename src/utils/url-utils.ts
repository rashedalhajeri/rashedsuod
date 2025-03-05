
/**
 * Utility functions for handling store URLs with subdomains
 */

/**
 * Format a store URL as a subdomain (storename.linok.me)
 * @param domainName The store's domain name
 * @returns The formatted store URL
 */
export const formatStoreUrl = (domainName: string): string => {
  if (!domainName) return '';
  
  // Clean the domain name - remove any protocol or www prefix if present
  const cleanDomain = domainName.replace(/^(https?:\/\/)?(www\.)?/, '');
  
  // Check if we're in development environment (localhost or lovableproject.com)
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname.includes('lovableproject.com');
  
  // If it already includes linok.me, ensure it's properly formatted
  if (cleanDomain.includes('linok.me')) {
    // Extract just the subdomain part
    const parts = cleanDomain.split('.');
    if (parts.length >= 3) {
      return `https://${parts[0]}.linok.me`;
    }
    return `https://${cleanDomain}`;
  }
  
  // In development environment, format as a path instead of subdomain
  if (isDevelopment) {
    // Use current origin for development
    return `${window.location.origin}/store/${cleanDomain}`;
  }
  
  // In production, format as subdomain
  return `https://${cleanDomain}.linok.me`;
};

/**
 * Get the full store URL based on store data
 * @param storeData Store data object containing domain_name and id
 * @returns The formatted store URL
 */
export const getStoreUrl = (storeData: any): string => {
  if (!storeData) return '';
  
  // Check if we're in development environment
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname.includes('lovableproject.com');
  
  // If domain name exists, use it to create the URL
  if (storeData.domain_name) {
    return formatStoreUrl(storeData.domain_name);
  }
  
  // Fallback to ID-based URL
  if (storeData.id) {
    // In development, use path-based URL
    if (isDevelopment) {
      return `${window.location.origin}/store/${storeData.id}`;
    }
    
    // In production with no domain name yet, use full URL with path
    return `${window.location.origin}/store/${storeData.id}`;
  }
  
  return '';
};

/**
 * Validate a domain name for use as a subdomain
 * @param domainName The domain name to validate
 * @returns Boolean indicating if the domain name is valid
 */
export const isValidDomainName = (domainName: string): boolean => {
  // Only allow alphanumeric characters and hyphens, no spaces or special chars
  const domainRegex = /^[a-zA-Z0-9-]+$/;
  return domainRegex.test(domainName);
};

/**
 * Get store data from the URL storeId parameter (either ID or domain name)
 * @param storeId The storeId from URL params (could be UUID or domain name)
 * @param supabase Supabase client instance
 * @returns Promise with the store data or error
 */
export const getStoreFromUrl = async (storeId: string, supabase: any) => {
  if (!storeId) return { data: null, error: { message: "معرف المتجر غير متوفر" } };
  
  try {
    // Remove any `:` character that might be in the param (from useParams)
    const cleanId = storeId.replace(/:/g, '');
    
    // First try to fetch by domain name (more likely in production)
    let { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("domain_name", cleanId)
      .maybeSingle();
    
    // If not found by domain, try by UUID
    if (!data && !error) {
      // Only try UUID lookup if the cleanId looks like a UUID
      if (cleanId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        ({ data, error } = await supabase
          .from("stores")
          .select("*")
          .eq("id", cleanId)
          .maybeSingle());
      }
    }
    
    return { data, error };
  } catch (err) {
    console.error("Error in getStoreFromUrl:", err);
    return { data: null, error: err };
  }
};
