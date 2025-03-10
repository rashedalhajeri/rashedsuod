
/**
 * URL and domain handling utilities
 */

/**
 * Get the base domain for the application
 */
export const getBaseDomain = (): string => {
  // Check if we're in the lovableproject.com development environment
  if (window.location.hostname.includes('lovableproject.com')) {
    return window.location.origin;
  }
  
  // Production environment
  return import.meta.env.VITE_APP_DOMAIN || 'https://lovable.app';
};

/**
 * تنسيق اسم دومين المتجر
 */
export const normalizeStoreDomain = (domain: string): string => {
  if (!domain) return '';
  
  // تحويل إلى أحرف صغيرة وإزالة المسافات
  let normalizedDomain = domain.trim().toLowerCase();
  
  // إزالة أي بادئة /store/ إذا وجدت
  normalizedDomain = normalizedDomain.replace(/^\/store\//, '');
  normalizedDomain = normalizedDomain.replace(/^store\//, '');
  
  // إزالة أي لاحقة / إذا وجدت
  normalizedDomain = normalizedDomain.replace(/\/$/, '');
  
  // إزالة بادئة http:// أو https://
  normalizedDomain = normalizedDomain.replace(/^https?:\/\//, '');
  
  // إزالة أي جزء من المجال بعد أول '/'
  normalizedDomain = normalizedDomain.split('/')[0];
  
  // إزالة الـ www. إذا وجدت
  normalizedDomain = normalizedDomain.replace(/^www\./, '');
  
  // إذا كان المجال يحتوي على '.'، نأخذ فقط الجزء الأول (قبل النقطة)
  // إلا إذا كان المجال هو محدد داخلي (localhost)
  if (normalizedDomain.includes('.') && !normalizedDomain.startsWith('localhost')) {
    // تقسيم بواسطة '.' وأخذ الجزء الفرعي الأول
    const parts = normalizedDomain.split('.');
    if (parts.length > 0 && parts[0] !== '') {
      normalizedDomain = parts[0];
    }
  }
  
  // طباعة للتصحيح
  console.log(`تنسيق الدومين:`, {
    original: domain,
    normalized: normalizedDomain,
    timestamp: new Date().toISOString()
  });
  
  return normalizedDomain;
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
 * Creates a full URL with the correct base domain for any store route
 */
export const getFullStoreUrl = (path: string): string => {
  if (!path) return getBaseDomain();
  
  // Check if we're in the Lovable project environment
  if (window.location.hostname.includes('lovableproject.com')) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${window.location.origin}${normalizedPath}`;
  }
  
  const baseDomain = getBaseDomain();
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${baseDomain}${normalizedPath}`;
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
  
  // Debug the URL transformation
  console.log(`Opening store URL: Original=${storeUrl}, Cleaned=${cleanUrl}`);
  
  // Check if it's a full URL with protocol
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    window.open(cleanUrl, '_blank');
    return;
  }
  
  // Remove store/ prefix if it exists
  const domainName = cleanUrl.replace(/^store\/?/, '');
  
  // Create the correct URL with base domain
  const fullUrl = getFullStoreUrl(`/store/${domainName}`);
  console.log(`Final store URL to open: ${fullUrl}`);
  window.open(fullUrl, '_blank');
};
