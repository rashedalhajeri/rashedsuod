
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, Filter, FileText, ExternalLink, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// نوع البيانات للطلبات
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: Date;
  total: number;
  status: "قيد المعالجة" | "تم الشحن" | "تم التسليم" | "ملغي";
  items: number;
}

// بيانات وهمية للطلبات (سيتم استبدالها بالبيانات الحقيقية)
const dummyOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customerName: "أحمد محمد",
    date: new Date(2023, 5, 15),
    total: 450,
    status: "تم التسليم",
    items: 3,
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customerName: "سارة علي",
    date: new Date(2023, 5, 16),
    total: 200,
    status: "قيد المعالجة",
    items: 2,
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    customerName: "محمد عبدالله",
    date: new Date(2023, 5, 17),
    total: 350,
    status: "تم الشحن",
    items: 1,
  },
  {
    id: "4",
    orderNumber: "ORD-004",
    customerName: "فاطمة خالد",
    date: new Date(2023, 5, 18),
    total: 550,
    status: "ملغي",
    items: 4,
  },
  {
    id: "5",
    orderNumber: "ORD-005",
    customerName: "علي حسن",
    date: new Date(2023, 5, 19),
    total: 780,
    status: "قيد المعالجة",
    items: 3,
  },
  {
    id: "6",
    orderNumber: "ORD-006",
    customerName: "نورة سعد",
    date: new Date(2023, 5, 20),
    total: 320,
    status: "تم التسليم",
    items: 2,
  },
];

// مكون عرض حالة الطلب
const OrderStatusBadge = ({ status }: { status: Order["status"] }) => {
  let colorClass = "";
  switch (status) {
    case "قيد المعالجة":
      colorClass = "bg-blue-100 text-blue-800";
      break;
    case "تم الشحن":
      colorClass = "bg-orange-100 text-orange-800";
      break;
    case "تم التسليم":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "ملغي":
      colorClass = "bg-red-100 text-red-800";
      break;
  }
  return <Badge className={cn(colorClass, "font-medium")}>{status}</Badge>;
};

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // تصفية الطلبات حسب البحث والحالة
  const filteredOrders = dummyOrders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = !selectedStatus || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">الطلبات</h1>
        <p className="text-muted-foreground mt-1">إدارة ومتابعة طلبات عملائك</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <Tabs defaultValue="all" className="w-full max-w-md">
          <TabsList>
            <TabsTrigger value="all">جميع الطلبات</TabsTrigger>
            <TabsTrigger value="processing">قيد المعالجة</TabsTrigger>
            <TabsTrigger value="shipped">تم الشحن</TabsTrigger>
            <TabsTrigger value="delivered">تم التسليم</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن طلب..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            onValueChange={(value) => setSelectedStatus(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full md:w-44">
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="قيد المعالجة">قيد المعالجة</SelectItem>
              <SelectItem value="تم الشحن">تم الشحن</SelectItem>
              <SelectItem value="تم التسليم">تم التسليم</SelectItem>
              <SelectItem value="ملغي">ملغي</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>الطلبات الحالية</CardTitle>
          <CardDescription>
            {filteredOrders.length} طلب - آخر تحديث{" "}
            {format(new Date(), "PPP", { locale: ar })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-20rem)] w-full">
            <div className="space-y-0.5">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <ShoppingBag className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{order.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.customerName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {format(order.date, "dd/MM/yyyy", { locale: ar })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {order.items} منتج
                          </span>
                        </div>
                        <div className="w-24 text-left">
                          <span className="font-medium">
                            {order.total.toLocaleString()} ريال
                          </span>
                        </div>
                        <OrderStatusBadge status={order.status} />
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/dashboard/orders/${order.id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <Separator />
                  </React.Fragment>
                ))
              ) : (
                <div className="py-12 text-center">
                  <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">
                    لا توجد طلبات مطابقة لعملية البحث
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
