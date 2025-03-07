
export interface RawProductData {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number | null;
  image_url: string | null;
  additional_images: any; // Could be string[] or string (JSON)
  track_inventory: boolean;
  category_id: string | null;
  has_colors: boolean;
  has_sizes: boolean;
  require_customer_name: boolean;
  require_customer_image: boolean;
  available_colors: any; // Could be string[] or string (JSON)
  available_sizes: any; // Could be string[] or string (JSON)
  created_at: string;
  updated_at: string;
  store_id: string;
  is_featured: boolean;
  sales_count: number;
  is_archived: boolean;
  category?: {
    id: string;
    name: string;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number | null;
  image_url: string | null;
  additional_images: string[];
  track_inventory: boolean;
  category_id: string | null;
  has_colors: boolean;
  has_sizes: boolean;
  require_customer_name: boolean;
  require_customer_image: boolean;
  available_colors: string[];
  available_sizes: string[];
  created_at: string;
  updated_at: string;
  store_id: string;
  is_featured: boolean;
  sales_count: number;
  is_archived: boolean;
  images: string[]; // This field is for UI purposes
  category?: {
    id: string;
    name: string;
  };
}
