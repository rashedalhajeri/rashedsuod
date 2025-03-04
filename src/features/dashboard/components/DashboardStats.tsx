
import React from "react";
import StatsCard from "@/features/dashboard/components/StatsCard";
import { ShoppingBag, Package, Users, DollarSign } from "lucide-react";

interface StatsDataProps {
  products: number;
  orders: number;
  customers: number;
  revenue: number;
  formatCurrency: (value: number) => string;
}

const DashboardStats: React.FC<StatsDataProps> = ({ 
  products, 
  orders, 
  customers, 
  revenue,
  formatCurrency
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      <StatsCard 
        title="المنتجات"
        value={products.toString()}
        trend={{ value: 12, isPositive: true }}
        icon={<Package className="h-5 w-5" />}
        iconClassName="bg-blue-100 text-blue-600"
      />
      <StatsCard 
        title="الطلبات"
        value={orders.toString()}
        trend={{ value: 8, isPositive: true }}
        icon={<ShoppingBag className="h-5 w-5" />}
        iconClassName="bg-orange-100 text-orange-600"
      />
      <StatsCard 
        title="العملاء"
        value={customers.toString()}
        trend={{ value: 5, isPositive: true }}
        icon={<Users className="h-5 w-5" />}
        iconClassName="bg-green-100 text-green-600"
      />
      <StatsCard 
        title="الإيرادات"
        value={formatCurrency(revenue)}
        trend={{ value: 14, isPositive: true }}
        icon={<DollarSign className="h-5 w-5" />}
        iconClassName="bg-purple-100 text-purple-600"
      />
    </div>
  );
};

export default DashboardStats;
