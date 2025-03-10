
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface DashboardStatsProps {
  stats: {
    products: number;
    orders: number;
    customers: number;
    revenue: number;
  };
  formatCurrency: (value: number) => string;
  onPeriodChange?: (period: string) => void;
  isLoading?: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  formatCurrency,
  onPeriodChange,
  isLoading = false
}) => {
  const handlePeriodChange = (period: string) => {
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };

  const statCards = [
    {
      title: "المنتجات",
      value: stats.products,
      valueFormatted: stats.products.toString(),
      color: "bg-blue-50 text-blue-500"
    },
    {
      title: "الطلبات",
      value: stats.orders,
      valueFormatted: stats.orders.toString(),
      color: "bg-purple-50 text-purple-500"
    },
    {
      title: "العملاء",
      value: stats.customers,
      valueFormatted: stats.customers.toString(),
      color: "bg-green-50 text-green-500"
    },
    {
      title: "المبيعات",
      value: stats.revenue,
      valueFormatted: formatCurrency(stats.revenue),
      color: "bg-orange-50 text-orange-500"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">إحصائيات المتجر</h2>
        
        {onPeriodChange && (
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <button
              onClick={() => handlePeriodChange("daily")}
              className="text-sm font-medium text-gray-500 hover:text-primary-600 px-2 py-1 rounded"
            >
              يومي
            </button>
            <button
              onClick={() => handlePeriodChange("weekly")}
              className="text-sm font-medium text-gray-500 hover:text-primary-600 px-2 py-1 rounded"
            >
              أسبوعي
            </button>
            <button
              onClick={() => handlePeriodChange("monthly")}
              className="text-sm font-medium text-primary-600 px-2 py-1 rounded bg-primary-50"
            >
              شهري
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="border border-gray-100">
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-7 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xl font-bold">{stat.valueFormatted}</p>
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", stat.color)}>
                      {/* Icon could be added here */}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;
