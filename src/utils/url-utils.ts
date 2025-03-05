/**
 * Utilities for URL handling and formatting
 */

/**
 * Format a store URL ensuring proper protocol and format
 * @param storeId - The store ID
 * @param domainName - Optional custom domain name
 * @returns Properly formatted store URL
 */
export const formatStoreUrl = (storeId?: string, domainName?: string): string => {
  // If no store ID and no domain, return empty string
  if (!storeId && !domainName) return '';
  
  // If custom domain is provided
  if (domainName) {
    // Check if domain already has a protocol
    if (domainName.startsWith('http://') || domainName.startsWith('https://')) {
      return domainName;
    }
    
    // Add https:// to the domain
    return `https://${domainName}`;
  }
  
  // For internal app routes
  return `/store/${storeId}`;
};

/**
 * Get full store URL including current origin for absolute URLs
 * @param storeId - The store ID
 * @param domainName - Optional custom domain name
 * @returns Full absolute URL
 */
export const getFullStoreUrl = (storeId?: string, domainName?: string): string => {
  const relativeUrl = formatStoreUrl(storeId, domainName);
  
  // If it's already an absolute URL, return as is
  if (relativeUrl.startsWith('http')) {
    return relativeUrl;
  }
  
  // Otherwise, prepend the current origin
  return `${window.location.origin}${relativeUrl}`;
};

/**
 * Validate if a domain name has correct format
 * @param domain - Domain to validate
 * @returns Boolean indicating if domain is valid
 */
export const isValidDomain = (domain?: string): boolean => {
  if (!domain) return false;
  
  // Remove protocol if present for validation
  const domainToCheck = domain.replace(/^https?:\/\//, '');
  
  // Simple domain validation regex
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
  return domainRegex.test(domainToCheck);
};
