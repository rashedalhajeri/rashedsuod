
export const getSectionTypeLabel = (type: string) => {
  switch (type) {
    case "featured": return "المنتجات المميزة";
    case "best_selling": return "الأكثر مبيعاً";
    case "new_arrivals": return "وصل حديثاً";
    case "all_products": return "جميع المنتجات";
    case "category": return "فئة محددة";
    case "custom": return "تخصيص يدوي";
    default: return type;
  }
};
