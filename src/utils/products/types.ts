
// Define types for better type safety
export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category_id?: string | null;
  store_id: string;
  image_url?: string | null;
  additional_images?: string[] | null;
  stock_quantity?: number | null;
  created_at?: string;
  updated_at?: string;
  discount_price?: number | null;
  track_inventory?: boolean;
  has_colors?: boolean;
  has_sizes?: boolean;
  require_customer_name?: boolean;
  require_customer_image?: boolean;
  available_colors?: string[] | null;
  available_sizes?: string[] | null;
}

// Define a raw database product type that exactly matches the database schema
export interface RawProductData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  store_id: string;
  image_url: string | null;
  stock_quantity: number | null;
  created_at: string;
  updated_at: string;
  additional_images: any;
  discount_price: number | null;
  track_inventory: boolean;
  has_colors: boolean;
  has_sizes: boolean;
  require_customer_name: boolean;
  require_customer_image: boolean;
  available_colors: any;
  available_sizes: any;
}
