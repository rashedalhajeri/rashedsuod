
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
  // أولاً نفلتر حسب البحث
  let filtered = products;
  
  // ثم حسب القسم أو الفئة
  if (activeCategory) {
    // فلترة حسب الفئة الحقيقية (لاحقاً سيتم ربطها بحقل التصنيف في المنتجات)
    return filtered;
  } else if (activeSection) {
    // فلترة حسب القسم
    if (activeSection === "جميع المنتجات") return filtered;
    if (activeSection === "العروض") 
      return filtered.filter(p => p.discount_percentage > 0 || (p.original_price && p.original_price > p.price));
    if (activeSection === "الأكثر مبيعاً") 
      return bestSellingProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    if (activeSection === "الجديد") 
      return filtered.slice(0, 8); // Most recent products
  }
  
  return filtered;
};
