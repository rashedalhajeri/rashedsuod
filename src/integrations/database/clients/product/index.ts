
import { ProductDatabaseClient } from './types';
import {
  fetchProductsWithFilters as fetchProducts,
  getProductById as getProduct
} from './fetch-products';
import {
  updateProduct as update,
  activateProduct as activate,
  bulkActivateProducts as bulkActivate,
  bulkUpdateCategory as updateCategory
} from './update-products';
import {
  deleteProduct as deleteProductOperation,
  hardDeleteProduct as hardDeleteProductOperation,
  bulkDeleteProducts as bulkDeleteProductsOperation
} from './delete-products';

export class SupabaseProductClient implements ProductDatabaseClient {
  fetchProductsWithFilters = fetchProducts;
  getProductById = getProduct;
  updateProduct = update;
  deleteProduct = deleteProductOperation;
  hardDeleteProduct = hardDeleteProductOperation;
  bulkDeleteProducts = bulkDeleteProductsOperation;
  activateProduct = activate;
  bulkActivateProducts = bulkActivate;
  bulkUpdateCategory = updateCategory;
}

export const productClient = new SupabaseProductClient();
