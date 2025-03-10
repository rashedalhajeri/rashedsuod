
import { ReactNode } from "react";

export interface SectionType {
  id: string;
  name: string;
  icon: ReactNode;
  description: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  image_url?: string;
  price: number;
  discount_price?: number | null;
}
