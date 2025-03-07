
import { DatabaseClient } from "./client";
import { Product } from "@/utils/products/types";

// Mock implementation for testing purposes
export const createMockDatabaseClient = (): DatabaseClient => {
  return {
    products: {
      fetchProductsWithFilters: async (
        sectionType: string,
        storeId?: string,
        categoryId?: string,
        sectionId?: string,
        limit?: number,
        includeArchived: boolean = false
      ) => {
        return [] as Product[];
      },
      getProductById: async () => {
        return { data: null, error: null };
      },
      updateProduct: async () => {
        return { data: null, error: null };
      },
      deleteProduct: async () => {
        return { success: true, error: null };
      },
      hardDeleteProduct: async (productId: string) => {
        return { success: true, error: null };
      },
      bulkDeleteProducts: async (productIds: string[]) => {
        return { success: true, error: null, deletedCount: 0, archivedCount: 0 };
      },
      archiveProduct: async (productId: string, isArchived: boolean) => {
        return { data: null, error: null };
      },
      bulkArchiveProducts: async (productIds: string[], isArchived: boolean) => {
        return { success: true, error: null };
      },
      activateProduct: async (productId: string, isActive: boolean) => {
        return { data: null, error: null };
      },
      bulkActivateProducts: async (productIds: string[], isActive: boolean) => {
        return { success: true, error: null };
      }
    }
  };
};
