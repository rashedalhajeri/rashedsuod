
// وظائف فلترة المنتجات

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
  let filtered = products;
  
  // فلترة حسب الفئة إذا تم تحديد واحدة
  if (activeCategory) {
    filtered = filtered.filter(product => 
      product.category === activeCategory || 
      product.category_id === activeCategory
    );
  }
  
  // فلترة حسب القسم إذا تم تحديد واحد
  if (activeSection) {
    filtered = filtered.filter(product => 
      product.section === activeSection || 
      product.section_id === activeSection
    );
  }
  
  return filtered;
};
