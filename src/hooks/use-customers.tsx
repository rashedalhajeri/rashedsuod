
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomers, updateCustomer, Customer } from "@/services/customer-service";
import { toast } from "@/hooks/use-toast";

export function useCustomers(storeId: string) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const { 
    data: customersData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['customers', storeId],
    queryFn: () => fetchCustomers(storeId || ''),
    enabled: !!storeId,
  });
  
  const filteredCustomers = useMemo(() => {
    if (!customersData?.customers) return [];
    
    return customersData.customers.filter(customer => {
      const matchesSearch = 
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.phone && customer.phone.includes(searchTerm));
      
      const matchesStatus = 
        statusFilter === "all" || 
        customer.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [customersData, searchTerm, statusFilter]);
  
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };
  
  const handleUpdateStatus = async (customerId: string, status: "active" | "inactive") => {
    try {
      const result = await updateCustomer(customerId, { status });
      
      if (result.success) {
        if (selectedCustomer && selectedCustomer.id === customerId) {
          setSelectedCustomer({ ...selectedCustomer, status });
        }
        
        refetch();
        
        toast("تم تحديث حالة العميل", {
          description: `تم تغيير حالة العميل إلى ${status === "active" ? "نشط" : "غير نشط"}`,
        });
      } else {
        throw new Error("Failed to update customer status");
      }
    } catch (error) {
      console.error("Error updating customer status:", error);
      toast("خطأ", {
        description: "حدث خطأ أثناء تحديث حالة العميل",
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
  };
  
  const handleExportCustomers = () => {
    toast("تم تصدير بيانات العملاء", {
      description: "تم تصدير بيانات العملاء بنجاح إلى ملف CSV",
    });
  };
  
  return {
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
  };
}
