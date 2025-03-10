
/**
 * URL and domain handling utilities
 */

/**
 * Get the base domain for the application
 */
export const getBaseDomain = (): string => {
  return import.meta.env.VITE_APP_DOMAIN || 'https://lovable.app';
};

/**
 * Normalizes store domain by removing special characters, spaces, and converting to lowercase
 */
export const normalizeStoreDomain = (domain: string): string => {
  if (!domain) return '';
  return domain.trim().toLowerCase();
};

/**
 * Creates a store URL from a domain
 */
export const getStoreUrl = (domain: string): string => {
  const cleanDomain = normalizeStoreDomain(domain);
  if (!cleanDomain) return '';
  
  return `/store/${cleanDomain}`;
};

/**
 * Creates a category URL for a store
 */
export const getStoreCategoryUrl = (domain: string, category: string): string => {
  const cleanDomain = normalizeStoreDomain(domain);
  if (!cleanDomain || !category) return '';
  
  const categorySlug = encodeURIComponent(category.toLowerCase());
  return `/store/${cleanDomain}/category/${categorySlug}`;
};

/**
 * Creates a product URL for a store
 */
export const getStoreProductUrl = (domain: string, productId: string): string => {
  const cleanDomain = normalizeStoreDomain(domain);
  if (!cleanDomain || !productId) return '';
  
  return `/store/${cleanDomain}/product/${productId}`;
};

/**
 * Handles opening a store URL in a new tab with proper domain normalization
 */
export const openStoreInNewTab = (storeUrl?: string): void => {
  if (!storeUrl) return;
  
  // Clean and standardize the URL - always convert to lowercase
  const trimmedUrl = storeUrl.trim().toLowerCase();
  
  // Remove leading/trailing slashes
  const cleanUrl = trimmedUrl.replace(/^\/+|\/+$/g, '');
  
  // Check if it's a full URL with protocol
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    window.open(cleanUrl, '_blank');
    return;
  }
  
  // Remove store/ prefix if it exists
  const domainName = cleanUrl.replace(/^store\/?/, '');
  
  // Create the correct URL with base domain
  const fullUrl = `${getBaseDomain()}/store/${domainName}`;
  window.open(fullUrl, '_blank');
};
