
import React, { useState } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { 
  CheckCircle2, AlertCircle, Printer, Download, MapPin, Phone, 
  Mail, CreditCard, Clock, Package, TruckIcon, Calendar, User,
  ChevronDown, ChevronUp, Edit, Copy, ExternalLink, 
  CheckCircle, XCircle, Send
} from "lucide-react";
import { 
  Card, CardContent, CardDescription, CardFooter, 
  CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Order } from "@/pages/Orders";
import { TimelineItem } from "@/components/order/TimelineItem";

interface OrderDetailsProps {
  order: Order;
  formatCurrency: (amount: number) => string;
}

export function OrderDetails({ order, formatCurrency }: OrderDetailsProps) {
  const [showAllItems, setShowAllItems] = useState(false);
  const [note, setNote] = useState("");
  
  // Get status info and actions based on order status
  const getStatusInfo = (status: Order["status"]) => {
    const statusInfo = {
      pending: {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: AlertCircle,
        label: "طلب جديد",
        description: "تم إنشاء الطلب ولكن لم تتم معالجته بعد",
        actions: ["process", "cancel"]
      },
      processing: {
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: Clock,
        label: "قيد المعالجة",
        description: "يتم تجهيز الطلب حالياً",
        actions: ["ship", "cancel"]
      },
      shipped: {
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200",
        icon: TruckIcon,
        label: "تم الشحن",
        description: "تم إرسال الطلب للتوصيل",
        actions: ["deliver", "return"]
      },
      delivered: {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: CheckCircle2,
        label: "تم التسليم",
        description: "تم توصيل الطلب بنجاح",
        actions: ["return"]
      },
      cancelled: {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: XCircle,
        label: "ملغي",
        description: "تم إلغاء الطلب",
        actions: ["reactivate"]
      },
      returned: {
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        icon: Package,
        label: "مرتجع",
        description: "تم إرجاع الطلب",
        actions: ["reactivate"]
      }
    };

    return statusInfo[status];
  };

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  // Generate mock timeline based on order status
  const getOrderTimeline = (order: Order) => {
    const timeline = [];
    const orderDate = new Date(order.date);
    
    // Order created
    timeline.push({
      date: orderDate,
      title: "تم استلام الطلب",
      description: "تم إنشاء الطلب وإرسال تأكيد للعميل",
      icon: Package
    });
    
    // Processing
    if (["processing", "shipped", "delivered"].includes(order.status)) {
      const processingDate = new Date(orderDate);
      processingDate.setHours(processingDate.getHours() + 2);
      timeline.push({
        date: processingDate,
        title: "قيد المعالجة",
        description: "تم بدء تجهيز الطلب",
        icon: Clock
      });
    }
    
    // Shipped
    if (["shipped", "delivered"].includes(order.status)) {
      const shippedDate = new Date(orderDate);
      shippedDate.setHours(shippedDate.getHours() + 24);
      timeline.push({
        date: shippedDate,
        title: "تم الشحن",
        description: order.tracking_number ? `تم شحن الطلب برقم تتبع ${order.tracking_number}` : "تم شحن الطلب",
        icon: TruckIcon
      });
    }
    
    // Delivered
    if (order.status === "delivered") {
      const deliveredDate = new Date(orderDate);
      deliveredDate.setHours(deliveredDate.getHours() + 72);
      timeline.push({
        date: deliveredDate,
        title: "تم التسليم",
        description: "تم توصيل الطلب بنجاح",
        icon: CheckCircle2
      });
    }
    
    // Cancelled
    if (order.status === "cancelled") {
      const cancelledDate = new Date(orderDate);
      cancelledDate.setHours(cancelledDate.getHours() + 4);
      timeline.push({
        date: cancelledDate,
        title: "تم الإلغاء",
        description: "تم إلغاء الطلب",
        icon: XCircle
      });
    }
    
    // Returned
    if (order.status === "returned") {
      const returnDate = new Date(orderDate);
      returnDate.setDate(returnDate.getDate() + 5);
      timeline.push({
        date: returnDate,
        title: "تم الإرجاع",
        description: "تم إرجاع الطلب",
        icon: Package
      });
    }
    
    return timeline.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const timeline = getOrderTimeline(order);

  // Action buttons based on order status
  const renderActionButtons = () => {
    const actions = {
      process: <Button size="sm" className="gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>بدء المعالجة</span>
              </Button>,
      ship: <Button size="sm" className="gap-1">
              <TruckIcon className="h-3.5 w-3.5" />
              <span>شحن الطلب</span>
            </Button>,
      deliver: <Button size="sm" className="gap-1">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>تأكيد التسليم</span>
              </Button>,
      cancel: <Button size="sm" variant="outline" className="text-red-600 gap-1">
                <XCircle className="h-3.5 w-3.5" />
                <span>إلغاء الطلب</span>
              </Button>,
      return: <Button size="sm" variant="outline" className="gap-1">
                <Package className="h-3.5 w-3.5" />
                <span>إرجاع الطلب</span>
              </Button>,
      reactivate: <Button size="sm" className="gap-1">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>إعادة تفعيل</span>
                  </Button>
    };

    return (
      <div className="flex flex-wrap gap-2">
        {statusInfo.actions.map(action => (
          <div key={action}>{actions[action]}</div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className={cn(
          "pb-3",
          statusInfo.bgColor,
          statusInfo.borderColor,
          "border-b"
        )}>
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <span>طلب #{order.order_number}</span>
              </CardTitle>
              <CardDescription>
                {format(new Date(order.date), "d MMMM yyyy, HH:mm", { locale: ar })}
              </CardDescription>
            </div>
            <div className="flex items-center">
              <StatusIcon className={cn("h-5 w-5 mr-1", statusInfo.color)} />
              <span className={cn("font-medium", statusInfo.color)}>
                {statusInfo.label}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">العميل</h4>
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  <div className="text-sm text-muted-foreground space-y-1 mt-1">
                    {order.customer_phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{order.customer_phone}</span>
                      </div>
                    )}
                    {order.customer_email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        <span>{order.customer_email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {order.shipping_address && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">عنوان التوصيل</h4>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <p className="text-sm">{order.shipping_address}</p>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">الدفع</h4>
              <div className="flex items-start gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{order.payment_method}</p>
                  <p className="text-sm text-muted-foreground">المبلغ: {formatCurrency(order.total)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <h4 className="font-medium mb-3">المنتجات</h4>
          <div className="space-y-3">
            {(showAllItems ? order.items : order.items.slice(0, 2)).map((item, index) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="h-12 w-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.product_image ? (
                    <img src={item.product_image} alt={item.product_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                      <Package className="h-6 w-6" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                    <p className="font-medium truncate">{item.product_name}</p>
                    <p className="font-medium whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="truncate">
                      {item.quantity} × {formatCurrency(item.price)}
                      {item.variant && <span className="mr-1">({item.variant})</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {order.items.length > 2 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-primary-600"
                onClick={() => setShowAllItems(!showAllItems)}
              >
                {showAllItems ? (
                  <span className="flex items-center">
                    <ChevronUp className="h-4 w-4 ml-1" />
                    عرض أقل
                  </span>
                ) : (
                  <span className="flex items-center">
                    <ChevronDown className="h-4 w-4 ml-1" />
                    عرض كل المنتجات ({order.items.length})
                  </span>
                )}
              </Button>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>المجموع الفرعي</span>
              <span>{formatCurrency(order.total * 0.9)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>الضريبة (10%)</span>
              <span>{formatCurrency(order.total * 0.1)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>التوصيل</span>
              <span>مجاناً</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-medium">
              <span>الإجمالي</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4 pb-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Printer className="h-4 w-4" />
              <span>طباعة</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>تصدير</span>
            </Button>
          </div>
          {renderActionButtons()}
        </CardFooter>
      </Card>

      <Tabs defaultValue="timeline">
        <TabsList className="w-full">
          <TabsTrigger value="timeline" className="flex-1">المسار الزمني</TabsTrigger>
          <TabsTrigger value="notes" className="flex-1">الملاحظات</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">الإعدادات</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>المسار الزمني للطلب</CardTitle>
              <CardDescription>تتبع تقدم حالة الطلب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((item, index) => (
                  <TimelineItem 
                    key={index}
                    title={item.title}
                    date={item.date}
                    description={item.description}
                    icon={item.icon}
                    isLast={index === timeline.length - 1}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notes" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>ملاحظات الطلب</CardTitle>
              <CardDescription>إضافة ملاحظات خاصة بالطلب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.notes && (
                  <div className="p-3 border rounded-md bg-muted/50">
                    <h4 className="text-sm font-medium mb-1">ملاحظات العميل</h4>
                    <p className="text-sm">{order.notes}</p>
                  </div>
                )}
                <div>
                  <Textarea 
                    value={note} 
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="إضافة ملاحظة حول الطلب..."
                    className="mb-2"
                  />
                  <Button size="sm" className="gap-1">
                    <Send className="h-3.5 w-3.5" />
                    <span>إضافة ملاحظة</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>إعدادات الطلب</CardTitle>
              <CardDescription>تعديل إعدادات متقدمة للطلب</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">رقم التتبع</h4>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <input 
                        type="text" 
                        className="w-full rounded-md border px-3 py-2 text-sm" 
                        placeholder="أدخل رقم التتبع"
                        defaultValue={order.tracking_number || ""}
                      />
                    </div>
                    <Button variant="outline" size="sm">تحديث</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">معلومات الشحن</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <select className="w-full rounded-md border px-3 py-2 text-sm">
                        <option value="">اختر شركة الشحن</option>
                        <option value="dhl">DHL</option>
                        <option value="aramex">Aramex</option>
                        <option value="fedex">FedEx</option>
                      </select>
                    </div>
                    <div>
                      <select className="w-full rounded-md border px-3 py-2 text-sm">
                        <option value="">طريقة الشحن</option>
                        <option value="standard">قياسي</option>
                        <option value="express">سريع</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <Button className="gap-1">
                <Save className="h-4 w-4" />
                <span>حفظ التغييرات</span>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
