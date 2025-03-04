import React, { useState } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import useStoreData, { getCurrencyFormatter } from "@/hooks/use-store-data";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: "active" | "inactive";
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
  avatar?: string | null;
}

const mockCustomers: Customer[] = [
  {
    id: "cus-001",
    name: "أحمد محمد",
    email: "ahmed@example.com",
    phone: "+966 55 123 4567",
    city: "الرياض",
    status: "active",
    totalOrders: 8,
    totalSpent: 2450,
    lastOrderDate: "2023-06-15",
    createdAt: "2023-01-10",
    avatar: null,
  },
  {
    id: "cus-002",
    name: "سارة عبدالله",
    email: "sara@example.com",
    phone: "+966 50 765 4321",
    city: "جدة",
    status: "active",
    totalOrders: 5,
    totalSpent: 1350,
    lastOrderDate: "2023-05-22",
    createdAt: "2023-02-15",
    avatar: null,
  },
  {
    id: "cus-003",
    name: "محمد العنزي",
    email: "mohammed@example.com",
    phone: "+966 54 888 7777",
    city: "الدمام",
    status: "inactive",
    totalOrders: 2,
    totalSpent: 450,
    lastOrderDate: "2023-03-05",
    createdAt: "2023-03-01",
    avatar: null,
  },
  {
    id: "cus-004",
    name: "نورة الشمري",
    email: "noura@example.com",
    phone: "+966 56 222 3333",
    city: "مكة",
    status: "active",
    totalOrders: 12,
    totalSpent: 3200,
    lastOrderDate: "2023-06-20",
    createdAt: "2022-12-05",
    avatar: null,
  },
  {
    id: "cus-005",
    name: "خالد السعيد",
    email: "khalid@example.com",
    phone: "+966 58 444 5555",
    city: "المدينة",
    status: "active",
    totalOrders: 3,
    totalSpent: 890,
    lastOrderDate: "2023-04-18",
    createdAt: "2023-04-01",
    avatar: null,
  },
];

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
        <div className="flex items-center space-x-4 space-x-reverse">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={customer.avatar || ""} />
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
            <span className="text-sm font-medium text-gray-800">{formatCurrency(customer.totalSpent)}</span>
            <span className="text-xs text-gray-500">{customer.totalOrders} طلب</span>
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
}> = ({ customer, onClose, currency }) => {
  const formatCurrency = getCurrencyFormatter('KWD');
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: ar });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-20 w-20 border">
          <AvatarImage src={customer.avatar || ""} />
          <AvatarFallback className="bg-primary-50 text-primary-700 text-2xl">
            {customer.name.substring(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center">
          <h2 className="text-xl font-bold">{customer.name}</h2>
          <p className="text-gray-500">عميل منذ {formatDate(customer.createdAt)}</p>
        </div>
      </div>
      
      <Tabs defaultValue="info">
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
                <p className="text-sm font-medium">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <Phone className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">رقم الهاتف</p>
                <p className="text-sm font-medium">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <MapPin className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">المدينة</p>
                <p className="text-sm font-medium">{customer.city}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-md">
              <User className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-xs text-gray-500">الحالة</p>
                <p className="text-sm font-medium">
                  <Badge
                    variant={customer.status === "active" ? "outline" : "secondary"}
                    className={`
                      ${customer.status === "active" ? "border-green-500 text-green-600 bg-green-50" : "bg-gray-200 text-gray-600"}
                    `}
                  >
                    {customer.status === "active" ? "نشط" : "غير نشط"}
                  </Badge>
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-primary-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">مجموع الطلبات</p>
              <p className="text-xl font-bold text-primary-700">{customer.totalOrders}</p>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">إجمالي الإنفاق</p>
              <p className="text-xl font-bold text-primary-700">{formatCurrency(customer.totalSpent)}</p>
            </div>
            <div className="bg-primary-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600">آخر طلب</p>
              <p className="text-xl font-bold text-primary-700">{formatDate(customer.lastOrderDate)}</p>
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
  const { toast } = useToast();
  
  const filteredCustomers = mockCustomers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === "all" || 
      customer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
  };
  
  const handleExportCustomers = () => {
    toast({
      title: "تم تصدير بيانات العملاء",
      description: "تم تصدير بيانات العملاء بنجاح إلى ملف CSV",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">إدارة العملاء</h1>
          <Button variant="outline" className="gap-2" onClick={handleExportCustomers}>
            <Download className="h-4 w-4" />
            <span>تصدير العملاء</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="البحث عن عميل بالاسم أو البريد الإلكتروني..." 
                className="pl-3 pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full gap-2">
                  <Filter className="h-4 w-4" />
                  <span>تصفية النتائج</span>
                  <ChevronDown className="h-4 w-4 mr-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>تصفية حسب الحالة</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                  {statusFilter === "all" && <Check className="h-4 w-4 ml-2" />}
                  جميع العملاء
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                  {statusFilter === "active" && <Check className="h-4 w-4 ml-2" />}
                  العملاء النشطين
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                  {statusFilter === "inactive" && <Check className="h-4 w-4 ml-2" />}
                  العملاء غير النشطين
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium flex items-center">
              <Users className="h-4 w-4 inline-block ml-2" />
              قائمة العملاء
              <Badge className="mr-2">{filteredCustomers.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length > 0 ? (
              <div className="border rounded-md overflow-hidden">
                {filteredCustomers.map(customer => (
                  <CustomerListItem 
                    key={customer.id} 
                    customer={customer} 
                    onViewDetails={handleViewDetails}
                    currency={storeData?.currency || "SAR"}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">لا يوجد عملاء</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== "all" 
                    ? "لا يوجد عملاء مطابقون لمعايير البحث" 
                    : "سيظهر هنا عملاؤك عندما يقومون بالتسجيل أو إتمام عملية شراء"}
                </p>
                {(searchTerm || statusFilter !== "all") && (
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                    }}
                  >
                    <X className="h-4 w-4 ml-2" />
                    إزالة عوامل التصفية
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>تفاصيل العميل</DialogTitle>
            <DialogDescription>
              عرض وإدارة معلومات العميل وطلباته
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <CustomerDetails 
              customer={selectedCustomer} 
              onClose={() => setSelectedCustomer(null)}
              currency={storeData?.currency || "SAR"}
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Customers;
