
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/DashboardLayout";
import OrdersList from "@/features/orders/components/OrdersList";
import OrderDetailsModal from "@/features/orders/components/OrderDetailsModal";
import OrderStats from "@/features/orders/components/OrderStats";
import OrderEmptyState from "@/features/orders/components/OrderEmptyState";
import NewOrderModal from "@/features/orders/components/NewOrderModal";
import {
  fetchOrders,
  fetchOrderDetails,
  updateOrderStatus,
  deleteOrder,
  fetchOrderStats
} from "@/services/order-service";
import { Order, OrderStatus } from "@/types/orders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, RefreshCcw, ShoppingBag, Package, Check, X, Clock } from "lucide-react";
import { toast } from "sonner";
import LoadingState from "@/components/ui/loading-state";
import ErrorState from "@/components/ui/error-state";
import useStoreData from "@/hooks/use-store-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Badge } from "@/components/ui/badge";

const ensureOrderStatus = (status: string): OrderStatus => {
  switch(status) {
    case "processing": return "processing";
    case "delivered": return "delivered";
    case "cancelled": return "cancelled";
    default: return "processing";
  }
};

const mapToOrderType = (dbOrder: any): Order => {
  return {
    ...dbOrder,
    status: ensureOrderStatus(dbOrder.status)
  };
};

