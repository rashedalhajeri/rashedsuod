
export interface Category {
  id: string;
  name: string;
  description: string;
  store_id: string;
  display_order: number;
  created_at: string;
  updated_at: string;
  product_count: number;
  parent_id: string | null;
  is_active: boolean;
}

export interface CategoryFormData {
  name: string;
  description: string;
  display_order?: number;
  parent_id?: string | null;
  is_active?: boolean;
}
