
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bell, Package, CreditCard, User } from "lucide-react";
import OrderNotifications from "@/features/orders/components/OrderNotifications";
import { useStoreData } from "@/hooks/use-store-data";

const RealTimeNotifications: React.FC = () => {
  const { data: storeData } = useStoreData();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // إذا كان لدينا معرف المتجر، نقوم بتفعيل الإشعارات
  useEffect(() => {
    if (storeData?.id && notificationsEnabled) {
      // سنستخدم مكون OrderNotifications للاستماع إلى الطلبات الجديدة
      console.log("تم تفعيل الإشعارات لمتجر:", storeData.id);
    }
  }, [storeData?.id, notificationsEnabled]);
  
  // دالة لتفعيل أو إلغاء تفعيل الإشعارات
  const toggleNotifications = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    toast.success(newState ? "تم تفعيل الإشعارات" : "تم إيقاف الإشعارات");
  };
  
  return (
    <>
      {/* يتم عرض إشعارات الطلبات فقط عندما تكون الإشعارات مفعلة ولدينا معرف متجر */}
      {notificationsEnabled && storeData?.id && (
        <OrderNotifications storeId={storeData.id} />
      )}
    </>
  );
};

export default RealTimeNotifications;
