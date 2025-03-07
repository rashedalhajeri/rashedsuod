
import { DatabaseClient } from './client';
import { Product } from '@/utils/products/types';

/**
 * Create a mock database client for testing
 * 
 * Example usage:
 * 
 * import { createMockDatabaseClient } from '@/integrations/database/mock-client';
 * 
 * // In your test file:
 * const mockClient = createMockDatabaseClient({
 *   products: {
 *     fetchProductsWithFilters: jest.fn().mockResolvedValue([{ id: '1', name: 'Test Product' }]),
 *     // ... other mocked methods
 *   }
 * });
 */
export const createMockDatabaseClient = (overrides: Partial<DatabaseClient>): DatabaseClient => {
  // Default mock implementations
  const defaultMock: DatabaseClient = {
    products: {
      fetchProductsWithFilters: async () => [],
      getProductById: async () => ({ data: null, error: null }),
      updateProduct: async () => ({ data: null, error: null }),
      deleteProduct: async () => ({ success: false, error: null }),
    },
  };

  // Merge default with provided overrides
  return {
    ...defaultMock,
    ...overrides,
    products: {
      ...defaultMock.products,
      ...(overrides.products || {}),
    },
  };
};
