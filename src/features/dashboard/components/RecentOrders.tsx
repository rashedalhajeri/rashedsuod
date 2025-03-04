
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/orders";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import OrderStatusBadge from '@/features/orders/components/OrderStatusBadge';
import { getCurrencyFormatter } from '@/hooks/use-store-data';
import { motion } from "framer-motion";

interface RecentOrdersProps {
  orders: Order[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ orders }) => {
  const formatCurrency = getCurrencyFormatter();
  
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
  
  return (
    <Card className="border-primary-100 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
        <CardTitle className="text-lg font-medium flex items-center">
          <ShoppingBag className="h-5 w-5 ml-2 text-primary-500" />
          آخر الطلبات
        </CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-primary-500 hover:text-primary-600 transition-colors">
          <Link to="/dashboard/orders" className="flex items-center gap-1 text-sm font-normal">
            عرض الكل
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="pt-4">
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link 
                  to={`/dashboard/orders?view=${order.id}`}
                  className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">#{order.order_number}</p>
                      <p className="text-xs text-gray-500">{order.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} size="sm" />
                    <div className="text-right">
                      <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="bg-primary-50 p-3 rounded-full mb-3">
              <ShoppingBag className="h-8 w-8 text-primary-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">لا توجد طلبات حتى الآن</h3>
            <p className="text-xs text-gray-500 mt-1">ستظهر آخر الطلبات هنا عند إضافتها</p>
            <Button asChild variant="outline" size="sm" className="mt-4 hover:bg-primary-50 hover:text-primary-600 transition-all">
              <Link to="/dashboard/orders/new">إنشاء طلب جديد</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
