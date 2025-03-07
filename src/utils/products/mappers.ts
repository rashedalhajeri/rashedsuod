
import { Product, RawProductData } from "./types";

/**
 * Maps raw product data from the database to a structured Product object
 */
export const mapRawProductToProduct = (rawData: RawProductData): Product => {
  return {
    id: rawData.id,
    name: rawData.name || '',
    description: rawData.description || '',
    price: rawData.price || 0,
    discount_price: rawData.discount_price || null,
    stock_quantity: rawData.stock_quantity || null,
    image_url: rawData.image_url || null,
    additional_images: rawData.additional_images || [],
    track_inventory: rawData.track_inventory || false,
    category_id: rawData.category_id || null,
    has_colors: rawData.has_colors || false,
    has_sizes: rawData.has_sizes || false,
    require_customer_name: rawData.require_customer_name || false,
    require_customer_image: rawData.require_customer_image || false,
    available_colors: rawData.available_colors || [],
    available_sizes: rawData.available_sizes || [],
    created_at: rawData.created_at,
    updated_at: rawData.updated_at,
    store_id: rawData.store_id,
    is_featured: rawData.is_featured || false,
    sales_count: rawData.sales_count || 0
  };
};
