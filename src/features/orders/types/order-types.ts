
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes: string;
  payment_method: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
}
