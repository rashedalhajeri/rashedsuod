
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  discount_price?: number | null;
  stock_quantity?: number | null;
  image_url?: string | null;
  additional_images?: string[] | null;
  track_inventory?: boolean;
  category_id?: string | null;
  has_colors?: boolean;
  has_sizes?: boolean;
  require_customer_name?: boolean;
  require_customer_image?: boolean;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
  created_at?: string;
  updated_at?: string;
  store_id?: string;
  is_featured?: boolean;
  sales_count?: number;
}

export interface RawProductData {
  id: string;
  [key: string]: any;
}
