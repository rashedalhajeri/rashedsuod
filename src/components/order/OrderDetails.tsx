import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ar } from 'date-fns/locale';
import { ShoppingBag, Truck, CreditCard, Package, CheckCheck, X } from 'lucide-react';

// Define the order status types for TypeScript
type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';

interface OrderDetailsProps {
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

const formatCurrency = (amount: number, currencySymbol: string = "ر.س") => {
  return `${amount.toFixed(2)} ${currencySymbol}`;
};

export function OrderDetails({
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
}: OrderDetailsProps) {
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
    <div className="space-y-4">
      <div className="flex items-center space-x-4 space-x-reverse">
        <StatusIcon className={`h-6 w-6 ${statusColors[status]}`} />
        <h3 className="text-lg font-semibold">الطلب رقم: {orderId}</h3>
        <Badge variant="outline" className={`border ${statusColors[status]}`}>
          {statusTranslations[status]}
        </Badge>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold">معلومات العميل</h4>
          <p>الاسم: {customer.name}</p>
          <p>البريد الإلكتروني: {customer.email}</p>
          <p>رقم الهاتف: {customer.phone}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">عنوان الشحن</h4>
          <p>{shippingAddress.address}</p>
          <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
          <p>{shippingAddress.country}</p>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold">تفاصيل الطلب</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>الإجمالي</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{formatCurrency(item.price, currencySymbol)}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{formatCurrency(item.price * item.quantity, currencySymbol)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-semibold">معلومات الدفع</h4>
          <p>طريقة الدفع: {paymentMethod}</p>
          <p>تاريخ الطلب: {formattedDate()}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">ملخص الفاتورة</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>المجموع:</span>
              <span>{formatCurrency(total, currencySymbol)}</span>
            </div>
            <div className="flex justify-between">
              <span>تكلفة الشحن:</span>
              <span>{formatCurrency(shippingCost, currencySymbol)}</span>
            </div>
            <div className="flex justify-between">
              <span>الضريبة:</span>
              <span>{formatCurrency(tax, currencySymbol)}</span>
            </div>
            <div className="flex justify-between">
              <span>الخصم:</span>
              <span>{formatCurrency(discount, currencySymbol)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>الإجمالي:</span>
              <span>{formatCurrency(total + shippingCost + tax - discount, currencySymbol)}</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold">ملاحظات</h4>
        <p>{notes || "لا توجد ملاحظات"}</p>
      </div>

      {trackingNumber && estimatedDelivery && (
        <>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold">معلومات الشحن</h4>
              <p>رقم التتبع: {trackingNumber}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold">تاريخ التسليم المتوقع</h4>
              <p>{estimatedDelivery}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Dummy Table Components
const Table = ({ children }: { children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full">{children}</table>
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead>
    <TableRow>{children}</TableRow>
  </thead>
);

const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody>{children}</tbody>
);

const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="border-b border-gray-200">{children}</tr>
);

const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th className="py-2 px-4 text-left font-semibold text-gray-700">{children}</th>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="py-2 px-4 text-gray-600">{children}</td>
);
