
import { RawProductData, Product } from './types';

export const mapRawProductToProduct = (raw: RawProductData): Product => {
  const product: Product = {
    ...raw,
    created_at: new Date(raw.created_at),
    updated_at: new Date(raw.updated_at),
    additional_images: Array.isArray(raw.additional_images) ? raw.additional_images : []
  };
  
  // Add images array for convenience (combining image_url and additional_images)
  const images: string[] = [];
  if (raw.image_url) {
    images.push(raw.image_url);
  }
  if (Array.isArray(raw.additional_images)) {
    images.push(...raw.additional_images);
  }
  product.images = images;
  
  return product;
};
