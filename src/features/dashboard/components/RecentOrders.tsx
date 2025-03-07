
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Clock, ShoppingCart, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Order, OrderStatus } from "@/types/orders";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  // تعيين لون وأيقونة لكل حالة طلب
  const getOrderStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "completed" as OrderStatus:
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "processing":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "canceled" as OrderStatus:
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <ShoppingCart className="h-4 w-4 text-blue-500" />;
    }
  };
  
  const getOrderStatusClass = (status: OrderStatus) => {
    switch (status) {
      case "completed" as OrderStatus:
        return "bg-green-50 text-green-600 border-green-200";
      case "processing":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "canceled" as OrderStatus:
        return "bg-red-50 text-red-600 border-red-200";
      case "pending" as OrderStatus:
        return "bg-blue-50 text-blue-600 border-blue-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };
  
  const getOrderStatusText = (status: OrderStatus): string => {
    switch (status) {
      case "completed" as OrderStatus:
        return "مكتمل";
      case "processing":
        return "قيد المعالجة";
      case "canceled" as OrderStatus:
        return "ملغي";
      case "pending" as OrderStatus:
        return "في الانتظار";
      default:
        return "غير معروف";
    }
  };

  return (
    <Card className="shadow-sm bg-white overflow-hidden h-full border border-gray-100 hover:border-primary-200 transition-all duration-200">
      <CardHeader className="pb-2 border-b border-gray-50 bg-gradient-to-r from-white to-gray-50 px-4 py-3">
        <CardTitle className="text-base font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </span>
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              أحدث الطلبات
            </span>
          </span>
          <Button variant="ghost" size="sm" asChild className="text-xs font-normal hover:bg-blue-50 hover:text-blue-600">
            <Link to="/dashboard/orders" className="flex items-center gap-1">
              عرض الكل
              <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardTitle>
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
                className="flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-white hover:to-blue-50/30 transition-all duration-200"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-primary-100 flex items-center justify-center text-primary-700 font-medium shadow-sm">
                      {order.customer_name?.charAt(0) || "#"}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 hover:text-primary-600 transition-colors">#{order.order_number}</p>
                    <p className="text-xs text-gray-500">{order.customer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`px-2 py-1 text-xs font-medium flex items-center gap-1 ${getOrderStatusClass(order.status)}`}>
                    {getOrderStatusIcon(order.status)}
                    <span>{getOrderStatusText(order.status)}</span>
                  </Badge>
                  <div className="text-left">
                    <p className="font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                      {order.total.toFixed(2)} د.ك
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('ar-KW')}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full hover:bg-primary-50 text-gray-400 hover:text-primary-600">
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
