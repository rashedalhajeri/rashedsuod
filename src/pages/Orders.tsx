
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OrderList from "@/components/order/OrderList";
import OrderStats from "@/components/order/OrderStats";
import OrderFilters from "@/components/order/OrderFilters";
import OrderDetailsModal from "@/components/order/OrderDetailsModal";
import { ShoppingBag } from "lucide-react";

// Sample orders data (same as in OrderList component)
const orders = [
  {
    id: "ORD-001",
    customer: "أحمد محمد",
    date: new Date("2023-06-15"),
    total: 245.99,
    status: "completed",
    items: 3,
    paymentMethod: "بطاقة ائتمان",
  },
  {
    id: "ORD-002",
    customer: "سارة علي",
    date: new Date("2023-06-14"),
    total: 125.50,
    status: "processing",
    items: 2,
    paymentMethod: "دفع عند الاستلام",
  },
  {
    id: "ORD-003",
    customer: "محمد خالد",
    date: new Date("2023-06-13"),
    total: 540.00,
    status: "shipped",
    items: 5,
    paymentMethod: "بطاقة ائتمان",
  },
  {
    id: "ORD-004",
    customer: "فاطمة أحمد",
    date: new Date("2023-06-12"),
    total: 75.25,
    status: "cancelled",
    items: 1,
    paymentMethod: "دفع عند الاستلام",
  },
  {
    id: "ORD-005",
    customer: "عمر حسن",
    date: new Date("2023-06-11"),
    total: 320.75,
    status: "completed",
    items: 4,
    paymentMethod: "بطاقة ائتمان",
  },
  {
    id: "ORD-006",
    customer: "نورا سعيد",
    date: new Date("2023-06-10"),
    total: 180.00,
    status: "processing",
    items: 2,
    paymentMethod: "دفع عند الاستلام",
  },
  {
    id: "ORD-007",
    customer: "خالد محمود",
    date: new Date("2023-06-09"),
    total: 420.50,
    status: "shipped",
    items: 3,
    paymentMethod: "بطاقة ائتمان",
  },
  {
    id: "ORD-008",
    customer: "ليلى عبدالله",
    date: new Date("2023-06-08"),
    total: 95.99,
    status: "completed",
    items: 1,
    paymentMethod: "دفع عند الاستلام",
  },
  {
    id: "ORD-009",
    customer: "يوسف أحمد",
    date: new Date("2023-06-07"),
    total: 275.25,
    status: "cancelled",
    items: 3,
    paymentMethod: "بطاقة ائتمان",
  },
  {
    id: "ORD-010",
    customer: "هدى محمد",
    date: new Date("2023-06-06"),
    total: 150.00,
    status: "processing",
    items: 2,
    paymentMethod: "دفع عند الاستلام",
  },
];

const currencySymbols: Record<string, string> = {
  KWD: "د.ك",
  SAR: "ر.س",
  AED: "د.إ",
  QAR: "ر.ق",
  BHD: "د.ب",
  OMR: "ر.ع",
  USD: "$",
  EUR: "€",
};

const Orders: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [currency, setCurrency] = useState("KWD");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const handleOpenOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsDetailsModalOpen(true);
  };
  
  const handleCloseOrderDetails = () => {
    setIsDetailsModalOpen(false);
  };
  
  const getCurrencySymbol = (currencyCode: string): string => {
    return currencySymbols[currencyCode] || currencyCode;
  };
  
  // Get stats data from orders
  const completedOrders = orders.filter(order => order.status === "completed").length;
  const processingOrders = orders.filter(order => order.status === "processing").length;
  const shippedOrders = orders.filter(order => order.status === "shipped").length;
  const cancelledOrders = orders.filter(order => order.status === "cancelled").length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-primary-500" />
              إدارة الطلبات
            </h1>
            <p className="text-gray-600">
              إدارة ومتابعة جميع طلبات متجرك من مكان واحد
            </p>
          </div>
        </div>
        
        <OrderStats
          totalOrders={orders.length}
          completedOrders={completedOrders}
          processingOrders={processingOrders} 
          shippedOrders={shippedOrders}
          cancelledOrders={cancelledOrders}
          totalRevenue={totalRevenue}
          currencySymbol={getCurrencySymbol(currency)}
        />
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 w-full bg-gray-100 p-1 border border-gray-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              جميع الطلبات
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              مكتملة
            </TabsTrigger>
            <TabsTrigger value="processing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              قيد المعالجة
            </TabsTrigger>
            <TabsTrigger value="shipped" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              تم الشحن
            </TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              ملغية
            </TabsTrigger>
          </TabsList>
          
          <Card className="border-gray-100 mt-6">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 pb-4">
              <CardTitle className="text-lg font-semibold text-gray-800">تصفية الطلبات</CardTitle>
              <CardDescription>قم بتصفية الطلبات حسب الحالة والتاريخ وغيرها من المعايير</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <OrderFilters 
                onSearchChange={setSearchQuery}
                onStatusChange={setStatusFilter}
                onDateRangeChange={setDateRangeFilter}
              />
            </CardContent>
          </Card>
          
          <TabsContent value="all" className="mt-6 animate-fade-in">
            <OrderList 
              searchQuery={searchQuery}
              statusFilter={statusFilter}
              dateRangeFilter={dateRangeFilter}
              onOpenDetails={handleOpenOrderDetails}
              currency={currency}
            />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6 animate-fade-in">
            <OrderList 
              searchQuery={searchQuery}
              statusFilter="completed"
              dateRangeFilter={dateRangeFilter}
              onOpenDetails={handleOpenOrderDetails}
              currency={currency}
            />
          </TabsContent>
          
          <TabsContent value="processing" className="mt-6 animate-fade-in">
            <OrderList 
              searchQuery={searchQuery}
              statusFilter="processing"
              dateRangeFilter={dateRangeFilter}
              onOpenDetails={handleOpenOrderDetails}
              currency={currency}
            />
          </TabsContent>
          
          <TabsContent value="shipped" className="mt-6 animate-fade-in">
            <OrderList 
              searchQuery={searchQuery}
              statusFilter="shipped"
              dateRangeFilter={dateRangeFilter}
              onOpenDetails={handleOpenOrderDetails}
              currency={currency}
            />
          </TabsContent>
          
          <TabsContent value="cancelled" className="mt-6 animate-fade-in">
            <OrderList 
              searchQuery={searchQuery}
              statusFilter="cancelled"
              dateRangeFilter={dateRangeFilter}
              onOpenDetails={handleOpenOrderDetails}
              currency={currency}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      <OrderDetailsModal 
        isOpen={isDetailsModalOpen}
        onClose={handleCloseOrderDetails}
        orderId={selectedOrderId}
        orders={orders}
        currencySymbol={getCurrencySymbol(currency)}
      />
    </DashboardLayout>
  );
};

export default Orders;
