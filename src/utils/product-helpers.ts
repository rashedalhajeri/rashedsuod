
// Import the Product type and re-export it
import { Product } from "./products/types";
export { Product };

// Import only what we need and rename the imported deleteProduct to avoid conflict
import { 
  fetchProductsWithFilters,
  getProductById,
  // Rename deleteProduct to avoid conflict
  deleteProduct as deleteProductFromFetchers,
  bulkDeleteProducts
} from "./products/product-fetchers";

// Re-export with different names to avoid ambiguity
export {
  fetchProductsWithFilters,
  getProductById,
  // Export the renamed function
  deleteProductFromFetchers as deleteProduct,
  bulkDeleteProducts
};

// Add any other helper functions that might exist in this file
export const formatProductPrice = (price: number) => {
  return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(price);
};

export const getDiscountPercentage = (product: Product) => {
  if (!product.discount_price || product.discount_price >= product.price) return null;
  return Math.round((1 - (product.discount_price / product.price)) * 100);
};
