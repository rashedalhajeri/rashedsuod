
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Clock, Box, TruckIcon, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface OrderStatsProps {
  stats: OrderStats;
  isLoading?: boolean;
}

const OrderStats: React.FC<OrderStatsProps> = ({ 
  stats, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-3 w-16 bg-gray-200 rounded mx-auto mt-2"></div>
                <div className="h-5 w-6 bg-gray-200 rounded mx-auto mt-1"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // إنشاء مصفوفة من البيانات للعرض المبسط
  const statsItems = [
    {
      label: "الكل",
      value: stats.total,
      icon: <ShoppingBag className="h-5 w-5" />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-700"
    },
    {
      label: "قيد التنفيذ",
      value: stats.pending + stats.processing + stats.shipped,
      icon: <Box className="h-5 w-5" />,
      bgColor: "bg-amber-100",
      textColor: "text-amber-700"
    },
    {
      label: "مكتمل",
      value: stats.delivered,
      icon: <CheckCircle2 className="h-5 w-5" />,
      bgColor: "bg-green-100",
      textColor: "text-green-700"
    }
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <ShoppingBag className="h-5 w-5 inline-block ml-2" />
          إحصائيات الطلبات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {statsItems.map((item, index) => (
            <div key={index} className="text-center">
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center mx-auto", item.bgColor)}>
                {React.cloneElement(item.icon, { className: cn("h-6 w-6", item.textColor) })}
              </div>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
              <p className={cn("text-lg font-semibold", item.textColor)}>{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStats;
