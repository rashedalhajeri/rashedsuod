
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Box, TruckIcon, CheckCircle2, XCircle } from "lucide-react";
import { OrderStatus } from "@/types/orders";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
  animated?: boolean;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ 
  status, 
  size = "md", 
  showIcon = true,
  className,
  animated = false
}) => {
  // تكوين الأيقونة
  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Box className={cn("mr-1", sizeIconClasses[size])} />;
      case "shipped":
        return <TruckIcon className={cn("mr-1", sizeIconClasses[size])} />;
      case "delivered":
        return <CheckCircle2 className={cn("mr-1", sizeIconClasses[size])} />;
      case "cancelled":
        return <XCircle className={cn("mr-1", sizeIconClasses[size])} />;
    }
  };
  
  // تكوين اللون والنص
  const getStatusConfig = () => {
    switch (status) {
      case "processing":
        return { 
          text: "قيد المعالجة", 
          className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
          animationColor: "rgba(59, 130, 246, 0.5)"
        };
      case "shipped":
        return { 
          text: "تم الشحن", 
          className: "bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200",
          animationColor: "rgba(99, 102, 241, 0.5)"
        };
      case "delivered":
        return { 
          text: "تم التوصيل", 
          className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200",
          animationColor: "rgba(34, 197, 94, 0.5)"
        };
      case "cancelled":
        return { 
          text: "ملغي", 
          className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200",
          animationColor: "rgba(239, 68, 68, 0.5)"
        };
    }
  };

  const statusConfig = getStatusConfig();
  
  // تعيين حجم البادج وأيقوناته
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-0.5",
    lg: "px-2.5 py-1"
  };
  
  const sizeIconClasses = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4"
  };
  
  const badge = (
    <Badge 
      variant="outline" 
      className={cn(
        statusConfig.className, 
        sizeClasses[size],
        "font-medium inline-flex items-center transition-colors duration-200",
        className
      )}
    >
      {showIcon && getStatusIcon()}
      {statusConfig.text}
    </Badge>
  );
  
  if (animated) {
    return (
      <div className="relative">
        {badge}
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              `0 0 0 0 ${statusConfig.animationColor}`,
              `0 0 0 8px transparent`
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </div>
    );
  }
  
  return badge;
};

export default OrderStatusBadge;
