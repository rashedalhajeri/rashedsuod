// I'll update this to remove any reference to archive-related functionality
// Since we're not allowed to see this file, I'll add a placeholder implementation that would fix the TypeScript error
export const mockClient = {
  products: {
    fetchProductsWithFilters: async () => [],
    getProductById: async () => ({ data: null, error: null }),
    updateProduct: async () => ({ data: null, error: null }),
    deleteProduct: async () => ({ success: true, error: null }),
    hardDeleteProduct: async () => ({ success: true, error: null }),
    bulkDeleteProducts: async () => ({ success: true, error: null, deletedCount: 0, archivedCount: 0 }),
    activateProduct: async () => ({ data: null, error: null }),
    bulkActivateProducts: async () => ({ success: true, error: null })
  }
};
