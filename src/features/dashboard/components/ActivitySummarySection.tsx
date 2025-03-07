
import React from "react";
import RecentOrders from "@/features/dashboard/components/RecentOrders";
import RecentProducts from "@/features/dashboard/components/RecentProducts";
import { Order } from "@/types/orders";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mb-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <RecentOrders orders={orders} />
        <RecentProducts products={products} currency={currency} />
      </div>
    </motion.div>
  );
};

export default ActivitySummarySection;
