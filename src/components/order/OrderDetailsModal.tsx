import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Truck, XCircle, CheckCircle, Clock } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { TimelineItem } from "./TimelineItem";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string | null;
  orders: any[];
  currencySymbol: string;
}

const statusIcons = {
  completed: <CheckCircle className="h-4 w-4 text-green-500" />,
  processing: <Clock className="h-4 w-4 text-blue-500" />,
  shipped: <Truck className="h-4 w-4 text-purple-500" />,
  cancelled: <XCircle className="h-4 w-4 text-red-500" />,
};

const statusColors = {
  completed: "bg-green-100 text-green-800 border-green-200",
  processing: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const statusTranslations = {
  completed: "مكتمل",
  processing: "قيد المعالجة",
  shipped: "تم الشحن",
  cancelled: "ملغي",
};

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  orderId,
  orders,
  currencySymbol
}) => {
  const order = orders.find(o => o.id === orderId);
  
  if (!order) return null;
  
  const orderItems = [
    { id: 1, name: "قميص قطني", quantity: 2, price: 45.50, total: 91.00 },
    { id: 2, name: "بنطلون جينز", quantity: 1, price: 120.99, total: 120.99 },
    { id: 3, name: "حذاء رياضي", quantity: 1, price: 34.00, total: 34.00 },
  ];
  
  const timelineEvents = [
    { 
      id: 1, 
      date: new Date("2023-06-15T09:00:00"), 
      title: "تم استلام الطلب", 
      description: "تم استلام طلبك بنجاح وسيتم معالجته قريبًا.", 
      icon: <Package className="h-5 w-5" /> 
    },
    { 
      id: 2, 
      date: new Date("2023-06-15T10:30:00"), 
      title: "جاري تجهيز الطلب", 
      description: "يتم الآن تجهيز طلبك وإعداده للشحن.", 
      icon: <Clock className="h-5 w-5" /> 
    },
    { 
      id: 3, 
      date: new Date("2023-06-15T14:45:00"), 
      title: "تم شحن الطلب", 
      description: "تم شحن طلبك وهو في طريقه إليك.", 
      icon: <Truck className="h-5 w-5" /> 
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            تفاصيل الطلب {order.id}
            <Badge 
              variant="outline" 
              className={`${statusColors[order.status as keyof typeof statusColors]} mr-2 font-normal text-xs`}
            >
              {statusIcons[order.status as keyof typeof statusIcons]}
              <span className="mr-1">{statusTranslations[order.status as keyof typeof statusTranslations]}</span>
            </Badge>
          </DialogTitle>
          <DialogDescription>
            تاريخ الطلب: {format(order.date, "d MMMM yyyy", { locale: ar })}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2 text-gray-700">معلومات العميل</h3>
            <p className="text-gray-600 mb-1">الاسم: {order.customer}</p>
            <p className="text-gray-600 mb-1">البريد الإلكتروني: customer@example.com</p>
            <p className="text-gray-600">رقم الهاتف: +965 555 1234</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-semibold mb-2 text-gray-700">معلومات الدفع</h3>
            <p className="text-gray-600 mb-1">طريقة الدفع: {order.paymentMethod}</p>
            <p className="text-gray-600 mb-1">حالة الدفع: مدفوع</p>
            <p className="text-gray-600">المبلغ الإجمالي: {order.total.toFixed(2)} {currencySymbol}</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-gray-700">المنتجات</h3>
          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead className="text-center">الكمية</TableHead>
                  <TableHead className="text-center">السعر</TableHead>
                  <TableHead className="text-center">المجموع</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">{item.price.toFixed(2)} {currencySymbol}</TableCell>
                    <TableCell className="text-center">{item.total.toFixed(2)} {currencySymbol}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-gray-50">
                  <TableCell colSpan={3} className="text-left font-semibold">المجموع</TableCell>
                  <TableCell className="text-center font-bold">{order.total.toFixed(2)} {currencySymbol}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-gray-700">سجل الطلب</h3>
          <div className="border rounded-md p-4 bg-gray-50">
            {timelineEvents.map((event) => (
              <TimelineItem 
                key={event.id}
                date={event.date}
                title={event.title}
                description={event.description}
                icon={event.icon}
                isLast={event.id === timelineEvents.length}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-200 hover:bg-gray-50"
          >
            إغلاق
          </Button>
          <Button 
            className="bg-primary-500 hover:bg-primary-600"
          >
            طباعة الفاتورة
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
