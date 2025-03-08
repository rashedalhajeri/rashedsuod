import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Search, Filter, Download, ChevronDown, Mail, Phone, MapPin, User, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { fetchCustomers, Customer, updateCustomer } from "@/services/customer-service"; 

const CustomerListItem: React.FC<{ 
  customer: Customer; 
  onViewDetails: (customer: Customer) => void;
  currency: string;
}> = ({ customer, onViewDetails, currency }) => {
  const formatCurrency = getCurrencyFormatter(currency);
  
  return (
    <div 
      className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer" 
      onClick={() => onViewDetails(customer)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-primary-50 text-primary-700">
              {customer.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium text-gray-800">{customer.name}</h3>
            <p className="text-xs text-gray-500">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-800">{formatCurrency(customer.total_spent)}</span>
            <span className="text-xs text-gray-500">{customer.total_orders} طلب</span>
          </div>
          <Badge
            variant={customer.status === "active" ? "outline" : "secondary"}
            className={`
              ${customer.status === "active" ? "border-green-500 text-green-600 bg-green-50" : "bg-gray-200 text-gray-600"}
            `}
          >
            {customer.status === "active" ? "نشط" : "غير نشط"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

const CustomerDetails: React.FC<{ 
  customer: Customer;
  onClose: () => void;
  currency: string;
  onUpdateStatus: (customerId: string, status: "active" | "inactive") => void;
}> = ({ customer, onClose, currency, onUpdateStatus }) => {
  const formatCurrency = getCurrencyFormatter(currency);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "غير متوفر";
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ar });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6 rtl">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-20 w-20 border">
          <AvatarFallback className="bg-primary-50 text-primary-700 text-2xl">
            {customer.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-xl font-bold">{customer.name}</h2>
          <p className="text-gray-500">عميل منذ {formatDate(customer.created_at)}</p>
        </div>
      </div>
      
      <Tabs defaultValue="info" dir="rtl">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="info">معلومات العميل</TabsTrigger>
          <TabsTrigger value="orders">الطلبات</TabsTrigger>
          <TabsTrigger value="activity">النشاط</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">البريد الإلكتروني</p>
                <p className="text-sm font-medium">{customer.email || "غير متوفر"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">رقم الهاتف</p>
                <p className="text-sm font-medium">{customer.phone || "غير متوفر"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">المدينة</p>
                <p className="text-sm font-medium">{customer.city || "غير متوفر"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">الحالة</p>
                <div className="text-sm font-medium flex items-center mt-1">
                  <Badge
                    variant={customer.status === "active" ? "outline" : "secondary"}
                    className={`
                      ${customer.status === "active" ? "border-green-500 text-green-600 bg-green-50" : "bg-gray-200 text-gray-600"}
                    `}
                  >
                    {customer.status === "active" ? "نشط" : "غير نشط"}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 mr-2 text-xs"
                    onClick={() => onUpdateStatus(
                      customer.id, 
                      customer.status === "active" ? "inactive" : "active"
                    )}
                  >
                    تغيير الحالة
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-primary-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">مجموع الطلبات</p>
              <p className="text-xl font-bold text-primary-700">{customer.total_orders}</p>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">إجمالي الإنفاق</p>
              <p className="text-xl font-bold text-primary-700">{formatCurrency(customer.total_spent)}</p>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">آخر طلب</p>
              <p className="text-lg font-bold text-primary-700">
                {customer.last_order_date 
                  ? formatDate(customer.last_order_date) 
                  : "لا يوجد"}
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="orders" className="pt-4">
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500">لا توجد طلبات سابقة لهذا العميل</p>
            <Button variant="outline" className="mt-2">
              إنشاء طلب جديد
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="activity" className="pt-4">
          <div className="text-center py-8 border rounded-md">
            <p className="text-gray-500">لا يوجد نشاط مسجل لهذا العميل</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          إغلاق
        </Button>
        <Button>
          تعديل بيانات العميل
        </Button>
      </DialogFooter>
    </div>
  );
};

const Customers: React.FC = () => {
  const { data: storeData } = useStoreData();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  const { data: customersData, isLoading, error, refetch } = useQuery({
    queryKey: ['customers', storeData?.id],
    queryFn: () => fetchCustomers(storeData?.id || ''),
    enabled: !!storeData?.id,
  });
  
  const filteredCustomers = React.useMemo(() => {
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
        variant: "destructive",
      });
    }
  };
  
  const handleExportCustomers = () => {
    toast("تم تصدير بيانات العملاء", {
      description: "تم تصدير بيانات العملاء بنجاح إلى ملف CSV",
    });
  };
  
  const emptyState = (
    <div className="text-center py-12">
      <Users className="h-12 w-12 mx-auto text-gray-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">لا يوجد عملاء</h3>
      <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة عملاء جدد لمتجرك</p>
      <Button className="mt-4">إضافة عميل جديد</Button>
    </div>
  );
  
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
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث بالاسم أو البريد الإلكتروني أو رقم الهاتف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-3 pr-9"
            />
          </div>
          
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as "all" | "active" | "inactive")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="تصفية حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع العملاء</SelectItem>
              <SelectItem value="active">العملاء النشطين</SelectItem>
              <SelectItem value="inactive">العملاء غير النشطين</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              العملاء ({filteredCustomers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <p>جاري تحميل بيانات العملاء...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-500">حدث خطأ أثناء تحميل بيانات العملاء</p>
                <Button variant="outline" className="mt-2" onClick={() => refetch()}>
                  إعادة المحاولة
                </Button>
              </div>
            ) : filteredCustomers.length === 0 ? (
              emptyState
            ) : (
              filteredCustomers.map((customer) => (
                <CustomerListItem
                  key={customer.id}
                  customer={customer}
                  onViewDetails={handleViewDetails}
                  currency="KWD"
                />
              ))
            )}
          </CardContent>
        </Card>
        
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
