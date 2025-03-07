
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Box, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";

interface OrderStats {
  total: number;
  processing: number;
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
  // استخدام استعلام الميديا لتحديد ما إذا كنا في وضع الهاتف
  const isMobile = useMediaQuery("(max-width: 768px)");

  // إذا كنا في وضع الهاتف، نخفي المكون تمامًا
  if (isMobile) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="border-primary-100 shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
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
      hoverBgColor: "hover:bg-gray-200",
      borderColor: "border-gray-200"
    },
    {
      label: "قيد المعالجة",
      value: stats.processing,
      icon: <Box className="h-5 w-5" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      href: "/dashboard/orders?tab=processing",
      hoverBgColor: "hover:bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      label: "تم التوصيل",
      value: stats.delivered,
      icon: <CheckCircle2 className="h-5 w-5" />,
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      href: "/dashboard/orders?tab=delivered",
      hoverBgColor: "hover:bg-green-100",
      borderColor: "border-green-200"
    },
    {
      label: "ملغي",
      value: stats.cancelled,
      icon: <XCircle className="h-5 w-5" />,
      bgColor: "bg-red-50",
      textColor: "text-red-700",
      href: "/dashboard/orders?tab=cancelled",
      hoverBgColor: "hover:bg-red-100",
      borderColor: "border-red-200"
    }
  ];

  return (
    <Card className="border-none shadow-md bg-white overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-50 to-primary-50 border-b">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </span>
          <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            إحصائيات الطلبات
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {statsItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="w-full"
            >
              <Link to={item.href} className="block h-full">
                <div className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl transition-all h-full border",
                  item.bgColor,
                  item.hoverBgColor,
                  item.borderColor
                )}>
                  <div className={cn("p-3 rounded-full mb-3", `${item.bgColor}/80`)}>
                    <span className={item.textColor}>{item.icon}</span>
                  </div>
                  <span className="text-sm font-medium mb-1 text-center">{item.label}</span>
                  <span className={cn("text-xl font-bold", item.textColor)}>{item.value}</span>
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
