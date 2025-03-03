import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { Avatar } from "@/components/ui/avatar";
import { TimelineItem } from "./TimelineItem";
import { 
  CircleDollarSign, 
  Truck, 
  Package, 
  ClipboardCheck, 
  UserRound, 
  MapPin, 
  Phone, 
  Mail, 
  CalendarClock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowUpDown, 
  FileText, 
  Copy, 
  Printer, 
  MoreHorizontal, 
  Clock, 
  Send 
} from "lucide-react";
import { Save } from "lucide-react";

type OrderDetailsProps = {
  orderId: string;
  onClose: () => void;
};

const mockOrder = {
  id: "ORDER-12345",
  customer: "أحمد محمد",
  customerEmail: "ahmed.mohamed@example.com",
  customerPhone: "0555555555",
  shippingAddress: "الرياض، المملكة العربية السعودية",
  billingAddress: "الرياض، المملكة العربية السعودية",
  status: "processing",
  date: "2024-07-15T12:00:00.000Z",
  total: 540,
  paymentMethod: "Apple Pay",
  shippingMethod: "DHL",
  trackingNumber: "1234567890",
  notes: "يرجى التعامل مع هذا الطلب بعناية",
  items: [
    { id: "PROD-001", name: "تيشيرت أبيض", quantity: 2, price: 90 },
    { id: "PROD-002", name: "بنطلون جينز", quantity: 1, price: 180 },
    { id: "PROD-003", name: "حذاء رياضي", quantity: 1, price: 180 },
  ],
  timeline: [
    {
      id: "TIMELINE-001",
      status: "pending",
      date: "2024-07-15T12:00:00.000Z",
      description: "تم إنشاء الطلب",
    },
    {
      id: "TIMELINE-002",
      status: "processing",
      date: "2024-07-16T09:00:00.000Z",
      description: "تم تأكيد الطلب وجاري تجهيزه",
    },
    {
      id: "TIMELINE-003",
      status: "shipped",
      date: "2024-07-17T14:00:00.000Z",
      description: "تم شحن الطلب",
    },
  ],
};

const statusOptions = [
  { value: "pending", label: "قيد الانتظار" },
  { value: "processing", label: "قيد المعالجة" },
  { value: "shipped", label: "تم الشحن" },
  { value: "delivered", label: "تم التسليم" },
  { value: "cancelled", label: "ملغي" },
  { value: "refunded", label: "مسترجع" },
];

