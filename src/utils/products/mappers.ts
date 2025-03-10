
import { RawProductData, Product } from './types';

export const mapRawProductToProduct = (raw: RawProductData): Product => {
  return {
    ...raw,
    created_at: new Date(raw.created_at),
    updated_at: new Date(raw.updated_at),
    additional_images: Array.isArray(raw.additional_images) ? raw.additional_images : []
  };
};
