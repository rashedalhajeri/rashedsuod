
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Package, ShoppingCart, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: string | number;
    isPositive: boolean;
  };
  footer?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, change, footer }) => {
  return (
    <Card className="border-gray-200 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
          </div>
          <div className="flex items-center justify-center p-2 bg-primary/10 text-primary rounded-lg">
            {icon}
          </div>
        </div>
        
        {(change || footer) && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            {change && (
              <div className="flex items-center text-sm">
                <span className={cn(
                  "flex items-center",
                  change.isPositive ? "text-green-600" : "text-red-600"
                )}>
                  {change.isPositive ? (
                    <ArrowUp className="h-3.5 w-3.5 ml-1" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5 ml-1" />
                  )}
                  {change.value}
                </span>
                <span className="mx-1 text-gray-500">مقارنة بالشهر الماضي</span>
              </div>
            )}
            {footer && (
              <p className="text-sm text-gray-500">{footer}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  stats: {
    orders: number;
    revenue: number;
    customers: number;
    products: number;
  };
  loading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="border-gray-200">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-7 w-20 bg-gray-300 rounded mb-6"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="إجمالي الطلبات"
        value={stats.orders}
        icon={<ShoppingCart className="h-5 w-5" />}
        change={{ value: "8.2%", isPositive: true }}
      />
      <StatsCard
        title="إجمالي المبيعات"
        value={formatCurrency(stats.revenue)}
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M5.5 4C4.67 4 4 4.67 4 5.5V18.5C4 19.33 4.67 20 5.5 20H18.5C19.33 20 20 19.33 20 18.5V5.5C20 4.67 19.33 4 18.5 4H5.5ZM5.5 5H18.5C18.78 5 19 5.22 19 5.5V18.5C19 18.78 18.78 19 18.5 19H5.5C5.22 19 5 18.78 5 18.5V5.5C5 5.22 5.22 5 5.5 5ZM8 7.75C7.59 7.75 7.25 8.09 7.25 8.5C7.25 8.91 7.59 9.25 8 9.25C8.41 9.25 8.75 8.91 8.75 8.5C8.75 8.09 8.41 7.75 8 7.75ZM11.5 7.75C11.09 7.75 10.75 8.09 10.75 8.5C10.75 8.91 11.09 9.25 11.5 9.25C11.91 9.25 12.25 8.91 12.25 8.5C12.25 8.09 11.91 7.75 11.5 7.75ZM15 7.75C14.59 7.75 14.25 8.09 14.25 8.5C14.25 8.91 14.59 9.25 15 9.25C15.41 9.25 15.75 8.91 15.75 8.5C15.75 8.09 15.41 7.75 15 7.75ZM8 11.25C7.59 11.25 7.25 11.59 7.25 12C7.25 12.41 7.59 12.75 8 12.75C8.41 12.75 8.75 12.41 8.75 12C8.75 11.59 8.41 11.25 8 11.25ZM11.5 11.25C11.09 11.25 10.75 11.59 10.75 12C10.75 12.41 11.09 12.75 11.5 12.75C11.91 12.75 12.25 12.41 12.25 12C12.25 11.59 11.91 11.25 11.5 11.25ZM15 11.25C14.59 11.25 14.25 11.59 14.25 12C14.25 12.41 14.59 12.75 15 12.75C15.41 12.75 15.75 12.41 15.75 12C15.75 11.59 15.41 11.25 15 11.25ZM8 14.75C7.59 14.75 7.25 15.09 7.25 15.5C7.25 15.91 7.59 16.25 8 16.25C8.41 16.25 8.75 15.91 8.75 15.5C8.75 15.09 8.41 14.75 8 14.75ZM11.5 14.75C11.09 14.75 10.75 15.09 10.75 15.5C10.75 15.91 11.09 16.25 11.5 16.25C11.91 16.25 12.25 15.91 12.25 15.5C12.25 15.09 11.91 14.75 11.5 14.75Z" />
        </svg>}
        change={{ value: "12.3%", isPositive: true }}
      />
      <StatsCard
        title="عدد العملاء"
        value={stats.customers}
        icon={<Users className="h-5 w-5" />}
        change={{ value: "5.1%", isPositive: true }}
      />
      <StatsCard
        title="عدد المنتجات"
        value={stats.products}
        icon={<Package className="h-5 w-5" />}
        footer="إجمالي عدد المنتجات في المتجر"
      />
    </div>
  );
};

export default DashboardStats;
