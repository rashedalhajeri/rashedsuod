
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Search, Filter, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

import useStoreData from "@/hooks/use-store-data";
import LoadingState from "@/components/ui/loading-state";
import { Order, OrderStatus } from "@/types/orders";
import { 
  fetchOrders, 
  fetchOrderDetails, 
  updateOrderStatus, 
  fetchOrderStats,
  deleteOrder
} from "@/services/order-service";

// المكونات
import OrdersList from "@/features/orders/components/OrdersList";
import OrderDetailsModal from "@/features/orders/components/OrderDetailsModal";
import OrderStats from "@/features/orders/components/OrderStats";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [currentTab, setCurrentTab] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  
  const { data: storeData, isLoading: isStoreLoading } = useStoreData();
  const { toast } = useToast();
  
  // جلب الطلبات
  const { 
    data: ordersData, 
    isLoading: isOrdersLoading, 
    refetch: refetchOrders 
  } = useQuery({
    queryKey: ['orders', storeData?.id, currentTab, searchQuery],
    queryFn: () => {
      if (!storeData?.id) return Promise.resolve({ orders: [], totalCount: 0 });
      return fetchOrders(storeData.id, {
        status: currentTab === "all" ? undefined : currentTab,
        searchQuery
      });
    },
    enabled: !!storeData?.id,
  });
  
  // جلب إحصائيات الطلبات
  const { 
    data: statsData, 
    isLoading: isStatsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ['orderStats', storeData?.id],
    queryFn: () => {
      if (!storeData?.id) return Promise.resolve({
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      });
      return fetchOrderStats(storeData.id);
    },
    enabled: !!storeData?.id,
  });
  
  // مراقبة تغيير التاب
  useEffect(() => {
    setStatusFilter(currentTab);
  }, [currentTab]);
  
  // عرض تفاصيل الطلب
  const handleViewOrderDetails = async (order: Order) => {
    try {
      if (order.items) {
        // إذا كانت التفاصيل موجودة بالفعل
        setSelectedOrder(order);
        setIsOrderDialogOpen(true);
      } else {
        // جلب تفاصيل الطلب من قاعدة البيانات
        const orderDetails = await fetchOrderDetails(order.id);
        if (orderDetails) {
          setSelectedOrder(orderDetails);
          setIsOrderDialogOpen(true);
        } else {
          toast({
            title: "حدث خطأ",
            description: "لم نتمكن من جلب تفاصيل الطلب",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من جلب تفاصيل الطلب",
        variant: "destructive",
      });
    }
  };
  
  // تحديث حالة الطلب
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      if (updatedOrder) {
        // تحديث الطلب المحدد إذا كان مفتوحًا
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
        }
        
        // تحديث قائمة الطلبات والإحصائيات
        refetchOrders();
        refetchStats();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من تحديث حالة الطلب",
        variant: "destructive",
      });
    }
  };
  
  // حذف الطلب
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    try {
      const success = await deleteOrder(orderToDelete);
      
      if (success) {
        // إغلاق مربع الحوار
        setIsDeleteDialogOpen(false);
        setOrderToDelete(null);
        
        // تحديث البيانات
        refetchOrders();
        refetchStats();
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "حدث خطأ",
        description: "لم نتمكن من حذف الطلب",
        variant: "destructive",
      });
    }
  };
  
  // التصدير إلى ملف إكسل
  const handleExportToExcel = () => {
    toast({
      title: "قريبًا",
      description: "سيتم إضافة هذه الميزة قريبًا",
    });
  };
  
  // رسالة تحميل البيانات
  if (isStoreLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="جاري تحميل بيانات المتجر..." />
      </DashboardLayout>
    );
  }
  
  // رسالة الخطأ إذا لم يكن هناك متجر
  if (!storeData) {
    return (
      <DashboardLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>خطأ</AlertTitle>
          <AlertDescription>
            لم نتمكن من تحميل بيانات المتجر. يرجى تحديث الصفحة أو المحاولة لاحقًا.
          </AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
          <Button variant="outline" className="gap-2" onClick={handleExportToExcel}>
            <Download className="h-4 w-4" />
            <span>تصدير الطلبات</span>
          </Button>
        </div>
        
        {/* إحصائيات الطلبات */}
        <OrderStats stats={statsData || {
          total: 0,
          pending: 0,
          processing: 0,
          shipped: 0,
          delivered: 0,
          cancelled: 0,
        }} isLoading={isStatsLoading} />
        
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
        
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as OrderStatus | "all")} className="w-full">
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="pending">قيد الانتظار</TabsTrigger>
            <TabsTrigger value="processing">قيد المعالجة</TabsTrigger>
            <TabsTrigger value="shipped">تم الشحن</TabsTrigger>
            <TabsTrigger value="delivered">تم التوصيل</TabsTrigger>
            <TabsTrigger value="cancelled">ملغي</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium">
                <ShoppingBag className="h-4 w-4 inline-block ml-2" />
                قائمة الطلبات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrdersList 
                orders={ordersData?.orders || []}
                currency={storeData.currency}
                isLoading={isOrdersLoading}
                onViewDetails={handleViewOrderDetails}
                onUpdateStatus={handleUpdateOrderStatus}
                onDelete={(orderId) => {
                  setOrderToDelete(orderId);
                  setIsDeleteDialogOpen(true);
                }}
              />
            </CardContent>
          </Card>
        </Tabs>
      </div>
      
      {/* مربع حوار تفاصيل الطلب */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderDialogOpen}
        onClose={() => setIsOrderDialogOpen(false)}
        onUpdateStatus={handleUpdateOrderStatus}
      />
      
      {/* مربع حوار تأكيد الحذف */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا الطلب؟</AlertDialogTitle>
            <AlertDialogDescription>
              هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الطلب وجميع بياناته نهائيًا.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteOrder}
              className="bg-red-500 hover:bg-red-600"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Orders;
