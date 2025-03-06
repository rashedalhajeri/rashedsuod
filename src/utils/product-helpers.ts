
import { supabase } from "@/integrations/supabase/client";

// Format currency with proper locale and format
export const formatCurrency = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3
  }).format(price);
};

// Get default category image or fallback
export const getCategoryImage = (categoryName: string): string => {
  const categoryImageMap: Record<string, string> = {
    "الكل": "/public/lovable-uploads/458d1c93-d142-4466-9f1a-1085922105f5.png",
    "العيادات": "/public/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png",
    "الإلكترونيات": "/public/lovable-uploads/827a00fa-f421-45c3-96d7-b9305fb217d1.jpg",
  };
  
  return categoryImageMap[categoryName] || "/placeholder.svg";
};

// Handle image loading errors
export const handleImageError = (
  imageUrl: string | null, 
  fallbackImage: string = "/placeholder.svg"
): string => {
  if (!imageUrl) return fallbackImage;
  return imageUrl;
};
