
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Box, CheckCircle2, XCircle } from "lucide-react";
import { OrderStatus } from "@/types/orders";
import { cn } from "@/lib/utils";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ 
  status, 
  size = "md", 
  showIcon = true,
  className
}) => {
  // تكوين الأيقونة
  const getStatusIcon = () => {
    switch (status) {
      case "processing":
        return <Box className="h-3.5 w-3.5 mr-1" />;
      case "delivered":
        return <CheckCircle2 className="h-3.5 w-3.5 mr-1" />;
      case "cancelled":
        return <XCircle className="h-3.5 w-3.5 mr-1" />;
    }
  };
  
  // تكوين اللون والنص
  const getStatusConfig = () => {
    switch (status) {
      case "processing":
        return { 
          text: "قيد المعالجة", 
          className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200" 
        };
      case "delivered":
        return { 
          text: "تم التوصيل", 
          className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
        };
      case "cancelled":
        return { 
          text: "ملغي", 
          className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-200" 
        };
    }
  };

  const statusConfig = getStatusConfig();
  
  // تعيين حجم البادج
  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-sm px-2 py-0.5",
    lg: "px-2.5 py-1"
  };
  
  return (
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
};

export default OrderStatusBadge;
