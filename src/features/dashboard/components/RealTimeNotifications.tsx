
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import OrderNotifications from "@/features/orders/components/OrderNotifications";

interface RealTimeNotificationsProps {
  storeId?: string;
}

// Este componente solo debe usarse en el Dashboard, nunca en la vista de tienda para visitantes
const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({ storeId }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  
  useEffect(() => {
    // Verificar si estamos en el dashboard (no en la vista de tienda)
    const currentPath = window.location.pathname;
    const isDashboardPath = currentPath.includes('/dashboard') || currentPath.includes('/admin');
    setIsDashboard(isDashboardPath);
    
    // Solo activar notificaciones en el dashboard
    if (storeId && notificationsEnabled && isDashboardPath) {
      try {
        console.log("Activando notificaciones para administrador de tienda:", storeId);
        setIsRealtimeConnected(true);
      } catch (error) {
        console.error("Error al activar notificaciones:", error);
        toast.error("Error al activar notificaciones. Recargue la página para intentar nuevamente");
        setIsRealtimeConnected(false);
      }
    }
    
    return () => {
      if (isRealtimeConnected) {
        console.log("Desactivando notificaciones");
      }
    };
  }, [storeId, notificationsEnabled]);
  
  // No renderizar nada si no estamos en el dashboard o no hay storeId
  if (!storeId || !isDashboard) {
    return null;
  }
  
  return (
    <>
      {notificationsEnabled && storeId && isDashboard && (
        <OrderNotifications storeId={storeId} />
      )}
    </>
  );
};

export default RealTimeNotifications;
