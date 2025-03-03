import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ar } from 'date-fns/locale';
import { ShoppingBag, Truck, CreditCard, Package, CheckCheck, X } from 'lucide-react';

// Define the order status types for TypeScript
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface OrderDetailsModalProps {
  orderId: string;
  orderDate: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    options?: string[];
  }>;
  paymentMethod: string;
  status: OrderStatus;
  total: number;
  shippingCost: number;
  tax: number;
  discount: number;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  currencySymbol?: string;
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
  refunded: "bg-pink-100 text-pink-800 border-pink-200"
};

const statusIcons: Record<OrderStatus, React.ComponentType> = {
  pending: ShoppingBag as React.ComponentType,
  processing: Package as React.ComponentType,
  shipped: Truck as React.ComponentType,
  delivered: CheckCheck as React.ComponentType,
  cancelled: X as React.ComponentType,
  refunded: CreditCard as React.ComponentType
};

const statusTranslations: Record<OrderStatus, string> = {
  pending: "قيد الانتظار",
  processing: "قيد المعالجة",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
  refunded: "مسترجع"
};

const renderOrderItem = (item: {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: string[];
}, currencySymbol: string = "ر.س") => (
  <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
    <div className="flex items-center">
      {item.image && (
        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded mr-4" />
      )}
      <div>
        <h6 className="font-semibold">{item.name}</h6>
        {item.options && item.options.length > 0 && (
          <p className="text-sm text-muted-foreground">{item.options.join(', ')}</p>
        )}
      </div>
    </div>
    <div className="text-right">
      <p>{item.quantity} x {formatCurrency(item.price, currencySymbol)}</p>
      <p className="font-semibold">{formatCurrency(item.price * item.quantity, currencySymbol)}</p>
    </div>
  </div>
);

const formatCurrency = (amount: number, currencySymbol: string = "ر.س") => {
  return `${amount.toFixed(2)} ${currencySymbol}`;
};

export function OrderDetailsModal({
  orderId,
  orderDate,
  customer,
  shippingAddress,
  items,
  paymentMethod,
  status,
  total,
  shippingCost,
  tax,
  discount,
  notes,
  trackingNumber,
  estimatedDelivery,
  currencySymbol = "ر.س"
}: OrderDetailsModalProps) {
  const formattedDate = () => {
    try {
      // Parse the string date to a Date object
      const date = new Date(orderDate);
      return format(date, "d MMMM yyyy", { locale: ar });
    } catch (error) {
      console.error("Error formatting date:", error);
      return orderDate; // Return the original date string if there's an error
    }
  };
  
  const StatusIcon = statusIcons[status] || ShoppingBag;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-primary-100 hover:text-primary-700 transition-colors">
          <ShoppingBag className="h-4 w-4" />
          عرض التفاصيل
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>تفاصيل الطلب: {orderId}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">معلومات الطلب</h4>
            <div className="space-y-2">
              <p><strong>تاريخ الطلب:</strong> {formattedDate()}</p>
              <p><strong>الحالة:</strong>
                <Badge variant="outline" className={`mr-2 border ${statusColors[status]}`}>
                  <StatusIcon className="h-4 w-4 mr-1" />
                  {statusTranslations[status]}
                </Badge>
              </p>
              <p><strong>رقم التتبع:</strong> {trackingNumber || 'لا يوجد'}</p>
              <p><strong>تاريخ التسليم المتوقع:</strong> {estimatedDelivery || 'غير محدد'}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">معلومات العميل</h4>
            <div className="space-y-2">
              <p><strong>اسم العميل:</strong> {customer.name}</p>
              <p><strong>البريد الإلكتروني:</strong> {customer.email}</p>
              <p><strong>رقم الهاتف:</strong> {customer.phone}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h4 className="text-lg font-semibold mb-4">عنوان الشحن</h4>
            <div className="space-y-2">
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">معلومات الدفع</h4>
            <div className="space-y-2">
              <p><strong>طريقة الدفع:</strong> {paymentMethod}</p>
              <p><strong>المجموع الفرعي:</strong> {formatCurrency(total - shippingCost - tax + discount, currencySymbol)}</p>
              <p><strong>تكلفة الشحن:</strong> {formatCurrency(shippingCost, currencySymbol)}</p>
              <p><strong>الضريبة:</strong> {formatCurrency(tax, currencySymbol)}</p>
              <p><strong>الخصم:</strong> {formatCurrency(discount, currencySymbol)}</p>
              <Separator />
              <p className="font-semibold text-lg">
                <strong>المجموع الكلي:</strong> {formatCurrency(total, currencySymbol)}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-4">المنتجات</h4>
          <div className="space-y-4">
            {items.map(item => renderOrderItem(item, currencySymbol))}
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">ملاحظات</h4>
            <p>{notes}</p>
          </div>
        )}

        <DialogClose asChild>
          <Button variant="secondary">إغلاق</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
