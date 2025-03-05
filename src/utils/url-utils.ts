
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
  
  // If it already includes linok.me, ensure it's properly formatted
  if (cleanDomain.includes('linok.me')) {
    // Extract just the subdomain part
    const parts = cleanDomain.split('.');
    if (parts.length >= 3) {
      return `https://${parts[0]}.linok.me`;
    }
    return `https://${cleanDomain}`;
  }
  
  // Format as subdomain
  return `https://${cleanDomain}.linok.me`;
};

/**
 * Get the full store URL based on store data
 * @param storeData Store data object containing domain_name and id
 * @returns The formatted store URL
 */
export const getStoreUrl = (storeData: any): string => {
  if (!storeData) return '';
  
  // If domain name exists, use it to create the subdomain URL
  if (storeData.domain_name) {
    return formatStoreUrl(storeData.domain_name);
  }
  
  // Fallback to ID-based URL if domain name is not available
  return storeData.id ? `/store/${storeData.id}` : '';
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
