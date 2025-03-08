
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import useStoreData from "@/hooks/use-store-data";
import { useCustomers } from "@/hooks/use-customers";
import CustomerFilters from "@/components/customer/CustomerFilters";
import CustomerList from "@/components/customer/CustomerList";
import CustomerDetails from "@/components/customer/CustomerDetails";

const Customers: React.FC = () => {
  const { data: storeData } = useStoreData();
  const { 
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedCustomer,
    setSelectedCustomer,
    filteredCustomers,
    isLoading,
    error,
    refetch,
    handleViewDetails,
    handleUpdateStatus,
    handleExportCustomers
  } = useCustomers(storeData?.id || '');
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 rtl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة العملاء</h1>
          <Button variant="outline" className="gap-2" onClick={handleExportCustomers}>
            <Download className="h-4 w-4 ml-1" />
            <span>تصدير العملاء</span>
          </Button>
        </div>
        
        <CustomerFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />
        
        <CustomerList
          isLoading={isLoading}
          error={error}
          filteredCustomers={filteredCustomers}
          handleViewDetails={handleViewDetails}
          refetch={refetch}
          currency="KWD"
        />
        
        <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>تفاصيل العميل</DialogTitle>
              <DialogDescription>
                عرض كافة بيانات ومعلومات العميل
              </DialogDescription>
            </DialogHeader>
            
            {selectedCustomer && (
              <CustomerDetails 
                customer={selectedCustomer} 
                onClose={() => setSelectedCustomer(null)}
                currency="KWD"
                onUpdateStatus={handleUpdateStatus}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
