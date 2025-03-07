
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/DashboardLayout";
import OrderDetailsModal from "@/features/orders/components/OrderDetailsModal";
import NewOrderModal from "@/features/orders/components/NewOrderModal";
import OrderStats from "@/features/orders/components/OrderStats";
import OrdersHeader from "@/features/orders/components/OrdersHeader";
import OrdersFilters from "@/features/orders/components/OrdersFilters";
import OrdersListContainer from "@/features/orders/components/OrdersListContainer";
import OrderDeleteDialog from "@/features/orders/components/OrderDeleteDialog";
import { Order, OrderStatus } from "@/types/orders";
import { toast } from "sonner";
import LoadingState from "@/components/ui/loading-state";
import ErrorState from "@/components/ui/error-state";
import useStoreData from "@/hooks/use-store-data";
import {
  fetchOrders,
  fetchOrderDetails,
  updateOrderStatus,
  deleteOrder,
  fetchOrderStats
} from "@/services/order-service";

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
  
  // State variables
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

  // Fetch order stats
  const { 
    data: statsData,
    isLoading: isStatsLoading,
    refetch: refetchStats
  } = useQuery({
    queryKey: ["orderStats", storeId],
    queryFn: () => fetchOrderStats(storeId),
    enabled: !!storeId,
  });

  // Fetch orders data
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

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(0);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Event handlers
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

  const handleSort = (field: string) => {
    if (orderBy === field) {
      setOrderDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setOrderBy(field);
      setOrderDirection("desc");
    }
  };

  const totalPages = Math.ceil((ordersData?.totalCount || 0) / pageSize);

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
        {/* Header with title and actions */}
        <OrdersHeader 
          onRefresh={handleRefresh}
          onAddOrder={() => setIsAddingOrder(true)}
        />

        {/* Orders statistics */}
        <OrderStats 
          stats={statsData || { total: 0, processing: 0, delivered: 0, cancelled: 0 }} 
          isLoading={isStatsLoading} 
        />
        
        {/* Search and filters */}
        <OrdersFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab as (tab: OrderStatus | "all") => void}
          stats={statsData || { total: 0, processing: 0, delivered: 0, cancelled: 0 }}
        />
        
        {/* Orders list with pagination */}
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
          <OrdersListContainer
            orders={ordersData?.orders || []}
            isLoading={isLoading}
            totalPages={totalPages}
            currentPage={currentPage}
            currency={storeData?.currency}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteOrder}
          />
        </div>
      </div>
      
      {/* Modals and dialogs */}
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
      
      <OrderDeleteDialog
        isOpen={isConfirmingDelete}
        onClose={() => setIsConfirmingDelete(false)}
        onConfirm={confirmDelete}
      />
      
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
