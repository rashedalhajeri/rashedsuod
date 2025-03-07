import React from "react";
import { Order } from "@/types/orders";
import OrderStatusBadge from "./OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, MoreHorizontal, Eye, Clock, CheckCircle2, X, Trash2 } from "lucide-react";
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";
import { ProductImage } from "@/components/product/item/ProductImage";

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  
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

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return <ShoppingBag className="h-4 w-4 text-gray-500" />;
    }
  };
  
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
          <Card className="border border-gray-200 hover:border-primary-100 hover:shadow-md transition-all duration-200 overflow-hidden">
            <CardContent className="p-4 relative">
              <div className={`absolute top-0 left-0 right-0 h-1 ${
                order.status === 'processing' ? 'bg-blue-500' :
                order.status === 'delivered' ? 'bg-green-500' :
                'bg-red-500'
              }`}></div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      order.status === 'processing' ? 'bg-blue-50' :
                      order.status === 'delivered' ? 'bg-green-50' :
                      'bg-red-50'
                    }`}>
                      {getStatusIcon(order.status)}
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
                  
                  <div className="font-medium text-right">
                    {formatCurrency(order.total)}
                  </div>
                </div>
                
                {!isMobile && order.items && order.items.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-gray-200">
                    {order.items.slice(0, 4).map((item, index) => (
                      <div key={index} className="relative flex-shrink-0">
                        <ProductImage 
                          imageUrl={item.product_image || '/placeholder.svg'} 
                          name={item.product_name || 'منتج'} 
                          className=""
                        />
                        {item.quantity > 1 && (
                          <Badge 
                            variant="secondary" 
                            className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs"
                          >
                            {item.quantity}
                          </Badge>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <Badge variant="outline" className="h-6 flex items-center">
                        +{order.items.length - 4}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500 rtl">
                    {order.items && (
                      <span>{order.items.length} منتج · {order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)} عنصر</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs px-3 border-gray-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-100"
                      onClick={() => onViewDetails(order)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      تفاصيل
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rtl">
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "processing")} className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span>قيد المعالجة</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "delivered")} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>تم التوصيل</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onUpdateStatus(order.id, "cancelled")} className="flex items-center gap-2">
                          <X className="h-4 w-4 text-red-500" />
                          <span>ملغي</span>
                        </DropdownMenuItem>
                        {onDelete && (
                          <DropdownMenuItem 
                            className="text-red-500 focus:text-red-500 flex items-center gap-2"
                            onClick={() => onDelete(order.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>حذف الطلب</span>
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
