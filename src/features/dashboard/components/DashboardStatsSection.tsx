
import React, { useState } from "react";
import { ShoppingBag, Package, Users, DollarSign, Calendar } from "lucide-react";
import StatsCard from "@/features/dashboard/components/StatsCard";
import { motion } from "framer-motion";

interface DashboardStatsSectionProps {
  stats: {
    products: number;
    orders: number;
    customers: number;
    revenue: number;
  };
  formatCurrency: (value: number) => string;
  onPeriodChange?: (period: string) => void;
}

const DashboardStatsSection: React.FC<DashboardStatsSectionProps> = ({
  stats,
  formatCurrency,
  onPeriodChange
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("day");
  
  const periods = [
    { value: "day", label: "24 ساعة" },
    { value: "week", label: "7 أيام" },
    { value: "twoWeeks", label: "14 يوم" },
    { value: "month", label: "30 يوم" },
    { value: "quarter", label: "ربع سنة" },
    { value: "year", label: "سنة" },
    { value: "custom", label: "مخصص" }
  ];
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };
  
  return (
    <div className="mb-8">
      <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="mb-4 bg-white rounded-lg border border-gray-100 p-2 overflow-x-auto"
      >
        <div className="flex space-x-1 space-x-reverse min-w-max">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => handlePeriodChange(period.value)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedPeriod === period.value
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center gap-1">
                {period.value === "custom" && <Calendar className="h-3.5 w-3.5" />}
                {period.label}
              </span>
            </button>
          ))}
        </div>
      </motion.div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard 
          title="المنتجات"
          value={stats.products.toString()}
          icon={<Package className="h-5 w-5" />}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatsCard 
          title="الطلبات"
          value={stats.orders.toString()}
          icon={<ShoppingBag className="h-5 w-5" />}
          iconClassName="bg-orange-100 text-orange-600"
        />
        <StatsCard 
          title="العملاء"
          value={stats.customers.toString()}
          icon={<Users className="h-5 w-5" />}
          iconClassName="bg-green-100 text-green-600"
        />
        <StatsCard 
          title="الإيرادات"
          value={formatCurrency(stats.revenue)}
          icon={<DollarSign className="h-5 w-5" />}
          iconClassName="bg-purple-100 text-purple-600"
        />
      </div>
    </div>
  );
};

export default DashboardStatsSection;
