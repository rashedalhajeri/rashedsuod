
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
    
    // Try both domain name and ID approaches in parallel for faster response
    const domainPromise = supabase
      .from("stores")
      .select("*")
      .ilike("domain_name", cleanId)
      .maybeSingle();
      
    // Only try UUID lookup if the cleanId looks like a UUID
    let idPromise = { data: null, error: null };
    if (cleanId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      idPromise = supabase
        .from("stores")
        .select("*")
        .eq("id", cleanId)
        .maybeSingle();
    }
    
    // Wait for both queries to complete
    const [domainResult, idResult] = await Promise.all([domainPromise, idPromise]);
    
    console.log('Domain search result:', domainResult.data, domainResult.error);
    console.log('ID search result:', idResult.data, idResult.error);
    
    // Use the first result that has data
    if (domainResult.data) {
      return domainResult;
    }
    
    if (idResult.data) {
      return idResult;
    }
    
    // If neither query found a result, try exact domain match as final fallback
    console.log('Trying exact domain match as fallback');
    const exactMatchResult = await supabase
      .from("stores")
      .select("*")
      .eq("domain_name", cleanId)
      .maybeSingle();
      
    console.log('Exact domain match result:', exactMatchResult.data, exactMatchResult.error);
    
    if (exactMatchResult.data) {
      return exactMatchResult;
    }
    
    // If we've tried everything and still no result, return proper error
    return { 
      data: null, 
      error: { 
        message: "لم يتم العثور على المتجر. الرجاء التحقق من اسم النطاق أو المعرف." 
      } 
    };
  } catch (err) {
    console.error("Error in getStoreFromUrl:", err);
    return { 
      data: null, 
      error: { 
        message: "حدث خطأ أثناء البحث عن المتجر. الرجاء المحاولة مرة أخرى." 
      } 
    };
  }
};
