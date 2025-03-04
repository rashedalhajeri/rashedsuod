
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Search, Filter, Download, Clock, Box, TruckIcon, CheckCircle2, XCircle, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import LoadingState from "@/components/ui/loading-state";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";

// حالات الطلب
type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

// واجهة الطلب
interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  status: OrderStatus;
  total: number;
  items?: any[];
  paymentMethod?: string;
  shippingAddress?: string;
}

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  
  const { data: storeData } = useStoreData();
  const formatCurrency = getCurrencyFormatter(storeData?.currency || 'SAR');
  
  // بيانات تجريبية للطلبات
  const mockOrders: Order[] = [
    {
      id: "order-1",
      orderNumber: "10001",
      customerName: "أحمد محمد",
      date: "22 يوليو 2023",
      status: "delivered",
      total: 255.99,
      items: [
        { name: "قميص أنيق", price: 120, quantity: 1 },
        { name: "بنطال جينز", price: 135.99, quantity: 1 }
      ],
      paymentMethod: "بطاقة ائتمان",
      shippingAddress: "الرياض، المملكة العربية السعودية"
    },
    {
      id: "order-2",
      orderNumber: "10002",
      customerName: "سارة عبدالله",
      date: "21 يوليو 2023",
      status: "processing",
      total: 189.50,
      items: [
        { name: "فستان سهرة", price: 189.50, quantity: 1 }
      ],
      paymentMethod: "تحويل بنكي",
      shippingAddress: "جدة، المملكة العربية السعودية"
    },
    {
      id: "order-3",
      orderNumber: "10003",
      customerName: "محمد أحمد",
      date: "20 يوليو 2023",
      status: "pending",
      total: 340.00,
      items: [
        { name: "سماعات بلوتوث", price: 250, quantity: 1 },
        { name: "شاحن لاسلكي", price: 90, quantity: 1 }
      ],
      paymentMethod: "الدفع عند الاستلام",
      shippingAddress: "الدمام، المملكة العربية السعودية"
    },
    {
      id: "order-4",
      orderNumber: "10004",
      customerName: "نورة خالد",
      date: "19 يوليو 2023",
      status: "shipped",
      total: 129.99,
      items: [
        { name: "حذاء رياضي", price: 129.99, quantity: 1 }
      ],
      paymentMethod: "بطاقة ائتمان",
      shippingAddress: "الرياض، المملكة العربية السعودية"
    },
    {
      id: "order-5",
      orderNumber: "10005",
      customerName: "خالد محمد",
      date: "18 يوليو 2023",
      status: "cancelled",
      total: 450.00,
      items: [
        { name: "ساعة ذكية", price: 450, quantity: 1 }
      ],
      paymentMethod: "بطاقة ائتمان",
      shippingAddress: "مكة، المملكة العربية السعودية"
    }
  ];
  
  // تصفية الطلبات حسب البحث والحالة
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // الحصول على أيقونة الحالة
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "processing":
        return <Box className="h-4 w-4 text-blue-500" />;
      case "shipped":
        return <TruckIcon className="h-4 w-4 text-indigo-500" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };
  
  // الحصول على نص ولون الحالة
  const getStatusDetails = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return { text: "قيد الانتظار", color: "bg-amber-100 text-amber-800 border-amber-200" };
      case "processing":
        return { text: "قيد المعالجة", color: "bg-blue-100 text-blue-800 border-blue-200" };
      case "shipped":
        return { text: "تم الشحن", color: "bg-indigo-100 text-indigo-800 border-indigo-200" };
      case "delivered":
        return { text: "تم التوصيل", color: "bg-green-100 text-green-800 border-green-200" };
      case "cancelled":
        return { text: "ملغي", color: "bg-red-100 text-red-800 border-red-200" };
    }
  };
  
  // تغيير حالة الطلب
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    // هنا يمكن إضافة الكود الفعلي لتحديث حالة الطلب في قاعدة البيانات
    toast.success(`تم تغيير حالة الطلب رقم ${orderId} إلى "${getStatusDetails(newStatus).text}"`);
  };
  
  // عرض تفاصيل الطلب
  const showOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };
  
  // عرض حالة فارغة إذا لم تكن هناك طلبات
  const renderEmptyState = () => (
    <div className="text-center py-12">
      <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">لا توجد طلبات بعد</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        ستظهر طلبات العملاء هنا بمجرد استلامها
      </p>
    </div>
  );
  
  // عرض قائمة الطلبات
  const renderOrdersList = () => (
    <div className="grid gap-4">
      {filteredOrders.map((order) => (
        <motion.div 
          key={order.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 bg-primary-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-primary-500" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">طلب #{order.orderNumber}</h3>
                  <Badge variant="outline" className={getStatusDetails(order.status).color}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {getStatusDetails(order.status).text}
                    </span>
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="ml-3">{order.customerName}</span>
                  <span>{order.date}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right font-medium">
                {formatCurrency(order.total)}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => showOrderDetails(order)}
                >
                  تفاصيل
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, "processing")}>
                      تغيير إلى: قيد المعالجة
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, "shipped")}>
                      تغيير إلى: تم الشحن
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, "delivered")}>
                      تغيير إلى: تم التوصيل
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange(order.id, "cancelled")}>
                      تغيير إلى: ملغي
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span>تصدير الطلبات</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن طلب برقم الطلب أو اسم العميل..." 
                className="pl-3 pr-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}
            >
              <SelectTrigger>
                <SelectValue placeholder="جميع الحالات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="shipped">تم الشحن</SelectItem>
                <SelectItem value="delivered">تم التوصيل</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button variant="outline" className="w-full gap-2">
              <Filter className="h-4 w-4" />
              <span>تصفية متقدمة</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
            <TabsTrigger value="processing">قيد المعالجة</TabsTrigger>
            <TabsTrigger value="shipped">تم الشحن</TabsTrigger>
            <TabsTrigger value="delivered">تم التوصيل</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">
                <ShoppingBag className="h-4 w-4 inline-block ml-2" />
                قائمة الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length > 0 ? renderOrdersList() : renderEmptyState()}
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      {/* مربع حوار تفاصيل الطلب */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب #{selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              تفاصيل الطلب وحالته ومنتجاته
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="mt-4 space-y-6">
              {/* معلومات الطلب */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">رقم الطلب</h4>
                  <p>#{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">تاريخ الطلب</h4>
                  <p>{selectedOrder.date}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">العميل</h4>
                  <p>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">الحالة</h4>
                  <Badge variant="outline" className={getStatusDetails(selectedOrder.status).color}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedOrder.status)}
                      {getStatusDetails(selectedOrder.status).text}
                    </span>
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">طريقة الدفع</h4>
                  <p>{selectedOrder.paymentMethod}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">عنوان الشحن</h4>
                  <p>{selectedOrder.shippingAddress}</p>
                </div>
              </div>
              
              {/* منتجات الطلب */}
              <div>
                <h4 className="text-base font-medium mb-2">المنتجات</h4>
                <div className="border rounded-md">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex justify-between p-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">الكمية: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between p-3 bg-gray-50 font-medium">
                    <p>المجموع</p>
                    <p>{formatCurrency(selectedOrder.total)}</p>
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
                    className="text-amber-600 border-amber-200 hover:bg-amber-50"
                    onClick={() => handleStatusChange(selectedOrder.id, "pending")}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    قيد الانتظار
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => handleStatusChange(selectedOrder.id, "processing")}
                  >
                    <Box className="h-4 w-4 mr-2" />
                    قيد المعالجة
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => handleStatusChange(selectedOrder.id, "shipped")}
                  >
                    <TruckIcon className="h-4 w-4 mr-2" />
                    تم الشحن
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleStatusChange(selectedOrder.id, "delivered")}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    تم التوصيل
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleStatusChange(selectedOrder.id, "cancelled")}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    ملغي
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
              إغلاق
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Orders;
