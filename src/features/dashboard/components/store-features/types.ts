
export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  is_active: boolean;
}

export interface StoreFeaturesProps {
  storeId: string;
}
