
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Order } from "@/types/orders";
import OrderStatusBadge from "@/features/orders/components/OrderStatusBadge";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

interface RecentOrdersProps {
  orders: Order[];
  currency?: string;
  isLoading?: boolean;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ 
  orders, 
  currency = "SAR",
  isLoading = false
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">
            <ShoppingBag className="h-4 w-4 inline-block ml-2" />
            آخر الطلبات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse flex justify-between items-center p-3 rounded-lg">
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-3 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <ShoppingBag className="h-4 w-4 inline-block ml-2" />
          آخر الطلبات
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/dashboard/orders" className="text-sm text-muted-foreground">
            عرض الكل
            <ArrowRight className="h-4 w-4 mr-1" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">لا توجد طلبات حديثة</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Link 
                      to={`/dashboard/orders`}
                      className="font-medium hover:underline"
                    >
                      #{order.order_number}
                    </Link>
                    <OrderStatusBadge status={order.status} size="sm" showIcon={false} />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{order.customer_name}</span>
                    <span>•</span>
                    <span>{formatDate(order.created_at)}</span>
                  </div>
                </div>
                <div className="font-medium">
                  {formatCurrency(order.total)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
