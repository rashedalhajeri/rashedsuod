
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
    // Category filtering (will be linked to product category field)
    filtered = filtered.filter(product => 
      product.category === activeCategory || 
      product.category_id === activeCategory
    );
  }
  
  // Then filter by section if one is selected
  if (activeSection) {
    // Section filtering (will be linked to product section field)
    filtered = filtered.filter(product => 
      product.section === activeSection || 
      product.section_id === activeSection
    );
  }
  
  return filtered;
};
