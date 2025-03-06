// Product filtering utility functions

export const filterProductsBySearch = (products: any[], searchQuery: string) => {
  if (!searchQuery) return products;
  
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description &&
        product.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
};

export const filterProductsByCategory = (
  products: any[],
  activeCategory: string,
  activeSection: string,
  bestSellingProducts: any[],
  searchQuery: string
) => {
  // First filter by search
  let filtered = products;
  
  // Then filter by category if one is selected
  if (activeCategory) {
    // Filter by real category (later will be linked to product category field)
    return filtered;
  }
  
  return filtered;
};
