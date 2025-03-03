
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderList from "@/components/order/OrderList";
import { OrderFilters } from "@/components/order/OrderFilters";
import { OrderStats } from "@/components/order/OrderStats";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [statusFilter, setStatusFilter] = useState("all");

  const mockData = {
    totalOrders: 123,
    newOrders: 15,
    processingOrders: 28,
    shippedOrders: 42,
    completedOrders: 34,
    cancelledOrders: 4,
    totalRevenue: 12500.75
  };

  // Custom handler for date range changes to match the expected type
  const handleDateRangeChange = (value: any) => {
    setDateRange(value);
  };
  
  // Handler for OrderFilters' searchChange
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  // Function to handle opening order details
  const handleOpenOrderDetails = (orderId: string) => {
    console.log("Opening order details for:", orderId);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">الطلبات</h2>
          <p className="text-muted-foreground">
            إدارة طلبات متجرك وتتبع حالة الشحنات
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">تصدير</Button>
          <Button>طلب جديد</Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <OrderStats 
          totalOrders={mockData.totalOrders}
          processingOrders={mockData.processingOrders}
          shippedOrders={mockData.shippedOrders}
          completedOrders={mockData.completedOrders}
          cancelledOrders={mockData.cancelledOrders}
          totalRevenue={mockData.totalRevenue}
          currencySymbol="ر.س"
        />
      </motion.div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>قائمة الطلبات</CardTitle>
        </CardHeader>
        <CardContent>
          <OrderFilters 
            onSearchChange={handleSearchChange} 
            onDateRangeChange={handleDateRangeChange}
            onStatusChange={setStatusFilter}
          />
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="all">جميع الطلبات</TabsTrigger>
              <TabsTrigger value="processing">قيد التنفيذ</TabsTrigger>
              <TabsTrigger value="completed">مكتملة</TabsTrigger>
              <TabsTrigger value="cancelled">ملغاة</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <OrderList 
                searchQuery={searchQuery}
                statusFilter={statusFilter}
                dateRangeFilter=""
                onOpenDetails={handleOpenOrderDetails}
                currency="SAR"
              />
            </TabsContent>
            
            <TabsContent value="processing">
              <OrderList 
                searchQuery={searchQuery}
                statusFilter="processing"
                dateRangeFilter=""
                onOpenDetails={handleOpenOrderDetails}
                currency="SAR"
              />
            </TabsContent>
            
            <TabsContent value="completed">
              <OrderList 
                searchQuery={searchQuery}
                statusFilter="completed"
                dateRangeFilter=""
                onOpenDetails={handleOpenOrderDetails}
                currency="SAR"
              />
            </TabsContent>
            
            <TabsContent value="cancelled">
              <OrderList 
                searchQuery={searchQuery}
                statusFilter="cancelled"
                dateRangeFilter=""
                onOpenDetails={handleOpenOrderDetails}
                currency="SAR"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
