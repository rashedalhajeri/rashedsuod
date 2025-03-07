
// Mapping of category names to image paths
const categoryImageMap: Record<string, string> = {
  "الكل": "/public/lovable-uploads/458d1c93-d142-4466-9f1a-1085922105f5.png", // Dedicated image for ALL
  "العيادات": "/public/lovable-uploads/c8a5c4e7-628d-4c52-acca-e8f603036b6b.png",
  "الإلكترونيات": "/public/lovable-uploads/827a00fa-f421-45c3-96d7-b9305fb217d1.jpg",
};

/**
 * Returns an appropriate image URL for a given category name
 * Falls back to placeholder if the category isn't in the map
 */
export const getCategoryImage = (category: string): string => {
  return categoryImageMap[category] || "/placeholder.svg";
};
