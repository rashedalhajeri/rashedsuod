
import React from "react";
import { ShoppingBag, Package, Users, DollarSign } from "lucide-react";
import StatsCard from "@/features/dashboard/components/StatsCard";

interface DashboardStatsSectionProps {
  stats: {
    products: number;
    orders: number;
    customers: number;
    revenue: number;
  };
  formatCurrency: (value: number) => string;
}

const DashboardStatsSection: React.FC<DashboardStatsSectionProps> = ({
  stats,
  formatCurrency
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard 
        title="المنتجات"
        value={stats.products.toString()}
        trend={{ value: 12, isPositive: true }}
        icon={<Package className="h-5 w-5" />}
        iconClassName="bg-blue-100 text-blue-600"
      />
      <StatsCard 
        title="الطلبات"
        value={stats.orders.toString()}
        trend={{ value: 8, isPositive: true }}
        icon={<ShoppingBag className="h-5 w-5" />}
        iconClassName="bg-orange-100 text-orange-600"
      />
      <StatsCard 
        title="العملاء"
        value={stats.customers.toString()}
        trend={{ value: 5, isPositive: true }}
        icon={<Users className="h-5 w-5" />}
        iconClassName="bg-green-100 text-green-600"
      />
      <StatsCard 
        title="الإيرادات"
        value={formatCurrency(stats.revenue)}
        trend={{ value: 14, isPositive: true }}
        icon={<DollarSign className="h-5 w-5" />}
        iconClassName="bg-purple-100 text-purple-600"
      />
    </div>
  );
};

export default DashboardStatsSection;
