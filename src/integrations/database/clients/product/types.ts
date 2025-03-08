
export interface ProductDatabaseClient {
  fetchProductsWithFilters: (
    sectionType: string,
    storeId?: string,
    categoryId?: string,
    sectionId?: string,
    limit?: number,
    includeArchived?: boolean
  ) => Promise<any[]>;
  getProductById: (productId: string) => Promise<{ data: any | null, error: any }>;
  updateProduct: (productId: string, updates: any) => Promise<{ data: any[] | null, error: any }>;
  deleteProduct: (productId: string) => Promise<{ success: boolean, error: any }>;
  hardDeleteProduct: (productId: string) => Promise<{ success: boolean, error: any }>;
  bulkDeleteProducts: (productIds: string[]) => Promise<{ success: boolean, error: any, deletedCount: number, archivedCount: number }>;
  activateProduct: (productId: string, isActive: boolean) => Promise<{ data: any | null, error: any }>;
  bulkActivateProducts: (productIds: string[], isActive: boolean) => Promise<{ success: boolean, error: any }>;
  bulkUpdateCategory: (productIds: string[], categoryId: string | null) => Promise<{ success: boolean, error: any }>;
}
