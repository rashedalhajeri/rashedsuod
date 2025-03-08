
import React, { useState } from "react";
import { ShoppingBag, Package, Users, DollarSign, Calendar, ArrowRight, ChevronDown } from "lucide-react";
import StatsCard from "@/features/dashboard/components/StatsCard";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
  
  // Dummy data for trends and sparklines
  const trends = {
    products: { value: 12, isPositive: true },
    orders: { value: 8, isPositive: true },
    customers: { value: 5, isPositive: true },
    revenue: { value: 15, isPositive: true }
  };
  
  const sparklines = {
    products: [5, 7, 10, 8, 12, 15, 18],
    orders: [10, 12, 8, 9, 11, 13, 15],
    customers: [8, 9, 7, 10, 12, 13, 11],
    revenue: [12, 15, 18, 16, 19, 22, 25]
  };
  
  const periods = [
    { value: "day", label: "24 ساعة" },
    { value: "week", label: "7 أيام" },
    { value: "twoWeeks", label: "14 يوم" },
    { value: "month", label: "30 يوم" },
    { value: "quarter", label: "ربع سنة" },
    { value: "year", label: "سنة" },
  ];
  
  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };
  
  const selectedPeriodLabel = periods.find(p => p.value === selectedPeriod)?.label || "24 ساعة";
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">إحصائيات المتجر</h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm"
              >
                <Calendar className="h-4 w-4 ml-2 text-primary-500" />
                <span>{selectedPeriodLabel}</span>
                <ChevronDown className="h-4 w-4 mr-1 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {periods.map((period) => (
                <DropdownMenuItem 
                  key={period.value}
                  onClick={() => handlePeriodChange(period.value)}
                  className={`flex justify-between items-center cursor-pointer ${
                    selectedPeriod === period.value ? 'bg-primary-50 text-primary-600 font-medium' : ''
                  }`}
                >
                  {period.label}
                  {selectedPeriod === period.value && <ArrowRight className="h-4 w-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatsCard 
          title="المنتجات"
          value={stats.products.toString()}
          icon={<Package className="h-5 w-5" />}
          iconClassName="bg-blue-100 text-blue-600"
          trend={trends.products}
          sparklineData={sparklines.products}
        />
        <StatsCard 
          title="الطلبات"
          value={stats.orders.toString()}
          icon={<ShoppingBag className="h-5 w-5" />}
          iconClassName="bg-orange-100 text-orange-600"
          trend={trends.orders}
          sparklineData={sparklines.orders}
        />
        <StatsCard 
          title="العملاء"
          value={stats.customers.toString()}
          icon={<Users className="h-5 w-5" />}
          iconClassName="bg-green-100 text-green-600"
          trend={trends.customers}
          sparklineData={sparklines.customers}
        />
        <StatsCard 
          title="الإيرادات"
          value={formatCurrency(stats.revenue)}
          icon={<DollarSign className="h-5 w-5" />}
          iconClassName="bg-purple-100 text-purple-600"
          trend={trends.revenue}
          sparklineData={sparklines.revenue}
          isCurrency={true}
        />
      </div>
    </div>
  );
};

export default DashboardStatsSection;
