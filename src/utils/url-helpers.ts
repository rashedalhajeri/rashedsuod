
/**
 * URL and domain handling utilities with simplified, consistent behavior
 */

/**
 * Get the base domain for the application
 */
export const getBaseDomain = (): string => {
  if (window.location.hostname.includes('lovableproject.com')) {
    return window.location.origin;
  }
  return import.meta.env.VITE_APP_DOMAIN || 'https://lovable.app';
};

/**
 * Normalize a store domain name with simplified rules
 */
export const normalizeStoreDomain = (domain: string): string => {
  if (!domain) return '';
  
  // Convert to lowercase and remove spaces
  let normalizedDomain = domain.trim().toLowerCase();
  
  // Remove store/ prefix and trailing slash
  normalizedDomain = normalizedDomain.replace(/^\/?(store\/)?/, '').replace(/\/$/, '');
  
  // Remove protocol and www
  normalizedDomain = normalizedDomain.replace(/^https?:\/\/(www\.)?/, '');
  
  // Get first part before any dots or slashes
  normalizedDomain = normalizedDomain.split(/[./]/)[0];
  
  return normalizedDomain;
};

/**
 * Creates a store URL from a domain
 */
export const getStoreUrl = (domain: string): string => {
  const cleanDomain = normalizeStoreDomain(domain);
  return cleanDomain ? `/store/${cleanDomain}` : '';
};

/**
 * Creates a full URL with the correct base domain for any store route
 */
export const getFullStoreUrl = (path: string): string => {
  if (!path) return getBaseDomain();
  
  const baseDomain = getBaseDomain();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseDomain}${normalizedPath}`;
};

/**
 * Handles opening a store URL in a new tab
 */
export const openStoreInNewTab = (storeUrl?: string): void => {
  if (!storeUrl) return;
  
  const fullUrl = getFullStoreUrl(getStoreUrl(storeUrl));
  window.open(fullUrl, '_blank');
};
