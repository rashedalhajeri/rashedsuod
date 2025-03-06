
export interface Payment {
  id: string;
  store_id: string;
  order_id: string;
  amount: number;
  status: "successful" | "failed" | "pending" | "refunded";
  payment_method: string;
  transaction_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentFilters {
  status?: "successful" | "failed" | "pending" | "refunded" | "all";
  paymentMethod?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface PaymentStats {
  totalRevenue: number;
  pendingAmount: number;
  successRate: number;
  avgTime: string;
}

export interface PaymentChartData {
  name: string;
  value: number;
}
