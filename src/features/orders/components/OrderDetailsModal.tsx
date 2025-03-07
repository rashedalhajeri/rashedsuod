import React from "react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Box, CheckCircle2, XCircle, CalendarIcon, User, Mail, Phone, MapPin, CreditCard, FileText,
  ShoppingBag, RefreshCw, Check, History
} from "lucide-react";
import { Order, OrderStatus } from "@/types/orders";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import OrderStatusBadge from "./OrderStatusBadge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import "@/styles/rtl-helpers.css"; // Fixed import path with @ alias

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateStatus
}) => {
  const formatCurrency = getCurrencyFormatter();
  
  if (!order) return null;
  
  const handleStatusChange = (status: OrderStatus) => {
    onUpdateStatus(order.id, status);
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy h:mm a', { locale: enUS });
    } catch (error) {
      return dateString;
    }
  };

  const calculateOrderTotal = () => {
    if (order.items && order.items.length > 0) {
      return order.items.reduce((total, item) => total + item.total_price, 0);
    }
    return order.total;
  };
  
  const infoItems = [
    {
      label: "رقم الطلب",
      value: `#${order.order_number}`,
      icon: <FileText className="h-4 w-4 text-gray-500" />
    },
    {
      label: "تاريخ الطلب",
      value: formatDate(order.created_at),
      icon: <CalendarIcon className="h-4 w-4 text-gray-500" />
    },
    {
      label: "العميل",
      value: order.customer_name,
      icon: <User className="h-4 w-4 text-gray-500" />
    },
    {
      label: "البريد الإلكتروني",
      value: order.customer_email || "غير متوفر",
      icon: <Mail className="h-4 w-4 text-gray-500" />
    },
    {
      label: "رقم الهاتف",
      value: order.customer_phone || "غير متوفر",
      icon: <Phone className="h-4 w-4 text-gray-500" />
    },
    {
      label: "طريقة الدفع",
      value: order.payment_method,
      icon: <CreditCard className="h-4 w-4 text-gray-500" />
    },
    {
      label: "عنوان الشحن",
      value: order.shipping_address,
      icon: <MapPin className="h-4 w-4 text-gray-500" />
    }
  ];

  const statusButtons = [
    {
      status: "processing" as OrderStatus,
      label: "قيد المعالجة",
      icon: <Box className="h-4 w-4 ml-2" />,
      className: "text-blue-600 border-blue-200 hover:bg-blue-50"
    },
    {
      status: "delivered" as OrderStatus,
      label: "تم التوصيل",
      icon: <CheckCircle2 className="h-4 w-4 ml-2" />,
      className: "text-green-600 border-green-200 hover:bg-green-50"
    },
    {
      status: "cancelled" as OrderStatus,
      label: "ملغي",
      icon: <XCircle className="h-4 w-4 ml-2" />,
      className: "text-red-600 border-red-200 hover:bg-red-50"
    }
  ];
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span>تفاصيل الطلب #{order.order_number}</span>
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
          <DialogDescription>
            عرض كافة تفاصيل الطلب والمنتجات المطلوبة
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h3 className="font-medium mb-3 text-gray-700 flex items-center gap-2">
              <User className="h-4 w-4" />
              معلومات الطلب
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              {infoItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  {item.icon}
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium force-en-nums">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {order.notes && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">ملاحظات</p>
                <p className="text-sm mt-1 bg-white p-2 rounded border border-gray-200">{order.notes}</p>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-gray-700 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              المنتجات
            </h3>
            
            <div className="border rounded-md overflow-hidden">
              {order.items && order.items.length > 0 ? (
                <>
                  <div className="grid grid-cols-12 bg-gray-50 py-2 px-3 text-xs font-medium text-gray-500 border-b">
                    <div className="col-span-6">المنتج</div>
                    <div className="col-span-2 text-center">السعر</div>
                    <div className="col-span-2 text-center">الكمية</div>
                    <div className="col-span-2 text-center">الإجمالي</div>
                  </div>
                  
                  {order.items.map((item, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="grid grid-cols-12 py-3 px-3 border-b last:border-b-0 items-center"
                    >
                      <div className="col-span-6 font-medium">{item.product_name}</div>
                      <div className="col-span-2 text-center force-en-nums">{formatCurrency(item.unit_price)}</div>
                      <div className="col-span-2 text-center force-en-nums">{item.quantity}</div>
                      <div className="col-span-2 text-center font-medium force-en-nums">{formatCurrency(item.total_price)}</div>
                    </motion.div>
                  ))}
                  
                  <div className="flex justify-between p-3 bg-gray-50 font-medium border-t">
                    <p>المجموع</p>
                    <p className="force-en-nums">{formatCurrency(calculateOrderTotal())}</p>
                  </div>
                </>
              ) : (
                <div className="p-3 text-center text-gray-500">
                  لا توجد تفاصيل للمنتجات
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3 text-gray-700 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              تحديث الحالة
            </h3>
            
            <div className="flex flex-wrap gap-2">
              {statusButtons.map((btn) => (
                <Button 
                  key={btn.status}
                  size="sm" 
                  variant="outline" 
                  className={cn(
                    btn.className,
                    order.status === btn.status && "ring-2 ring-offset-1",
                    order.status === btn.status && btn.status === "processing" && "ring-blue-400",
                    order.status === btn.status && btn.status === "delivered" && "ring-green-400",
                    order.status === btn.status && btn.status === "cancelled" && "ring-red-400"
                  )}
                  onClick={() => handleStatusChange(btn.status)}
                  disabled={order.status === btn.status}
                >
                  {btn.icon}
                  {btn.label}
                  {order.status === btn.status && (
                    <span className="mr-1 bg-white/80 px-1 py-0.5 rounded-sm text-[10px]">الحالة الحالية</span>
                  )}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-3 text-gray-700 flex items-center gap-2">
              <History className="h-4 w-4" />
              تاريخ الطلب
            </h3>
            
            <div className="relative">
              <div className="absolute top-0 bottom-0 right-4 w-0.5 bg-gray-200"></div>
              
              <div className="relative pr-10 mb-3">
                <div className="absolute right-1 top-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-3 w-3 text-green-600" />
                </div>
                <div className="bg-gray-50 rounded p-2 mr-2">
                  <p className="text-sm font-medium">تم إنشاء الطلب</p>
                  <p className="text-xs text-gray-500 force-en-nums">{formatDate(order.created_at)}</p>
                </div>
              </div>
              
              {order.status !== "processing" && (
                <div className="relative pr-10 mb-3">
                  <div className="absolute right-1 top-1 w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <Box className="h-3 w-3 text-blue-600" />
                  </div>
                  <div className="bg-gray-50 rounded p-2 mr-2">
                    <p className="text-sm font-medium">قيد المعالجة</p>
                    <p className="text-xs text-gray-500 force-en-nums">{formatDate(order.updated_at)}</p>
                  </div>
                </div>
              )}
              
              {order.status === "delivered" && (
                <div className="relative pr-10 mb-3">
                  <div className="absolute right-1 top-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  </div>
                  <div className="bg-gray-50 rounded p-2 mr-2">
                    <p className="text-sm font-medium">تم التوصيل</p>
                    <p className="text-xs text-gray-500 force-en-nums">{formatDate(order.updated_at)}</p>
                  </div>
                </div>
              )}
              
              {order.status === "cancelled" && (
                <div className="relative pr-10">
                  <div className="absolute right-1 top-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle className="h-3 w-3 text-red-600" />
                  </div>
                  <div className="bg-gray-50 rounded p-2 mr-2">
                    <p className="text-sm font-medium">تم الإلغاء</p>
                    <p className="text-xs text-gray-500 force-en-nums">{formatDate(order.updated_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
          <Button variant="default" asChild>
            <a href={`/dashboard/orders/edit/${order.id}`}>
              تعديل الطلب
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
