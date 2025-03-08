import { productClient } from './clients/product-client';

export interface DatabaseClient {
  products: ProductDatabaseClient;
  // Add other client interfaces here as they are implemented
}

export const databaseClient: DatabaseClient = {
  products: productClient,
  // Add other client implementations here as they are implemented
};

export const setDatabaseClient = (mockClient: DatabaseClient) => {
  return mockClient;
};
