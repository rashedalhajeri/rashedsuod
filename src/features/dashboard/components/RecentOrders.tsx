
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/orders";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import OrderStatusBadge from '@/features/orders/components/OrderStatusBadge';
import { getCurrencyFormatter } from '@/hooks/use-store-data';

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">آخر الطلبات</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/orders" className="flex items-center gap-1 text-sm font-normal">
            عرض الكل
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link 
                key={order.id} 
                to={`/dashboard/orders?view=${order.id}`}
                className="flex items-center justify-between gap-4 rounded-lg border p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary-50 flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-primary-500" />
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
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <ShoppingBag className="h-10 w-10 text-gray-300 mb-2" />
            <h3 className="text-sm font-medium text-gray-600">لا توجد طلبات حتى الآن</h3>
            <p className="text-xs text-gray-500 mt-1">ستظهر آخر الطلبات هنا عند إضافتها</p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/dashboard/orders/new">إنشاء طلب جديد</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
