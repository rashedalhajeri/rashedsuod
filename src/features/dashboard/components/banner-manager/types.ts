
export interface Banner {
  id: string;
  image_url: string;
  link_type: "category" | "product" | "external" | "none";
  link_url: string;
  title: string;
  sort_order: number;
  is_active: boolean;
}

export interface BannerManagerProps {
  storeId: string;
}
