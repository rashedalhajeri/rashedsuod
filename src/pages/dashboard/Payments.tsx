
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion } from "framer-motion";
import PaymentStats from "@/features/payments/components/PaymentStats";
import PaymentFilters from "@/features/payments/components/PaymentFilters";
import PaymentChartCard from "@/features/payments/components/PaymentChartCard";
import PaymentTransactionsTable from "@/features/payments/components/PaymentTransactionsTable";

const Payments: React.FC = () => {
  const [filters, setFilters] = useState({
    status: "all",
    paymentMethod: "all",
    searchQuery: ""
  });
  
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };
  
  const handleResetFilters = () => {
    setFilters({
      status: "all",
      paymentMethod: "all",
      searchQuery: ""
    });
  };
  
  const handleExportData = () => {
    // سيتم تطبيق ميزة تصدير المعاملات في المستقبل
    alert("سيتم دعم تصدير المعاملات قريباً");
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
          <Button variant="outline" className="gap-2 whitespace-nowrap" onClick={handleExportData}>
            <Download className="h-4 w-4" />
            <span>تصدير المعاملات</span>
          </Button>
        </motion.div>
        
        {/* إحصائيات سريعة */}
        <PaymentStats />
        
        {/* الرسم البياني */}
        <PaymentChartCard />
        
        {/* فلاتر البحث */}
        <PaymentFilters onFilterChange={handleFilterChange} onReset={handleResetFilters} />
        
        {/* جدول المعاملات */}
        <PaymentTransactionsTable filters={filters} />
      </div>
    </DashboardLayout>
  );
};

export default Payments;
