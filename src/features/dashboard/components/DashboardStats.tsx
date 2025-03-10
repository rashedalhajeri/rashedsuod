
import React from "react";
import { Package, ShoppingBag, Users, CreditCard } from "lucide-react";

interface DashboardStatsProps {
  products: number;
  orders: number;
  customers: number;
  revenue: number;
  formatCurrency: (amount: number) => string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  products,
  orders,
  customers,
  revenue,
  formatCurrency
}) => {
  const stats = [
    {
      title: "المنتجات",
      value: products,
      icon: <Package className="dashboard-stat-icon" />,
      change: "+5%",
      changeType: "positive" as "positive" | "negative" | "neutral"
    },
    {
      title: "الطلبات",
      value: orders,
      icon: <ShoppingBag className="dashboard-stat-icon" />,
      change: "+12%",
      changeType: "positive" as "positive" | "negative" | "neutral"
    },
    {
      title: "العملاء",
      value: customers,
      icon: <Users className="dashboard-stat-icon" />,
      change: "+8%",
      changeType: "positive" as "positive" | "negative" | "neutral"
    },
    {
      title: "الإيرادات",
      value: formatCurrency(revenue),
      icon: <CreditCard className="dashboard-stat-icon" />,
      change: "+15%",
      changeType: "positive" as "positive" | "negative" | "neutral",
      isRevenue: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="dashboard-stat">
          {stat.icon}
          <div className="dashboard-stat-title">{stat.title}</div>
          <div className="dashboard-stat-value">
            {typeof stat.value === "number" && !stat.isRevenue
              ? stat.value.toLocaleString("ar-SA")
              : stat.value}
          </div>
          <div className={`text-xs mt-1 ${
            stat.changeType === "positive"
              ? "text-green-600"
              : stat.changeType === "negative"
              ? "text-red-600"
              : "text-gray-500"
          }`}>
            {stat.change} مقارنة بالشهر الماضي
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
