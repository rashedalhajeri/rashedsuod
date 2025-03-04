
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, TrendingUp, Users, ShoppingCart, DollarSign, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";

interface Stat {
  title: string;
  value: string | number;
  percentage?: number;
  isPositive?: boolean;
  target?: number;
  current?: number;
  icon: React.ReactNode;
  color: string;
  tooltip?: string;
}

interface AdvancedStatsProps {
  revenue: number;
  orderCount: number;
  conversionRate: number;
  avgOrderValue: number;
  lowStockCount: number;
  formatCurrency: (value: number) => string;
}

const AdvancedStats: React.FC<AdvancedStatsProps> = ({
  revenue,
  orderCount,
  conversionRate,
  avgOrderValue,
  lowStockCount,
  formatCurrency
}) => {
  const stats: Stat[] = [
    {
      title: "الإيرادات",
      value: formatCurrency(revenue),
      percentage: 12.5,
      isPositive: true,
      target: 10000,
      current: revenue,
      icon: <DollarSign className="h-5 w-5" />,
      color: "bg-blue-500",
      tooltip: "إجمالي الإيرادات لهذا الشهر"
    },
    {
      title: "متوسط قيمة الطلب",
      value: formatCurrency(avgOrderValue),
      percentage: 5.3,
      isPositive: true,
      icon: <ShoppingCart className="h-5 w-5" />,
      color: "bg-purple-500",
      tooltip: "متوسط قيمة الطلب الواحد"
    },
    {
      title: "معدل التحويل",
      value: `${conversionRate}%`,
      percentage: -2.1,
      isPositive: false,
      target: 5,
      current: conversionRate,
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-green-500",
      tooltip: "نسبة تحويل الزوار إلى مشترين"
    },
    {
      title: "المنتجات منخفضة المخزون",
      value: lowStockCount,
      icon: <Package className="h-5 w-5" />,
      color: "bg-amber-500",
      tooltip: "المنتجات التي وصلت للحد الأدنى من المخزون"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <TooltipProvider>
        {stats.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-gray-200 hover:border-primary-200 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        {stat.title}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{stat.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    {stat.percentage !== undefined && (
                      <span 
                        className={cn(
                          "text-xs font-medium flex items-center",
                          stat.isPositive ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {stat.isPositive ? (
                          <ArrowUp className="h-3 w-3 inline mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 inline mr-1" />
                        )}
                        {Math.abs(stat.percentage)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div className={cn("p-2 rounded-full", `bg-${stat.color.split('-')[1]}-100`)}>
                  {React.cloneElement(stat.icon as React.ReactElement, { 
                    className: `h-5 w-5 ${stat.color.replace('bg-', 'text-')}` 
                  })}
                </div>
              </div>
              
              {(stat.target && stat.current) && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>التقدم</span>
                    <span>{Math.round((stat.current / stat.target) * 100)}% من الهدف</span>
                  </div>
                  <Progress 
                    value={(stat.current / stat.target) * 100} 
                    className={cn(
                      "h-1.5", 
                      (stat.current / stat.target) >= 1 ? "bg-green-100" : "bg-gray-100"
                    )}
                    indicatorClassName={
                      (stat.current / stat.target) >= 1 ? "bg-green-500" : stat.color
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default AdvancedStats;
