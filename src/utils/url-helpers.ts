
/**
 * Normalize store domain to a consistent format
 * Always returns lowercase with no special characters
 */
export const normalizeStoreDomain = (domain: string): string => {
  if (!domain) return '';
  
  // Remove any protocol prefix (http://, https://)
  let normalizedDomain = domain.toLowerCase().trim();
  normalizedDomain = normalizedDomain.replace(/^https?:\/\//, '');
  
  // Remove trailing slashes
  normalizedDomain = normalizedDomain.replace(/\/+$/, '');
  
  // If using the store/ path format, extract just the domain part
  const storePathMatch = normalizedDomain.match(/store\/([^\/]+)/);
  if (storePathMatch && storePathMatch[1]) {
    normalizedDomain = storePathMatch[1];
  }
  
  // Remove subdomains and TLDs if a full domain is provided
  // This ensures consistency regardless of input format
  const domainParts = normalizedDomain.split('.');
  if (domainParts.length > 1 && !normalizedDomain.includes('/')) {
    // Extract just the domain name part (e.g., 'mystore' from 'mystore.example.com')
    return domainParts[0];
  }
  
  // Replace spaces with dashes and remove special characters
  return normalizedDomain.replace(/\s+/g, '-').replace(/[^\w\-]/g, '');
};

/**
 * Get the full URL for a store in the linok.me/store/name format
 */
export const getFullStoreUrl = (storeUrl: string): string => {
  if (!storeUrl) return '';
  
  // Always normalize the domain first
  const normalizedDomain = normalizeStoreDomain(storeUrl);
  
  // If empty after normalization, return empty string
  if (!normalizedDomain) return '';
  
  // Return URL in the format linok.me/store/name (no subdomain or custom domain support)
  return `https://linok.me/store/${normalizedDomain}`;
};