const OrderDetails = ({ orderId, onClose }: OrderDetailsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-full flex-col gap-4 p-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">
          تفاصيل الطلب: {orderId}
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            تعديل
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            إنشاء فاتورة
          </Button>
          <Button variant="outline" size="sm">
            <Copy className="mr-2 h-4 w-4" />
            نسخ
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            طباعة
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="overflow-hidden">
        <Tabs defaultValue="overview" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="timeline">الجدول الزمني</TabsTrigger>
            <TabsTrigger value="notes">ملاحظات</TabsTrigger>
            <TabsTrigger value="invoice">الفاتورة</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    معلومات العميل
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-muted-foreground" />
                    <span>{mockOrder.customer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`mailto:${mockOrder.customerEmail}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {mockOrder.customerEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={`tel:${mockOrder.customerPhone}`}
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {mockOrder.customerPhone}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    معلومات الشحن
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{mockOrder.shippingAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{mockOrder.shippingMethod}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{mockOrder.trackingNumber}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    معلومات الدفع
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{mockOrder.paymentMethod}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(mockOrder.date).toLocaleDateString("ar-SA", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    <span>
                      المجموع: {mockOrder.total} ر.س
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  حالة الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {
                      statusOptions.find(
                        (option) => option.value === mockOrder.status
                      )?.label
                    }
                  </Badge>
                  <UpdateStatusDialog orderId={orderId} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  عناصر الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-right font-medium">المنتج</th>
                        <th className="p-2 text-right font-medium">الكمية</th>
                        <th className="p-2 text-right font-medium">السعر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrder.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="p-2">{item.name}</td>
                          <td className="p-2">{item.quantity}</td>
                          <td className="p-2">{item.price} ر.س</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  الجدول الزمني للطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[450px] w-full">
                  <div className="relative">
                    <div className="absolute left-4 top-0 h-full w-0.5 bg-border" />
                    {mockOrder.timeline.map((item, index) => (
                      <TimelineItem 
                        key={item.id} 
                        title={item.status}
                        date={new Date(item.date)}
                        description={item.description}
                        icon={getStatusIcon(item.status)}
                        isLast={index === mockOrder.timeline.length - 1} 
                      />
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  ملاحظات الطلب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {mockOrder.notes}
                </p>
                <OrderNoteDialog orderId={orderId} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="invoice">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  معاينة الفاتورة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>
                    سيتم إضافة معاينة الفاتورة هنا قريبًا.
                  </p>
                </div>
                <PrintInvoiceDialog />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-end gap-2">
        <CancelOrderDialog orderId={orderId} />
        <RefundOrderDialog orderId={orderId} />
        <Button onClick={onClose}>إغلاق</Button>
      </CardFooter>
    </div>
  );
};

function getStatusIcon(status: string) {
  switch (status) {
    case "pending":
      return Clock;
    case "processing":
      return AlertCircle;
    case "shipped":
      return Truck;
    case "delivered":
      return CheckCircle2;
    case "cancelled":
      return XCircle;
    case "refunded":
      return CircleDollarSign;
    default:
      return Package;
  }
}

export function OrderNoteDialog({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");

  const handleSaveNote = () => {
    toast({
      title: "تم حفظ الملاحظة",
      description: "تم حفظ ملاحظة الطلب بنجاح",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">
          <Clock className="mr-2 h-4 w-4" />
          تعديل الملاحظة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تعديل ملاحظة الطلب</DialogTitle>
          <DialogDescription>
            أضف ملاحظة إضافية لهذا الطلب
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="note" className="text-right">
              الملاحظة
            </Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSaveNote}>
            <Save className="mr-2 h-4 w-4" />
            حفظ
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function PrintInvoiceDialog() {
  const [open, setOpen] = useState(false);

  const handlePrintInvoice = () => {
    toast({
      title: "طباعة الفاتورة",
      description: "جاري طباعة الفاتورة",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">
          <Printer className="mr-2 h-4 w-4" />
          طباعة الفاتورة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>طباعة الفاتورة</DialogTitle>
          <DialogDescription>
            هل أنت متأكد أنك تريد طباعة الفاتورة؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={handlePrintInvoice}>
            طباعة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CancelOrderDialog({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);

  const handleCancelOrder = () => {
    toast({
      title: "تم إلغاء الطلب",
      description: "تم إلغاء الطلب بنجاح",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <XCircle className="mr-2 h-4 w-4" />
          إلغاء الطلب
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>إلغاء الطلب</DialogTitle>
          <DialogDescription>
            هل أنت متأكد أنك تريد إلغاء هذا الطلب؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={handleCancelOrder}>
            إلغاء
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function RefundOrderDialog({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);

  const handleRefundOrder = () => {
    toast({
      title: "تم استرجاع المبلغ",
      description: "تم استرجاع المبلغ للعميل بنجاح",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CircleDollarSign className="mr-2 h-4 w-4" />
          استرجاع المبلغ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>استرجاع المبلغ</DialogTitle>
          <DialogDescription>
            هل أنت متأكد أنك تريد استرجاع المبلغ لهذا الطلب؟
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" onClick={handleRefundOrder}>
            استرجاع
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function UpdateStatusDialog({ orderId }: { orderId: string }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(mockOrder.status);

  const handleUpdateStatus = () => {
    toast({
      title: "تم تحديث الحالة",
      description: "تم تحديث حالة الطلب بنجاح",
    });
    mockOrder.status = status;
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <AlertCircle className="mr-2 h-4 w-4" />
          تحديث الحالة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>تحديث حالة الطلب</DialogTitle>
          <DialogDescription>
            اختر الحالة الجديدة لهذا الطلب
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              الحالة
            </Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleUpdateStatus}>
            <Send className="mr-2 h-4 w-4" />
            تحديث
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetails;
