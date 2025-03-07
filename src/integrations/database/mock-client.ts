
import { DatabaseClient } from './client';
import { Product } from '@/utils/products/types';

// Mock implementation of the database client for testing
export const mockDatabaseClient: DatabaseClient = {
  products: {
    fetchProductsWithFilters: async () => {
      return [];
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
    }
  }
};
