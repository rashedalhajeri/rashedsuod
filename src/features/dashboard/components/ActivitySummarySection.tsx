
import React from "react";
import RecentOrders from "@/features/dashboard/components/RecentOrders";
import RecentProducts from "@/features/dashboard/components/RecentProducts";
import { Order } from "@/types/orders";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

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
    >
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="h-6 w-6 rounded-lg bg-gray-100 flex items-center justify-center">
              <Activity className="h-4 w-4 text-gray-600" />
            </span>
            نشاط المتجر
          </h2>
          <p className="text-sm text-gray-500 mt-1">ملخص لأحدث الطلبات والمنتجات في متجرك</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <RecentOrders orders={orders} />
        <RecentProducts products={products} currency={currency} />
      </div>
    </motion.div>
  );
};

export default ActivitySummarySection;
