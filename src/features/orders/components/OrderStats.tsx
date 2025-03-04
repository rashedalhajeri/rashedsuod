
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Box, TruckIcon, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface OrderStats {
  total: number;
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
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto"></div>
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
      textColor: "text-gray-700",
      href: "/dashboard/orders?tab=all",
      hoverBgColor: "hover:bg-gray-200",
    },
    {
      label: "قيد المعالجة",
      value: stats.processing,
      icon: <Box className="h-5 w-5" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      href: "/dashboard/orders?tab=processing",
      hoverBgColor: "hover:bg-blue-200",
    },
    {
      label: "تم الشحن",
      value: stats.shipped,
      icon: <TruckIcon className="h-5 w-5" />,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-700",
      href: "/dashboard/orders?tab=shipped",
      hoverBgColor: "hover:bg-indigo-200",
    },
    {
      label: "تم التوصيل",
      value: stats.delivered,
      icon: <CheckCircle2 className="h-5 w-5" />,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      href: "/dashboard/orders?tab=delivered",
      hoverBgColor: "hover:bg-green-200",
    },
    {
      label: "ملغي",
      value: stats.cancelled,
      icon: <XCircle className="h-5 w-5" />,
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      href: "/dashboard/orders?tab=cancelled",
      hoverBgColor: "hover:bg-red-200",
    }
  ];
  
  return (
    <Card className="border-primary-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <ShoppingBag className="h-5 w-5 inline-block ml-2" />
          إحصائيات الطلبات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          {statsItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <Link to={item.href} className="block">
                <div className="group">
                  <div className={cn(
                    "h-16 w-16 rounded-full flex items-center justify-center mx-auto transition-colors duration-200",
                    item.bgColor,
                    item.hoverBgColor
                  )}>
                    {React.cloneElement(item.icon, { className: cn("h-8 w-8 transition-transform duration-200 group-hover:scale-110", item.textColor) })}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{item.label}</p>
                  <p className={cn("text-xl font-bold transition-all duration-200 group-hover:scale-110", item.textColor)}>
                    {item.value}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStats;