const OrdersPage: React.FC = () => {
  const { storeData } = useStoreData();
  const storeId = storeData?.id || "";
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [orderBy, setOrderBy] = useState<string>("created_at");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isAddingOrder, setIsAddingOrder] = useState(false);

  const { 
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ["orderStats", storeId],
    queryFn: () => fetchOrderStats(storeId),
    enabled: !!storeId,
  });

  const {
    data: ordersData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["orders", storeId, activeTab, debouncedQuery, currentPage, pageSize, orderBy, orderDirection],
    queryFn: async () => {
      const result = await fetchOrders(storeId, {
        status: activeTab, 
        searchQuery: debouncedQuery,
        page: currentPage,
        pageSize,
        orderBy,
        orderDirection
      });
      const typedOrders = result.orders.map(order => mapToOrderType(order));
      return { ...result, orders: typedOrders };
    },
    enabled: !!storeId,
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(0);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleViewDetails = async (order: Order) => {
    try {
      if (!order.items) {
        const detailedOrder = await fetchOrderDetails(order.id);
        if (detailedOrder) {
          setSelectedOrder(mapToOrderType(detailedOrder));
        } else {
          setSelectedOrder(order);
          toast.error("تعذر تحميل تفاصيل المنتجات للطلب");
        }
      } else {
        setSelectedOrder(order);
      }
      
      setIsViewingDetails(true);
    } catch (error) {
      console.error("Error loading order details:", error);
      toast.error("حدث خطأ أثناء تحميل تفاصيل الطلب");
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, status);
      refetch();
      refetchStats();
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status } : null);
      }
      
      const statusText = status === "processing" ? "قيد المعالجة" : status === "delivered" ? "تم التوصيل" : "ملغي";
      toast.success(`تم تحديث حالة الطلب إلى ${statusText}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("حدث خطأ أثناء تحديث حالة الطلب");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setOrderToDelete(orderId);
    setIsConfirmingDelete(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    
    try {
      const success = await deleteOrder(orderToDelete);
      if (success) {
        refetch();
        refetchStats();
        setIsConfirmingDelete(false);
        toast.success("تم حذف الطلب بنجاح");
        
        if (selectedOrder && selectedOrder.id === orderToDelete) {
          setIsViewingDetails(false);
          setSelectedOrder(null);
        }
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("حدث خطأ أثناء حذف الطلب");
    } finally {
      setOrderToDelete(null);
    }
  };

  const handleSort = (field: string) => {
    if (orderBy === field) {
      setOrderDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrderDirection("desc");
    }
  };

  const handleRefresh = () => {
    refetch();
    refetchStats();
    toast.success("تم تحديث البيانات");
  };

  const handleOrderAdded = () => {
    refetch();
    refetchStats();
    toast.success("تم إضافة الطلب بنجاح");
    setIsAddingOrder(false);
  };

  const totalPages = Math.ceil((ordersData?.totalCount || 0) / pageSize);

  // تنظيف لتصنيفات الطلبات
  const statusItems = [
    {
      id: "all",
      label: "الكل",
      count: statsData?.total || 0,
      icon: <ShoppingBag className="h-4 w-4" />,
      color: "bg-gray-100 text-gray-800 border-gray-200"
    },
    {
      id: "processing",
      label: "قيد المعالجة",
      count: statsData?.processing || 0,
      icon: <Clock className="h-4 w-4" />,
      color: "bg-blue-50 text-blue-800 border-blue-200"
    },
    {
      id: "delivered",
      label: "تم التوصيل",
      count: statsData?.delivered || 0,
      icon: <Check className="h-4 w-4" />,
      color: "bg-green-50 text-green-800 border-green-200"
    },
    {
      id: "cancelled",
      label: "ملغي",
      count: statsData?.cancelled || 0,
      icon: <X className="h-4 w-4" />,
      color: "bg-red-50 text-red-800 border-red-200"
    }
  ];

  if (isLoading && !ordersData) {
    return <LoadingState message="جاري تحميل الطلبات..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="حدث خطأ"
        message="لم نتمكن من تحميل الطلبات. يرجى المحاولة مرة أخرى."
        onRetry={refetch}
      />
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">إدارة الطلبات</h1>
            <p className="text-muted-foreground">
              قم بإدارة وتتبع جميع طلبات متجرك من مكان واحد
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              تحديث
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsAddingOrder(true)}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="h-4 w-4" />
              طلب جديد
            </Button>
          </div>
        </div>

        <OrderStats stats={statsData || { total: 0, processing: 0, delivered: 0, cancelled: 0 }} isLoading={isStatsLoading} />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الطلبات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-3 pr-9 border-gray-200 focus:border-primary-300 focus:ring focus:ring-primary-100 focus:ring-opacity-50"
            />
          </div>
          
          <Button variant="outline" className="flex items-center gap-2 sm:w-auto w-full justify-center border-gray-200 hover:border-primary-200 hover:bg-primary-50">
            <Filter className="h-4 w-4" />
            تصفية متقدمة
          </Button>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto py-4 px-4 gap-2 border-b border-gray-100">
            {statusItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as OrderStatus | "all")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === item.id
                    ? `${item.color} shadow-sm`
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                <Badge variant="outline" className="ml-1 bg-white text-xs min-w-5 h-5 flex items-center justify-center">
                  {item.count}
                </Badge>
              </button>
            ))}
          </div>
          
          <div className="p-4">
            {ordersData?.orders && ordersData.orders.length > 0 ? (
              <>
                <OrdersList
                  orders={ordersData.orders}
                  isLoading={isLoading}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteOrder}
                  currency={storeData?.currency}
                />
                
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                        disabled={currentPage === 0}
                        className="border-gray-200"
                      >
                        السابق
                      </Button>
                      
                      <span className="text-sm">
                        الصفحة {currentPage + 1} من {totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => (prev + 1 < totalPages ? prev + 1 : prev))}
                        disabled={currentPage + 1 >= totalPages}
                        className="border-gray-200"
                      >
                        التالي
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <OrderEmptyState />
            )}
          </div>
        </div>
      </div>
      
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isViewingDetails}
          onClose={() => {
            setIsViewingDetails(false);
            setSelectedOrder(null);
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
      
      <Dialog open={isConfirmingDelete} onOpenChange={(open) => !open && setIsConfirmingDelete(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تأكيد حذف الطلب</DialogTitle>
            <DialogDescription>
              هل أنت متأكد من رغبتك في حذف هذا الطلب؟ هذا الإجراء لا يمكن التراجع عنه.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
              إلغاء
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              حذف الطلب
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <NewOrderModal
        storeId={storeId}
        isOpen={isAddingOrder}
        onClose={() => setIsAddingOrder(false)}
        onSuccess={handleOrderAdded}
      />
    </DashboardLayout>
  );
};

export default OrdersPage;
