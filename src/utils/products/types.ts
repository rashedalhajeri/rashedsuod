
export interface RawProductData {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number | null;
  image_url?: string | null;
  additional_images?: string[] | null;
  stock_quantity?: number | null;
  track_inventory?: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  category_id?: string | null;
  section_id?: string | null;
  has_colors?: boolean | null;
  has_sizes?: boolean | null;
  require_customer_name?: boolean | null;
  require_customer_image?: boolean | null;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
  is_archived?: boolean | null;
  store_id?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_featured?: boolean;
  sales_count?: number;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number | null;
  image_url?: string | null;
  additional_images?: string[];
  stock_quantity?: number | null;
  track_inventory?: boolean;
  category?: {
    id: string;
    name: string;
  } | null;
  category_id?: string | null;
  section_id?: string | null;
  has_colors?: boolean | null;
  has_sizes?: boolean | null;
  require_customer_name?: boolean | null;
  require_customer_image?: boolean | null;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
  is_archived?: boolean | null;
  store_id?: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_featured?: boolean;
  sales_count?: number;
  // Helper property for UI
  images?: string[];
}
