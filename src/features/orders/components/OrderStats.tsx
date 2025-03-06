
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Box, TruckIcon, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

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
      <Card className="border-primary-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-3 w-16 mx-auto mt-2" />
                <Skeleton className="h-5 w-6 mx-auto mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const statsItems = [
    {
      label: "الكل",
      value: stats.total,
      icon: <ShoppingBag className="h-5 w-5" />,
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      href: "/dashboard/orders?tab=all",
      hoverBgColor: "hover:bg-gray-200"
    },
    {
      label: "قيد المعالجة",
      value: stats.processing,
      icon: <Box className="h-5 w-5" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      href: "/dashboard/orders?tab=processing",
      hoverBgColor: "hover:bg-blue-200"
    },
    {
      label: "تم الشحن",
      value: stats.shipped,
      icon: <TruckIcon className="h-5 w-5" />,
      bgColor: "bg-indigo-100",
      textColor: "text-indigo-700",
      href: "/dashboard/orders?tab=shipped",
      hoverBgColor: "hover:bg-indigo-200"
    },
    {
      label: "تم التوصيل",
      value: stats.delivered,
      icon: <CheckCircle2 className="h-5 w-5" />,
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      href: "/dashboard/orders?tab=delivered",
      hoverBgColor: "hover:bg-green-200"
    },
    {
      label: "ملغي",
      value: stats.cancelled,
      icon: <XCircle className="h-5 w-5" />,
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      href: "/dashboard/orders?tab=cancelled",
      hoverBgColor: "hover:bg-red-200"
    }
  ];

  return (
    <Card className="border-primary-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">إحصائيات الطلبات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {statsItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-full"
            >
              <Link to={item.href} className="block">
                <div className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg transition-all h-full",
                  item.bgColor,
                  item.hoverBgColor
                )}>
                  <div className={cn("p-2 rounded-full mb-2", `${item.bgColor}/60`)}>
                    <span className={item.textColor}>{item.icon}</span>
                  </div>
                  <span className="text-xs font-medium mb-1 text-center">{item.label}</span>
                  <span className={cn("text-lg font-bold", item.textColor)}>{item.value}</span>
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
