
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
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  is_featured?: boolean;
  sales_count?: number;
}
