
import { Order } from "@/types/orders";

// Mock data for demonstration
export const mockSalesData = [
  { name: "يناير", value: 1500 },
  { name: "فبراير", value: 2500 },
  { name: "مارس", value: 2000 },
  { name: "أبريل", value: 3000 },
  { name: "مايو", value: 2800 },
  { name: "يونيو", value: 3200 },
  { name: "يوليو", value: 3800 },
];

// بيانات الطلبات المحاكاة (متوافقة مع تعريف Order)
export const mockRecentOrders: Order[] = [
  {
    id: "ord-1",
    order_number: "10001",
    store_id: "store-1",
    customer_name: "أحمد محمد",
    customer_email: "ahmed@example.com",
    shipping_address: "الرياض، السعودية",
    payment_method: "نقد عند الاستلام",
    status: "delivered",
    total: 255.99,
    created_at: "2023-07-22T10:00:00Z",
    updated_at: "2023-07-22T10:30:00Z"
  },
  {
    id: "ord-2",
    order_number: "10002",
    store_id: "store-1",
    customer_name: "سارة عبدالله",
    customer_email: "sara@example.com",
    shipping_address: "جدة، السعودية",
    payment_method: "بطاقة ائتمان",
    status: "processing",
    total: 189.50,
    created_at: "2023-07-21T14:20:00Z",
    updated_at: "2023-07-21T14:25:00Z"
  },
  {
    id: "ord-3",
    order_number: "10003",
    store_id: "store-1",
    customer_name: "محمد أحمد",
    customer_email: "mohammad@example.com",
    shipping_address: "الدمام، السعودية",
    payment_method: "تحويل بنكي",
    status: "processing",
    total: 340.00,
    created_at: "2023-07-20T09:15:00Z",
    updated_at: "2023-07-20T09:15:00Z"
  },
  {
    id: "ord-4",
    order_number: "10004",
    store_id: "store-1",
    customer_name: "نورة خالد",
    customer_email: "noura@example.com",
    shipping_address: "المدينة، السعودية",
    payment_method: "نقد عند الاستلام",
    status: "shipped",
    total: 129.99,
    created_at: "2023-07-19T16:45:00Z",
    updated_at: "2023-07-19T17:00:00Z"
  }
];

export const mockRecentProducts = [
  {
    id: "prod-1",
    name: "قميص أنيق",
    thumbnail: null,
    price: 120,
    stock: 25,
    category: "ملابس رجالية"
  },
  {
    id: "prod-2",
    name: "سماعات بلوتوث",
    thumbnail: null,
    price: 350,
    stock: 8,
    category: "إلكترونيات"
  },
  {
    id: "prod-3",
    name: "حذاء رياضي",
    thumbnail: null,
    price: 210,
    stock: 0,
    category: "أحذية"
  },
  {
    id: "prod-4",
    name: "ساعة ذكية",
    thumbnail: null,
    price: 499,
    stock: 15,
    category: "إلكترونيات"
  }
];

// Stats data for demonstration
export const statsData = {
  products: 54,
  orders: 128,
  customers: 35,
  revenue: 8425
};
