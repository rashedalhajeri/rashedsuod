
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
                        window.location.hostname.includes('lovableproject.com') ||
                        window.location.hostname.includes('lovable.app');
  
  console.log('Current hostname:', window.location.hostname);
  console.log('Is development environment:', isDevelopment);
  
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
    console.log('Creating development URL with path:', `${window.location.origin}/store/${cleanDomain}`);
    return `${window.location.origin}/store/${cleanDomain}`;
  }
  
  // In production, format as subdomain
  console.log('Creating production URL with subdomain:', `https://${cleanDomain}.linok.me`);
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
                        window.location.hostname.includes('lovableproject.com') ||
                        window.location.hostname.includes('lovable.app');
  
  console.log('Getting store URL for:', storeData);
  
  // If domain name exists, use it to create the URL
  if (storeData.domain_name) {
    return formatStoreUrl(storeData.domain_name);
  }
  
  // Fallback to ID-based URL
  if (storeData.id) {
    // In development, use path-based URL
    if (isDevelopment) {
      console.log('Creating development URL with ID:', `${window.location.origin}/store/${storeData.id}`);
      return `${window.location.origin}/store/${storeData.id}`;
    }
    
    // In production with no domain name yet, use full URL with path
    console.log('Creating production URL with ID path:', `https://linok.me/store/${storeData.id}`);
    return `https://linok.me/store/${storeData.id}`;
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
 * Extract the subdomain from the current URL
 * @returns The subdomain or null if not a subdomain URL
 */
export const extractSubdomain = (): string | null => {
  const hostname = window.location.hostname;
  
  console.log('Extracting subdomain from:', hostname);
  
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
    // Also remove leading/trailing spaces that might cause issues
    const cleanId = storeId.replace(/:/g, '').trim();
    console.log('Clean store ID/domain:', cleanId);
    
    if (!cleanId) {
      return { data: null, error: { message: "معرف المتجر غير صالح" } };
    }
    
    // First try to fetch by domain name (more likely in production)
    // Using ILIKE for case-insensitive matching
    let { data, error } = await supabase
      .from("stores")
      .select("*")
      .ilike("domain_name", cleanId)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors
    
    console.log('Search by domain result:', data, error);
    
    // If not found by domain, try by UUID
    if (!data && !error) {
      // Only try UUID lookup if the cleanId looks like a UUID
      if (cleanId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        console.log('Trying to fetch by UUID:', cleanId);
        ({ data, error } = await supabase
          .from("stores")
          .select("*")
          .eq("id", cleanId)
          .maybeSingle());
          
        console.log('Search by UUID result:', data, error);
      }
    }
    
    // If we still don't have data, try again with exact matching (in case ilike returned multiple)
    if (!data && !error) {
      console.log('Trying exact domain match as fallback');
      ({ data, error } = await supabase
        .from("stores")
        .select("*")
        .eq("domain_name", cleanId)
        .maybeSingle());
        
      console.log('Exact domain match result:', data, error);
    }
    
    return { data, error };
  } catch (err) {
    console.error("Error in getStoreFromUrl:", err);
    return { data: null, error: err };
  }
};

/**
 * Detect store from current URL (either from path parameter or subdomain)
 * @param supabase Supabase client instance
 * @param storeIdFromPath Optional storeId from URL path parameter
 * @returns Promise with the store data or error
 */
export const detectStoreFromUrl = async (supabase: any, storeIdFromPath?: string) => {
  console.log('Detecting store from URL, path param:', storeIdFromPath);
  
  // First, try to detect from subdomain in production
  const subdomain = extractSubdomain();
  
  console.log('Extracted subdomain:', subdomain);
  
  if (subdomain) {
    console.log('Trying to find store by subdomain:', subdomain);
    return await getStoreFromUrl(subdomain, supabase);
  }
  
  // If no subdomain or in development, try from path parameter
  if (storeIdFromPath) {
    console.log('Trying to find store by path parameter:', storeIdFromPath);
    return await getStoreFromUrl(storeIdFromPath, supabase);
  }
  
  return { data: null, error: { message: "لم يتم العثور على معرف المتجر" } };
};
