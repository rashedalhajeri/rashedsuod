
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderNotifications from "@/features/orders/components/OrderNotifications";

interface RealTimeNotificationsProps {
  storeId?: string;
}

const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({ storeId }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  
  useEffect(() => {
    // تفعيل الإشعارات فقط عندما يكون لدينا معرف متجر ونكون في لوحة التحكم
    if (storeId && notificationsEnabled) {
      try {
        console.log("جاري تفعيل الإشعارات لمتجر:", storeId);
        setIsRealtimeConnected(true);
      } catch (error) {
        console.error("حدث خطأ أثناء تفعيل الإشعارات:", error);
        toast.error("فشل في تفعيل الإشعارات. يرجى إعادة تحميل الصفحة");
        setIsRealtimeConnected(false);
      }
    }
    
    return () => {
      // تنظيف عند إزالة المكون
      if (isRealtimeConnected) {
        console.log("تم إلغاء الاشتراك في الإشعارات");
      }
    };
  }, [storeId, notificationsEnabled]);
  
  // عدم عرض أي شيء إذا لم يكن هناك معرف متجر
  if (!storeId) {
    return null;
  }
  
  return (
    <>
      {notificationsEnabled && storeId && (
        <OrderNotifications storeId={storeId} />
      )}
    </>
  );
};

export default RealTimeNotifications;
