
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import OrderNotifications from "@/features/orders/components/OrderNotifications";
import { useStoreData } from "@/hooks/use-store-data";

interface RealTimeNotificationsProps {
  storeId?: string;
}

const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({ storeId }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  
  useEffect(() => {
    // تفعيل الإشعارات فقط عندما يكون لدينا معرف متجر
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
  
  // دالة لتفعيل أو إلغاء تفعيل الإشعارات
  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    toast.success(newState ? "تم تفعيل الإشعارات" : "تم إيقاف الإشعارات");
  };
  
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
