
/**
 * URL and domain handling utilities with simplified, consistent behavior
 */

/**
 * Get the base domain for the application
 */
export const getBaseDomain = (): string => {
  // Always return the configured domain or default
  return import.meta.env.VITE_APP_DOMAIN || 'https://linok.me';
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
  
  // Extract just the domain part from something like "example.com/path" or "linok.me/storename"
  if (normalizedDomain.includes('/')) {
    normalizedDomain = normalizedDomain.split('/').pop() || '';
  } else if (normalizedDomain.includes('.')) {
    // If it includes a dot but no slash, it's probably a full domain
    // Extract just the first part if it's a subdomain
    if (normalizedDomain.includes('linok.me')) {
      const parts = normalizedDomain.split('.');
      if (parts.length > 2) {
        normalizedDomain = parts[0];
      } else {
        // It's just linok.me without a subdomain
        normalizedDomain = '';
      }
    } else {
      // For non-platform domains, just return the entire string
      normalizedDomain = normalizedDomain.split('/')[0];
    }
  }
  
  return normalizedDomain;
};

/**
 * Creates a store URL from a domain
 */
export const getStoreUrl = (domain: string): string => {
  const cleanDomain = normalizeStoreDomain(domain);
  
  // If no valid domain, return empty string
  if (!cleanDomain) return '';
  
  // Always use the path format
  const baseDomain = getBaseDomain();
  return `${baseDomain}/store/${cleanDomain}`;
};

/**
 * Creates a full URL with the correct base domain for any store route
 */
export const getFullStoreUrl = (path: string): string => {
  if (!path) return getBaseDomain();
  
  // If the path is already a full URL, return it
  if (path.startsWith('http')) {
    return path;
  }
  
  // Ensure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // For any relative path, append to base domain
  const baseDomain = getBaseDomain();
  return `${baseDomain}${normalizedPath}`;
};

/**
 * Determines if a domain is a custom domain - always false now
 */
export const isCustomDomain = (domain: string): boolean => {
  // Custom domains are no longer supported
  return false;
};

/**
 * Determines if a domain is a subdomain of our platform - always false now
 */
export const isSubdomain = (domain: string): boolean => {
  // Subdomains are no longer supported
  return false;
};

/**
 * Handles opening a store URL in a new tab
 */
export const openStoreInNewTab = (storeUrl?: string): void => {
  if (!storeUrl) return;
  
  // Generate a proper URL in the linok.me/store/name format
  const fullUrl = getFullStoreUrl(storeUrl);
  window.open(fullUrl, '_blank', 'noopener,noreferrer');
};
