
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Clock, ShoppingCart, ChevronRight, ExternalLink, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Order, OrderStatus } from "@/types/orders";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  // Status definitions
  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getOrderStatusClass = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-600 border-green-200";
      case "processing":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };
  
  const getOrderStatusText = (status: OrderStatus): string => {
    switch (status) {
      case "delivered":
        return "تم التوصيل";
      case "processing":
        return "قيد المعالجة";
      case "cancelled":
        return "ملغي";
      default:
        return "غير معروف";
    }
  };

  return (
    <Card className="shadow-sm bg-white overflow-hidden h-full border border-gray-100 hover:border-primary-200 transition-all duration-200">
      <CardHeader className="pb-2 border-b border-gray-50 bg-gradient-to-r from-white to-gray-50/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <span className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </span>
            <span className="text-gray-900">
              أحدث الطلبات
            </span>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild className="text-xs font-normal hover:bg-blue-50 hover:text-blue-600">
              <Link to="/dashboard/orders" className="flex items-center gap-1">
                عرض الكل
                <ChevronRight className="h-3 w-3" />
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-gray-100"
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>تصدير الطلبات</DropdownMenuItem>
                <DropdownMenuItem>طباعة قائمة الطلبات</DropdownMenuItem>
                <DropdownMenuItem>تحديث البيانات</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {orders && orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orders.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-white hover:to-blue-50/30 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <Avatar className="h-10 w-10 border border-blue-100 group-hover:border-blue-200 transition-colors">
                    <AvatarFallback className="bg-gradient-to-r from-blue-100 to-primary-100 text-primary-700 font-medium">
                      {order.customer_name?.charAt(0) || "#"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">#{order.order_number}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="line-clamp-1">{order.customer_name}</span>
                      <span className="inline-block h-1 w-1 rounded-full bg-gray-300"></span>
                      <span className="font-medium text-gray-600">{new Date(order.created_at).toLocaleDateString('ar-KW')}</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`px-2 py-1 text-xs font-medium flex items-center gap-1 ${getOrderStatusClass(order.status)}`}>
                    {getOrderStatusIcon(order.status)}
                    <span>{getOrderStatusText(order.status)}</span>
                  </Badge>
                  <div className="text-left">
                    <p className="font-bold text-gray-900">
                      {order.total.toFixed(2)} د.ك
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary-50 text-gray-400 hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">لا توجد طلبات حتى الآن</p>
            <Button variant="outline" size="sm" className="mt-3 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200" asChild>
              <Link to="/dashboard/orders/create">إضافة طلب جديد</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
