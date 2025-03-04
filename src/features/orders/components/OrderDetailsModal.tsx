
import React from "react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Box, TruckIcon, CheckCircle2, XCircle 
} from "lucide-react";
import { Order, OrderStatus } from "@/types/orders";
import { getCurrencyFormatter } from "@/hooks/use-store-data";
import OrderStatusBadge from "./OrderStatusBadge";

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
  
  // تنسيق تاريخ الطلب
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>تفاصيل الطلب #{order.order_number}</DialogTitle>
          <DialogDescription>
            تفاصيل الطلب وحالته ومنتجاته
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          {/* معلومات الطلب */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">رقم الطلب</h4>
              <p>#{order.order_number}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">تاريخ الطلب</h4>
              <p>{formatDate(order.created_at)}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">العميل</h4>
              <p>{order.customer_name}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">الحالة</h4>
              <OrderStatusBadge status={order.status} />
            </div>
            
            {order.customer_email && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">البريد الإلكتروني</h4>
                <p>{order.customer_email}</p>
              </div>
            )}
            
            {order.customer_phone && (
              <div>
                <h4 className="text-sm font-medium text-gray-500">رقم الهاتف</h4>
                <p>{order.customer_phone}</p>
              </div>
            )}
            
            <div className="col-span-2">
              <h4 className="text-sm font-medium text-gray-500">طريقة الدفع</h4>
              <p>{order.payment_method}</p>
            </div>
            
            <div className="col-span-2">
              <h4 className="text-sm font-medium text-gray-500">عنوان الشحن</h4>
              <p>{order.shipping_address}</p>
            </div>
            
            {order.notes && (
              <div className="col-span-2">
                <h4 className="text-sm font-medium text-gray-500">ملاحظات</h4>
                <p>{order.notes}</p>
              </div>
            )}
          </div>
          
          {/* منتجات الطلب */}
          <div>
            <h4 className="text-base font-medium mb-2">المنتجات</h4>
            <div className="border rounded-md">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, index) => (
                  <div key={index} className="flex justify-between p-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium">{item.product_name}</p>
                      <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.unit_price)}</p>
                      <p className="text-sm text-gray-500">
                        الإجمالي: {formatCurrency(item.total_price)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500">
                  لا توجد تفاصيل للمنتجات
                </div>
              )}
              
              <div className="flex justify-between p-3 bg-gray-50 font-medium">
                <p>المجموع</p>
                <p>{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>
          
          {/* أزرار تغيير الحالة */}
          <div>
            <h4 className="text-base font-medium mb-2">تحديث الحالة</h4>
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
                onClick={() => handleStatusChange("processing")}
              >
                <Box className="h-4 w-4 ml-2" />
                قيد المعالجة
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                onClick={() => handleStatusChange("shipped")}
              >
                <TruckIcon className="h-4 w-4 ml-2" />
                تم الشحن
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={() => handleStatusChange("delivered")}
              >
                <CheckCircle2 className="h-4 w-4 ml-2" />
                تم التوصيل
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleStatusChange("cancelled")}
              >
                <XCircle className="h-4 w-4 ml-2" />
                ملغي
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إغلاق
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
