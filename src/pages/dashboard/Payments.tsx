
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download, Filter } from "lucide-react";
import { motion } from "framer-motion";
import PaymentStats from "@/features/payments/components/PaymentStats";
import PaymentFilters from "@/features/payments/components/PaymentFilters";
import PaymentChartCard from "@/features/payments/components/PaymentChartCard";
import PaymentTransactionsTable from "@/features/payments/components/PaymentTransactionsTable";
import PaymentMethodsBreakdown from "@/features/payments/components/PaymentMethodsBreakdown";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMediaQuery } from "@/hooks/use-media-query";

const Payments: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [filtersVisible, setFiltersVisible] = useState(!isMobile);
  const [filters, setFilters] = useState({
    status: "all",
    paymentMethod: "all",
    searchQuery: "",
    startDate: "",
    endDate: ""
  });
  
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    setFilters({
      status: "all",
      paymentMethod: "all",
      searchQuery: "",
      startDate: "",
      endDate: ""
    });
  };
  
  const handleExportData = () => {
    // سيتم تطبيق ميزة تصدير المعاملات في المستقبل
    alert("سيتم دعم تصدير المعاملات قريباً");
  };
  
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-2xl font-bold">إدارة المدفوعات</h1>
            <p className="text-gray-500 mt-1">متابعة وتحليل المعاملات المالية للمتجر</p>
          </div>
          <div className="flex gap-2">
            {isMobile && (
              <Button variant="outline" size="icon" onClick={toggleFilters}>
                <Filter className="h-4 w-4" />
              </Button>
            )}
            <Button variant="outline" className="gap-2 whitespace-nowrap" onClick={handleExportData}>
              <Download className="h-4 w-4" />
              <span>تصدير المعاملات</span>
            </Button>
          </div>
        </motion.div>
        
        {/* إحصائيات سريعة */}
        <PaymentStats />
        
        {/* نظرة عامة على المدفوعات */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PaymentChartCard />
          </div>
          <div>
            <PaymentMethodsBreakdown />
          </div>
        </div>
        
        {/* تبويبات تحليل المدفوعات */}
        <Card>
          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="w-full justify-start px-6 pt-4 border-b">
              <TabsTrigger value="transactions">المعاملات</TabsTrigger>
              <TabsTrigger value="analytics">تحليلات متقدمة</TabsTrigger>
            </TabsList>
            <TabsContent value="transactions">
              <div className="p-6 space-y-6">
                {/* فلاتر البحث */}
                {filtersVisible && (
                  <PaymentFilters 
                    onFilterChange={handleFilterChange} 
                    onReset={handleResetFilters} 
                    initialValues={filters}
                  />
                )}
                
                {/* جدول المعاملات */}
                <PaymentTransactionsTable filters={filters} />
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <div className="h-[400px] flex items-center justify-center">
                <p className="text-gray-500">سيتم إضافة تحليلات متقدمة قريباً</p>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Payments;
