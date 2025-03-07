import { RawProductData, Product } from "./types";
import { ProductColor, ProductSize, CategoryData } from "@/types";

export const mapRawProductToProduct = (raw: RawProductData): Product => {
  // Convert image_url and additional_images to images array
  const images: string[] = [];
  if (raw.image_url) {
    images.push(raw.image_url);
  }
  
  if (raw.additional_images && Array.isArray(raw.additional_images)) {
    images.push(...raw.additional_images);
  }

  return {
    id: raw.id,
    name: raw.name,
    description: raw.description,
    price: raw.price,
    discount_price: raw.discount_price,
    images: images,
    stock_quantity: raw.stock_quantity,
    track_inventory: raw.track_inventory || false,
    store_id: raw.store_id,
    category_id: raw.category_id,
    category: raw.category,
    created_at: new Date(raw.created_at),
    updated_at: new Date(raw.updated_at),
    has_colors: raw.has_colors || false,
    has_sizes: raw.has_sizes || false,
    available_colors: raw.available_colors || [],
    available_sizes: raw.available_sizes || [],
    sales_count: raw.sales_count || 0,
    is_featured: raw.is_featured || false,
    is_archived: raw.is_archived || false
  };
};
