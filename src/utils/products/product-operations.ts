
// Re-export all product operations from dedicated modules
export { mapRawProductToProduct } from './mappers';
export { fetchProductsWithFilters, getProductById } from './product-fetchers';
export { updateProduct, deleteProduct } from './product-modifiers';
