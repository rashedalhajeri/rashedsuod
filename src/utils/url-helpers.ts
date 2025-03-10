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
  
  // Check if this is a subdomain of our platform
  if (normalizedDomain.includes('.linok.me')) {
    // Extract just the subdomain part from something like "storename.linok.me"
    normalizedDomain = normalizedDomain.split('.')[0];
  } else if (normalizedDomain.includes('.')) {
    // Handle custom domains - if it includes a dot, we treat it as a full domain
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
  
  // Get base domain and main domain part
  const baseDomain = getBaseDomain().replace(/^https?:\/\//, '').replace(/^www\./, '');
  const mainDomain = baseDomain.split('/')[0]; // Remove any paths
  
  // Create subdomain URL format (storename.mydomain.com)
  if (cleanDomain) {
    return `https://${cleanDomain}.${mainDomain}`;
  }
  
  // Fallback to store path format if something is wrong
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
  
  // For store/{storename} paths, convert to subdomain format
  if (path.startsWith('/store/')) {
    const storeName = path.replace('/store/', '');
    const baseDomain = getBaseDomain().replace(/^https?:\/\//, '').replace(/^www\./, '');
    const mainDomain = baseDomain.split('/')[0]; // Remove any paths
    
    // This creates the subdomain format: storename.yourdomain.com
    return `https://${storeName}.${mainDomain}`;
  }
  
  // For any other relative paths, append to base domain
  const baseDomain = getBaseDomain();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseDomain}${normalizedPath}`;
};

/**
 * Determines if a domain is a custom domain
 */
export const isCustomDomain = (domain: string): boolean => {
  const normalizedDomain = normalizeStoreDomain(domain);
  
  // If it contains a dot and is not a subdomain of our platform
  return normalizedDomain.includes('.') && !normalizedDomain.includes('linok.me');
};

/**
 * Determines if a domain is a subdomain of our platform
 */
export const isSubdomain = (domain: string): boolean => {
  const normalizedDomain = normalizeStoreDomain(domain);
  
  // Check if it's a hostname with our main domain
  const hostname = window.location.hostname;
  if (hostname.includes('.linok.me') && hostname !== 'linok.me') {
    return true;
  }
  
  // Otherwise check the normalized domain
  return !normalizedDomain.includes('.') || 
         (normalizedDomain.includes('.linok.me') && normalizedDomain !== 'linok.me');
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
  const fullUrl = getFullStoreUrl(storeUrl);
  window.open(fullUrl, '_blank', 'noopener,noreferrer');
};
