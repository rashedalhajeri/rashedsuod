
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
  
  // In development environment, always use path-based URL format
  if (isDevelopment) {
    // Use current path structure for development
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
      return `${window.location.origin}/store/${storeData.id}`;
    }
    
    // In production with no domain name yet, use ID as subdomain
    return `https://${storeData.id}.linok.me`;
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
 * Determine if the current URL should be redirected to the proper store domain format
 * @param storeData Store data object containing domain_name and id
 * @returns Boolean indicating if redirect is needed, and the target URL if true
 */
export const shouldRedirectToStoreDomain = (storeData: any): { shouldRedirect: boolean; targetUrl: string } => {
  if (!storeData) return { shouldRedirect: false, targetUrl: '' };
  
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname.includes('lovableproject.com') ||
                        window.location.hostname.includes('lovable.app');
  
  // Don't redirect in development environment
  if (isDevelopment) {
    return { shouldRedirect: false, targetUrl: '' };
  }
  
  const currentHostname = window.location.hostname;
  
  // Generate the expected hostname format
  let expectedHostname = '';
  if (storeData.domain_name) {
    expectedHostname = `${storeData.domain_name}.linok.me`;
  } else if (storeData.id) {
    expectedHostname = `${storeData.id}.linok.me`;
  }
  
  // If on linok.me domain but not on the right subdomain, should redirect
  if (currentHostname.includes('linok.me') && 
      currentHostname !== expectedHostname && 
      expectedHostname) {
    
    const newUrl = `https://${expectedHostname}${window.location.pathname}${window.location.search}`;
    return { shouldRedirect: true, targetUrl: newUrl };
  }
  
  // If not on linok.me domain at all in production, should redirect
  if (!currentHostname.includes('linok.me') && expectedHostname) {
    const newUrl = `https://${expectedHostname}${window.location.pathname}${window.location.search}`;
    return { shouldRedirect: true, targetUrl: newUrl };
  }
  
  return { shouldRedirect: false, targetUrl: '' };
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

    // First try to find by domain name (case insensitive)
    console.log('Looking up store by domain name:', cleanId);
    const { data: domainResult, error: domainError } = await supabase
      .from("stores")
      .select("*")
      .ilike("domain_name", cleanId)
      .maybeSingle();
    
    console.log('Domain search result:', domainResult, domainError);
    
    if (domainResult) {
      console.log('Store found by domain name:', domainResult);
      return { data: domainResult, error: null };
    }
    
    // Check if this looks like a UUID
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanId);
    
    // If it looks like a UUID, try to find by ID
    if (isUUID) {
      console.log('Looking up store with ID:', cleanId);
      const { data: idResult, error: idError } = await supabase
        .from("stores")
        .select("*")
        .eq("id", cleanId)
        .maybeSingle();
        
      console.log('ID search result:', idResult, idError);
      
      if (idResult) {
        console.log('Store found by ID:', idResult);
        return { data: idResult, error: null };
      }
    }
    
    // If still not found, try a more flexible approach for domain matching
    const { data: allStores, error: storesError } = await supabase
      .from("stores")
      .select("*");
      
    if (storesError) {
      console.error('Error fetching stores:', storesError);
      return { 
        data: null, 
        error: { message: "حدث خطأ أثناء البحث عن المتجر" }
      };
    }
    
    console.log('Available stores for debugging:', allStores);
    
    if (allStores && allStores.length > 0) {
      // Look for partial matches in domain names (case insensitive)
      const matchingStore = allStores.find((store: any) => 
        store.domain_name && store.domain_name.toLowerCase().includes(cleanId.toLowerCase())
      );
      
      if (matchingStore) {
        console.log('Found store with partial domain match:', matchingStore);
        return { data: matchingStore, error: null };
      }
      
      // Generate a list of available store domains to help the user
      const availableDomains = allStores
        .filter((store: any) => store.domain_name)
        .map((store: any) => store.domain_name)
        .join(', ');
      
      return { 
        data: null, 
        error: { 
          message: `لم يتم العثور على المتجر "${cleanId}". المتاجر المتوفرة: ${availableDomains || 'لا توجد متاجر بأسماء نطاقات'}`,
          availableStores: allStores
        } 
      };
    }
    
    // No stores found at all
    return { 
      data: null, 
      error: { 
        message: "لا توجد متاجر مسجلة في النظام." 
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
