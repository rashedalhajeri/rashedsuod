
import { DatabaseClient } from "./client";
import { Product } from "@/utils/products/types";

// Mock implementation for testing purposes
export const createMockDatabaseClient = (): DatabaseClient => {
  return {
    products: {
      fetchProductsWithFilters: async () => {
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
