
import React, { useEffect } from "react";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/orders";
import { useNavigate } from "react-router-dom";

interface OrderNotificationsProps {
  storeId: string;
}

const OrderNotifications: React.FC<OrderNotificationsProps> = ({ storeId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // إنشاء قناة للاستماع إلى الطلبات الجديدة
    const ordersChannel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `store_id=eq.${storeId}`
        },
        (payload) => {
          const newOrder = payload.new as Order;
          // عرض إشعار للطلب الجديد
          toast.success(
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div>
                <p className="font-semibold mb-1">طلب جديد!</p>
                <p className="text-sm">تم استلام طلب جديد برقم #{newOrder.order_number}</p>
              </div>
            </div>,
            {
              duration: 10000, // 10 ثواني
              action: {
                label: "عرض الطلب",
                onClick: () => navigate("/dashboard/orders")
              }
            }
          );
        }
      )
      .subscribe();

    // تنظيف عند إزالة المكون
    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [storeId, navigate]);

  return null; // هذا المكون لا يعرض أي واجهة
};

export default OrderNotifications;
