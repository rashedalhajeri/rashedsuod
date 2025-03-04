
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Order } from "@/types/orders";
import { useNavigate } from "react-router-dom";

interface OrderNotificationsProps {
  storeId: string;
}

const OrderNotifications: React.FC<OrderNotificationsProps> = ({ storeId }) => {
  const navigate = useNavigate();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!storeId) {
      console.warn("لم يتم توفير معرف المتجر لإشعارات الطلبات");
      return;
    }

    try {
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
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('تم الاشتراك بنجاح في إشعارات الطلبات');
            setConnected(true);
          } else if (status === 'CHANNEL_ERROR') {
            console.error('حدث خطأ في الاتصال بقناة الإشعارات');
            setConnected(false);
          }
        });

      // تنظيف عند إزالة المكون
      return () => {
        console.log('إلغاء الاشتراك من قناة إشعارات الطلبات');
        supabase.removeChannel(ordersChannel);
      };
    } catch (error) {
      console.error('خطأ في إعداد إشعارات الطلبات:', error);
      return () => {};
    }
  }, [storeId, navigate]);

  // هذا المكون لا يعرض أي واجهة
  return null;
};

export default OrderNotifications;
