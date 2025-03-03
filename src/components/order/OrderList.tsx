
import React from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ChevronLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Order } from "@/pages/Orders";

interface OrderListProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  selectedOrderId: string | undefined;
  formatCurrency: (amount: number) => string;
}

export function OrderList({ orders, onSelectOrder, selectedOrderId, formatCurrency }: OrderListProps) {
  // Get status badge styling based on order status
  const getStatusBadge = (status: Order["status"]) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
      processing: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      shipped: "bg-purple-100 text-purple-800 hover:bg-purple-100",
      delivered: "bg-green-100 text-green-800 hover:bg-green-100",
      cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
      returned: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    };

    const labels = {
      pending: "جديد",
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
      returned: "مرتجع",
    };

    return (
      <Badge 
        variant="outline" 
        className={variants[status]}
      >
        {labels[status]}
      </Badge>
    );
  };

  return (
    <ScrollArea className="h-[calc(100vh-320px)] rounded-md border">
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
          <p>لا توجد طلبات متطابقة مع معايير البحث</p>
        </div>
      ) : (
        orders.map((order, index) => (
          <div key={order.id}>
            <div 
              className={cn(
                "flex items-start p-4 cursor-pointer hover:bg-gray-50 transition-colors",
                selectedOrderId === order.id ? "bg-primary-50" : ""
              )}
              onClick={() => onSelectOrder(order)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{order.customer_name}</h3>
                    <div className="text-sm text-muted-foreground flex flex-wrap gap-1 items-center mt-1">
                      <span>{order.order_number}</span>
                      <span className="text-xs">•</span>
                      <span dir="ltr" className="font-mono">
                        {format(new Date(order.date), "d MMM yyyy, HH:mm", { locale: ar })}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(order.total)}</div>
                    <div className="mt-1">{getStatusBadge(order.status)}</div>
                  </div>
                </div>

                <div className="mt-2 text-sm truncate text-muted-foreground">
                  {order.items.length} {order.items.length === 1 ? "منتج" : "منتجات"}
                  {order.tracking_number && (
                    <>
                      <span className="text-xs mx-1">•</span>
                      <span dir="ltr" className="font-mono">{order.tracking_number}</span>
                    </>
                  )}
                </div>
              </div>
              <ChevronLeft className={cn(
                "h-5 w-5 mr-2 transition-opacity", 
                selectedOrderId === order.id ? "opacity-100 text-primary-600" : "opacity-0 text-muted-foreground"
              )} />
            </div>
            {index < orders.length - 1 && <Separator />}
          </div>
        ))
      )}
    </ScrollArea>
  );
}
