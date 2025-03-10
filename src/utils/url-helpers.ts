
/**
 * URL and domain handling utilities with simplified, consistent behavior
 */

/**
 * Get the base domain for the application
 */
export const getBaseDomain = (): string => {
  // For custom domains configured in Supabase, check if we're on a custom domain
  if (window.location.hostname !== 'localhost' && 
      !window.location.hostname.includes('lovableproject.com') &&
      !window.location.hostname.includes('localhost')) {
    return window.location.origin;
  }
  
  // Fallback to configured domain or default
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
  
  // Handle custom domains - if it includes a dot, we treat it as a full domain
  // Otherwise, we assume it's a subdomain of the default domain
  if (normalizedDomain.includes('.')) {
    // Extract just the domain part from something like "example.com/path"
    normalizedDomain = normalizedDomain.split('/')[0];
  } else {
    // Get first part before any slashes for regular store domains
    normalizedDomain = normalizedDomain.split('/')[0];
  }
  
  return normalizedDomain;
};

/**
 * Creates a store URL from a domain
 */
export const getStoreUrl = (domain: string): string => {
  const cleanDomain = normalizeStoreDomain(domain);
  
  // If it's a custom domain (contains a dot), return the full path
  if (cleanDomain && cleanDomain.includes('.')) {
    return cleanDomain.startsWith('http') ? cleanDomain : `https://${cleanDomain}`;
  }
  
  // Otherwise, return the standard store path
  return cleanDomain ? `/store/${cleanDomain}` : '';
};

/**
 * Creates a full URL with the correct base domain for any store route
 */
export const getFullStoreUrl = (path: string): string => {
  if (!path) return getBaseDomain();
  
  // If the path is already a full URL (custom domain), return it
  if (path.startsWith('http')) {
    return path;
  }
  
  // If path is a custom domain without protocol, add https://
  if (path.includes('.') && !path.startsWith('/')) {
    return `https://${path}`;
  }
  
  const baseDomain = getBaseDomain();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseDomain}${normalizedPath}`;
};

/**
 * Determines if a domain is a custom domain
 */
export const isCustomDomain = (domain: string): boolean => {
  const normalizedDomain = normalizeStoreDomain(domain);
  return normalizedDomain.includes('.');
};

/**
 * Handles opening a store URL in a new tab
 */
export const openStoreInNewTab = (storeUrl?: string): void => {
  if (!storeUrl) return;
  
  // If it's a custom domain with protocol, use it directly
  if (storeUrl.startsWith('http')) {
    window.open(storeUrl, '_blank', 'noopener,noreferrer');
    return;
  }
  
  // If it's a custom domain without protocol, add protocol
  if (storeUrl.includes('.') && !storeUrl.startsWith('/')) {
    window.open(`https://${storeUrl}`, '_blank', 'noopener,noreferrer');
    return;
  }
  
  // For regular store paths
  const fullUrl = getFullStoreUrl(getStoreUrl(storeUrl));
  window.open(fullUrl, '_blank', 'noopener,noreferrer');
};
