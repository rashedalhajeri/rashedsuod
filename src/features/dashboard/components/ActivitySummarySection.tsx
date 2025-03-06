
import React from "react";
import RecentOrders from "@/features/dashboard/components/RecentOrders";
import RecentProducts from "@/features/dashboard/components/RecentProducts";
import { Order } from "@/types/orders";

interface ActivitySummarySectionProps {
  orders: Order[];
  products: {
    id: string;
    name: string;
    thumbnail: string | null;
    price: number;
    stock: number;
    category: string;
  }[];
  currency: string;
}

const ActivitySummarySection: React.FC<ActivitySummarySectionProps> = ({
  orders,
  products,
  currency
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <RecentOrders orders={orders} />
      <RecentProducts products={products} currency={currency} />
    </div>
  );
};

export default ActivitySummarySection;
