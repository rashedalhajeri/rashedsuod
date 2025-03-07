
import { Product, RawProductData } from "./types";
import { convertToStringArray } from "./format-helpers";

/**
 * Helper function to safely convert raw product data from Supabase to a Product object
 */
export const mapRawProductToProduct = (rawData: RawProductData): Product => {
  return {
    id: rawData.id,
    name: rawData.name,
    description: rawData.description,
    price: rawData.price,
    category_id: rawData.category_id,
    store_id: rawData.store_id,
    image_url: rawData.image_url,
    stock_quantity: rawData.stock_quantity,
    created_at: rawData.created_at,
    updated_at: rawData.updated_at,
    discount_price: rawData.discount_price,
    track_inventory: Boolean(rawData.track_inventory),
    has_colors: Boolean(rawData.has_colors),
    has_sizes: Boolean(rawData.has_sizes),
    require_customer_name: Boolean(rawData.require_customer_name),
    require_customer_image: Boolean(rawData.require_customer_image),
    additional_images: convertToStringArray(rawData.additional_images),
    available_colors: convertToStringArray(rawData.available_colors),
    available_sizes: convertToStringArray(rawData.available_sizes)
  };
};
