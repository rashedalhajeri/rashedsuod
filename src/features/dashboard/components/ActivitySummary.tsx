
import React from "react";
import RecentOrders from "@/features/dashboard/components/RecentOrders";
import RecentProducts from "@/features/dashboard/components/RecentProducts";
import { Order } from "@/types/orders";

interface Product {
  id: string;
  name: string;
  thumbnail: string | null;
  price: number;
  stock: number;
  category: string;
}

interface ActivitySummaryProps {
  orders: Order[];
  products: Product[];
  currency: string;
}

const ActivitySummary: React.FC<ActivitySummaryProps> = ({ orders, products, currency }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RecentOrders orders={orders} />
      <RecentProducts products={products} currency={currency} />
    </div>
  );
};

export default ActivitySummary;
