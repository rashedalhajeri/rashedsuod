
// Category type definitions
export interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number | null;
  store_id: string;
  created_at: string;
  updated_at: string;
  product_count?: number; // Optional count of products in this category
}

export interface CategoryFormData {
  name: string;
  description?: string | null;
  display_order?: number | null;
}
