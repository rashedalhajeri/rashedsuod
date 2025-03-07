
/**
 * Handle image loading errors and return a fallback image URL
 * @param imageUrl The original image URL
 * @param fallbackUrl The fallback URL (default: '/placeholder.svg')
 * @returns Either the original URL or the fallback URL
 */
export const getImageWithFallback = (imageUrl: string | null, fallbackUrl: string = '/placeholder.svg'): string => {
  if (!imageUrl) return fallbackUrl;
  return imageUrl;
};
