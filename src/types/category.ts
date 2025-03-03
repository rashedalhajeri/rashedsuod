
export interface Category {
  id: string;
  store_id: string;
  name: string;
  description: string | null;
  display_order: number | null;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface CategoryFormData {
  name: string;
  description: string;
  display_order?: number | null;
}
