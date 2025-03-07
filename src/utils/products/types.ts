
export interface CategoryData {
  id: string;
  name: string;
}

export interface ProductColor {
  label: string;
  hex_code: string;
}

export interface ProductSize {
  label: string;
  value: string;
}

export interface RawProductData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  image_url: string | null;
  additional_images: string[] | null;
  stock_quantity: number | null;
  track_inventory: boolean;
  store_id: string;
  category_id: string | null;
  category: CategoryData | null;
  created_at: string;
  updated_at: string;
  has_colors: boolean;
  has_sizes: boolean;
  available_colors: ProductColor[] | null;
  available_sizes: ProductSize[] | null;
  sales_count: number;
  is_featured: boolean;
  is_archived: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_price: number | null;
  images: string[];
  stock_quantity: number | null;
  track_inventory: boolean;
  store_id: string;
  category_id: string | null;
  category: CategoryData | null;
  created_at: Date;
  updated_at: Date;
  has_colors: boolean;
  has_sizes: boolean;
  available_colors: ProductColor[];
  available_sizes: ProductSize[];
  sales_count: number;
  is_featured: boolean;
  is_archived: boolean;
}
