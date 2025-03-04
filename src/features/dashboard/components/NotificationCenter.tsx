
import React, { useState } from "react";
import { Bell, X, ShoppingBag, Package, AlertTriangle, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  type: 'order' | 'inventory' | 'payment' | 'alert';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link?: string;
}

const NotificationCenter: React.FC = () => {
  // Mock notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'order',
      title: 'طلب جديد',
      description: 'تم استلام طلب جديد بقيمة 350 ر.س.',
      time: 'منذ 5 دقائق',
      read: false,
      link: '/dashboard/orders'
    },
    {
      id: '2',
      type: 'inventory',
      title: 'تنبيه المخزون',
      description: '3 منتجات وصلت للحد الأدنى من المخزون',
      time: 'منذ ساعة',
      read: false,
      link: '/dashboard/products'
    },
    {
      id: '3',
      type: 'payment',
      title: 'تأكيد الدفع',
      description: 'تم تأكيد دفع الطلب #10025',
      time: 'منذ 3 ساعات',
      read: true,
      link: '/dashboard/orders'
    },
    {
      id: '4',
      type: 'alert',
      title: 'تحديث النظام',
      description: 'تم تحديث النظام للإصدار الجديد',
      time: 'منذ يوم',
      read: true
    }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  const getIconForType = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'inventory':
        return <Package className="h-5 w-5 text-amber-500" />;
      case 'payment':
        return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between bg-primary-50 p-3 border-b">
          <h3 className="font-medium">الإشعارات</h3>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              تعيين الكل كمقروء
            </Button>
          )}
        </div>
        <div className="max-h-80 overflow-auto">
          {notifications.length === 0 ? (
            <div className="py-10 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">لا توجد إشعارات</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1, backgroundColor: "rgb(243 244 246)" }}
                  onClick={() => markAsRead(notification.id)}
                  className={`flex items-start gap-3 p-3 cursor-pointer ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <div className="mt-1">
                    {getIconForType(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{notification.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <div className="p-2 border-t text-center">
          <Button variant="link" size="sm" className="text-xs" asChild>
            <a href="/dashboard/notifications">عرض كل الإشعارات</a>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
