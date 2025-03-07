
export type OrderStatus = "processing" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product_name?: string; // اسم المنتج للعرض
}

export interface Order {
  id: string;
  order_number: string;
  store_id: string;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  shipping_address: string;
  payment_method: string;
  status: OrderStatus;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}
