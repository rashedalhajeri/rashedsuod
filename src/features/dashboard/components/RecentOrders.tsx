
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Clock, ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Order, OrderStatus } from "@/types/orders";

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
        return "text-green-600 bg-green-50";
      case "processing":
        return "text-amber-600 bg-amber-50";
      case "canceled" as OrderStatus:
        return "text-red-600 bg-red-50";
      case "pending" as OrderStatus:
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
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
    <Card className="shadow-sm bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </span>
            أحدث الطلبات
          </span>
          <Button variant="ghost" size="sm" asChild className="text-xs font-normal">
            <Link to="/dashboard/orders" className="flex items-center gap-1">
              عرض الكل
              <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-medium">
                      {order.customer_name?.charAt(0) || "#"}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">#{order.order_number}</p>
                    <p className="text-sm text-gray-500">{order.customer_name}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getOrderStatusClass(order.status)}`}>
                    {getOrderStatusIcon(order.status)}
                    <span>{getOrderStatusText(order.status)}</span>
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{order.amount?.toFixed(2)} د.ك</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('ar-KW')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <ShoppingCart className="h-10 w-10 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">لا توجد طلبات حتى الآن</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
