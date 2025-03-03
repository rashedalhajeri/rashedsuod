
// تعريفات أنواع التصنيفات
export interface Category {
  id: string;
  name: string;
  description: string | null;
  slug?: string;
  image?: string | null;
  parent_id?: string | null;
  display_order: number | null;
  store_id?: string;
  product_count?: number;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string | null;
  parent_id?: string | null;
  display_order?: number | null;
  slug?: string;
  is_active?: boolean;
}
