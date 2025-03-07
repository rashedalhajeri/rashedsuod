
// Simple function to help build safe queries
export const createSafeQueryBuilder = () => {
  return {
    buildSortClause: (sort: string | undefined): { column: string; ascending: boolean } => {
      switch (sort) {
        case 'price_low':
          return { column: 'price', ascending: true };
        case 'price_high':
          return { column: 'price', ascending: false };
        case 'best_selling':
          return { column: 'sales_count', ascending: false };
        default:
          return { column: 'created_at', ascending: false };
      }
    }
  };
};
