
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { CustomerStats } from "@/components/customer/CustomerStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MoreHorizontal, 
  Search, 
  UserPlus, 
  Filter,
  Download,
  Trash,
  Mail,
  Phone
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, a
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  lastOrderDate: Date;
}

const mockCustomers: Customer[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `cust-${i + 1}`,
  name: `عميل ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: `+966 50 ${Math.floor(1000000 + Math.random() * 9000000)}`,
  totalOrders: Math.floor(1 + Math.random() * 20),
  totalSpent: Math.floor(100 + Math.random() * 9000),
  status: Math.random() > 0.2 ? "active" : "inactive",
  lastOrderDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)
}));

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("ر.س");
  
  useEffect(() => {
    // Simulate loading
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setCustomers(mockCustomers);
      } catch (error) {
        console.error("Error loading customers:", error);
        toast.error("حدث خطأ أثناء تحميل بيانات العملاء");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.includes(searchTerm) || 
    customer.email.includes(searchTerm) ||
    customer.phone.includes(searchTerm)
  );
  
  const stats = {
    totalCustomers: customers.length,
    newCustomers: 3,
    returningCustomers: 5,
    loyalCustomers: customers.filter(c => c.totalOrders > 5).length
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">نشط</Badge>;
      case "inactive":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">غير نشط</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              العملاء
            </h1>
            <p className="text-gray-600">إدارة وتحليل قاعدة العملاء لديك</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white">
              <Download className="ml-2 h-4 w-4" />
              تصدير
            </Button>
            <Button>
              <UserPlus className="ml-2 h-4 w-4" />
              إضافة عميل
            </Button>
          </div>
        </div>
        
        <CustomerStats 
          totalCustomers={stats.totalCustomers}
          newCustomers={stats.newCustomers}
          returningCustomers={stats.returningCustomers}
          loyalCustomers={stats.loyalCustomers}
          currencySymbol={currency}
        />
        
        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
            <TabsList className="bg-gray-100 p-1 mb-0">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">الكل</TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">نشط</TabsTrigger>
              <TabsTrigger value="inactive" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">غير نشط</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="بحث عن عميل..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 w-full"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>العميل</TableHead>
                      <TableHead>الحالة</TableHead>
                      <TableHead>عدد الطلبات</TableHead>
                      <TableHead>إجمالي المشتريات</TableHead>
                      <TableHead>آخر طلب</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`} className="animate-pulse">
                          <TableCell>
                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-6 bg-gray-200 rounded w-10"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-6 bg-gray-200 rounded w-24"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-6 bg-gray-200 rounded w-8"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <TableRow key={customer.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{customer.name}</div>
                              <div className="text-muted-foreground text-xs flex items-center gap-2">
                                <span className="flex items-center">
                                  <Mail className="h-3 w-3 ml-1" />
                                  {customer.email}
                                </span>
                                <span className="flex items-center">
                                  <Phone className="h-3 w-3 ml-1" />
                                  {customer.phone}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(customer.status)}</TableCell>
                          <TableCell>{customer.totalOrders}</TableCell>
                          <TableCell>{currency} {customer.totalSpent.toLocaleString()}</TableCell>
                          <TableCell>{formatDate(customer.lastOrderDate)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                <DropdownMenuItem>عرض التفاصيل</DropdownMenuItem>
                                <DropdownMenuItem>تعديل البيانات</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash className="ml-2 h-4 w-4" />
                                  حذف العميل
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          <div className="flex flex-col items-center">
                            <UserPlus className="h-10 w-10 text-gray-300 mb-2" />
                            <p className="text-gray-500">لا يوجد عملاء مطابقين لبحثك</p>
                            <Button variant="link" onClick={() => setSearchTerm("")}>
                              إظهار جميع العملاء
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>العملاء النشطون</CardTitle>
              </CardHeader>
              <CardContent>
                <p>قائمة العملاء النشطين الذين قاموا بطلبات خلال آخر 90 يوم.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inactive">
            <Card>
              <CardHeader>
                <CardTitle>العملاء غير النشطين</CardTitle>
              </CardHeader>
              <CardContent>
                <p>قائمة العملاء غير النشطين الذين لم يقوموا بطلبات خلال آخر 90 يوم.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  );
};

export default Customers;
