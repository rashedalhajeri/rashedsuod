import React from "react";
import { Order } from "@/types/orders";
import OrderStatusBadge from "./OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { motion } from "framer-motion";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import OrderEmptyState from "./OrderEmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface OrdersListProps {
  orders: Order[];
  currency?: string;
  isLoading?: boolean;
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
  onDelete?: (orderId: string) => void;
}

const OrdersList: React.FC<OrdersListProps> = ({
  orders,
  currency = "SAR",
  isLoading = false,
  onViewDetails,
  onUpdateStatus,
  onDelete
}) => {
  const formatCurrency = getCurrencyFormatter(currency);
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ar 
      });
    } catch (err) {
      return dateString;
    }
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card 
            key={`skeleton-${i}`} 
            className="animate-pulse"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-3 w-40 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!orders || orders.length === 0) {
    return <OrderEmptyState />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {orders.map((order) => (
        <motion.div 
          key={order.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="card-hover"
        >
          <Card className="border border-gray-200 hover:border-primary-100 hover:shadow transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-5 w-5 text-primary-500" />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium">#{order.order_number}</h3>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
                      <span>{order.customer_name}</span>
                      <span className="text-gray-300">•</span>
                      <span title={new Date(order.created_at).toLocaleString('ar')}>
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 ms-auto mt-2 md:mt-0">
                  <div className="text-right font-medium">
                    {formatCurrency(order.total)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => onViewDetails(order)}
                    >
                      تفاصيل
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" dir="rtl">
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "processing")}>
                          تغيير إلى: قيد المعالجة
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "shipped")}>
                          تغيير إلى: تم الشحن
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "delivered")}>
                          تغيير إلى: تم التوصيل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "cancelled")}>
                          تغيير إلى: ملغي
                        </DropdownMenuItem>
                        {onDelete && (
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500"
                            onClick={() => onDelete(order.id)}
                          >
                            حذف الطلب
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default OrdersList;
