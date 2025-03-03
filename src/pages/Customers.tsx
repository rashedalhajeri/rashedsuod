
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { CustomerStats } from "@/components/customer/CustomerStats";
import { UserPlus, Search, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";

// Mock customer data until we connect to Supabase
const mockCustomers = [
  {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966 55 123 4567',
    totalOrders: 5,
    totalSpent: 1250.75,
    lastOrder: '2023-04-15',
    status: 'نشط',
    type: 'مخلص'
  },
  {
    id: '2',
    name: 'سارة علي',
    email: 'sara@example.com',
    phone: '+966 55 765 4321',
    totalOrders: 3,
    totalSpent: 520.50,
    lastOrder: '2023-04-10',
    status: 'نشط',
    type: 'جديد'
  },
  {
    id: '3',
    name: 'خالد عبدالله',
    email: 'khalid@example.com',
    phone: '+966 50 111 2222',
    totalOrders: 12,
    totalSpent: 3100.00,
    lastOrder: '2023-04-18',
    status: 'نشط',
    type: 'عائد'
  },
  {
    id: '4',
    name: 'فاطمة يوسف',
    email: 'fatima@example.com',
    phone: '+966 55 333 4444',
    totalOrders: 1,
    totalSpent: 150.25,
    lastOrder: '2023-03-20',
    status: 'غير نشط',
    type: 'جديد'
  },
  {
    id: '5',
    name: 'عبدالرحمن ناصر',
    email: 'abdulrahman@example.com',
    phone: '+966 54 555 6666',
    totalOrders: 8,
    totalSpent: 1870.30,
    lastOrder: '2023-04-16',
    status: 'نشط',
    type: 'مخلص'
  }
];

const Customers = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [customers, setCustomers] = useState([...mockCustomers]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Stats for the CustomerStats component
  const stats = {
    totalCustomers: customers.length,
    newCustomers: customers.filter(c => c.type === 'جديد').length,
    returningCustomers: customers.filter(c => c.type === 'عائد').length,
    loyalCustomers: customers.filter(c => c.type === 'مخلص').length,
    averageSpend: customers.length > 0 
      ? parseFloat((customers.reduce((total, customer) => total + customer.totalSpent, 0) / customers.length).toFixed(2))
      : 0
  };

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleAddCustomer = () => {
    toast({
      title: "قريباً",
      description: "ستتمكن من إضافة عملاء جدد قريباً",
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
      
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'active' && customer.status === 'نشط') ||
      (filterStatus === 'inactive' && customer.status === 'غير نشط') ||
      (filterStatus === 'new' && customer.type === 'جديد') ||
      (filterStatus === 'returning' && customer.type === 'عائد') ||
      (filterStatus === 'loyal' && customer.type === 'مخلص');
      
    return matchesSearch && matchesFilter;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const statusColorMap: Record<string, string> = {
    'نشط': 'bg-green-100 text-green-800',
    'غير نشط': 'bg-gray-100 text-gray-800'
  };
  
  const typeColorMap: Record<string, string> = {
    'جديد': 'bg-blue-100 text-blue-800',
    'عائد': 'bg-purple-100 text-purple-800',
    'مخلص': 'bg-amber-100 text-amber-800'
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">العملاء</h2>
            <p className="text-muted-foreground">
              إدارة قاعدة عملائك وتتبع تفاعلاتهم
            </p>
          </div>
          <Button onClick={handleAddCustomer} className="md:self-end">
            <UserPlus className="ml-2 h-4 w-4" />
            إضافة عميل جديد
          </Button>
        </div>
        
        <CustomerStats
          totalCustomers={stats.totalCustomers}
          newCustomers={stats.newCustomers}
          returningCustomers={stats.returningCustomers}
          loyalCustomers={stats.loyalCustomers}
          averageSpend={stats.averageSpend}
          isLoading={isLoading}
          currencySymbol="ر.س"
        />
        
        <Card>
          <CardHeader className="flex flex-col md:flex-row justify-between md:items-center space-y-2 md:space-y-0">
            <CardTitle>قائمة العملاء</CardTitle>
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="بحث عن عميل..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="pl-9 pr-9"
                />
                {searchQuery && (
                  <button 
                    onClick={clearSearch}
                    className="absolute right-3 top-3"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 ml-2" />
                    فلتر
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                    الكل
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                    نشط
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                    غير نشط
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('new')}>
                    جديد
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('returning')}>
                    عائد
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterStatus('loyal')}>
                    مخلص
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">جميع العملاء</TabsTrigger>
                <TabsTrigger value="new">عملاء جدد</TabsTrigger>
                <TabsTrigger value="vip">كبار العملاء</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between items-center p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-40 mb-2" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    ))}
                  </div>
                ) : filteredCustomers.length === 0 ? (
                  <div className="text-center p-8 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">لا يوجد عملاء مطابقين للبحث</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>العميل</TableHead>
                          <TableHead>التواصل</TableHead>
                          <TableHead>الطلبات</TableHead>
                          <TableHead>إجمالي الإنفاق</TableHead>
                          <TableHead>آخر طلب</TableHead>
                          <TableHead>الحالة</TableHead>
                          <TableHead>النوع</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map((customer) => (
                          <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                </Avatar>
                                <span>{customer.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="text-sm">{customer.email}</span>
                                <span className="text-xs text-muted-foreground">{customer.phone}</span>
                              </div>
                            </TableCell>
                            <TableCell>{customer.totalOrders}</TableCell>
                            <TableCell>
                              <span className="font-semibold">{customer.totalSpent.toFixed(2)}</span>
                              <span className="text-xs mr-1">ر.س</span>
                            </TableCell>
                            <TableCell>{new Date(customer.lastOrder).toLocaleDateString('ar-SA')}</TableCell>
                            <TableCell>
                              <Badge className={statusColorMap[customer.status]}>{customer.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className={typeColorMap[customer.type]}>{customer.type}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="new">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex justify-between items-center p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-40 mb-2" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>العميل</TableHead>
                          <TableHead>التواصل</TableHead>
                          <TableHead>الطلبات</TableHead>
                          <TableHead>إجمالي الإنفاق</TableHead>
                          <TableHead>تاريخ الانضمام</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers
                          .filter(c => c.type === 'جديد')
                          .map((customer) => (
                            <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                  </Avatar>
                                  <span>{customer.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-sm">{customer.email}</span>
                                  <span className="text-xs text-muted-foreground">{customer.phone}</span>
                                </div>
                              </TableCell>
                              <TableCell>{customer.totalOrders}</TableCell>
                              <TableCell>
                                <span className="font-semibold">{customer.totalSpent.toFixed(2)}</span>
                                <span className="text-xs mr-1">ر.س</span>
                              </TableCell>
                              <TableCell>{new Date(customer.lastOrder).toLocaleDateString('ar-SA')}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="vip">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex justify-between items-center p-4 border rounded-md">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-40 mb-2" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-8 w-20" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>العميل</TableHead>
                          <TableHead>التواصل</TableHead>
                          <TableHead>الطلبات</TableHead>
                          <TableHead>إجمالي الإنفاق</TableHead>
                          <TableHead>آخر طلب</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {customers
                          .filter(c => c.type === 'مخلص')
                          .map((customer) => (
                            <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                                  </Avatar>
                                  <span>{customer.name}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="text-sm">{customer.email}</span>
                                  <span className="text-xs text-muted-foreground">{customer.phone}</span>
                                </div>
                              </TableCell>
                              <TableCell>{customer.totalOrders}</TableCell>
                              <TableCell>
                                <span className="font-semibold">{customer.totalSpent.toFixed(2)}</span>
                                <span className="text-xs mr-1">ر.س</span>
                              </TableCell>
                              <TableCell>{new Date(customer.lastOrder).toLocaleDateString('ar-SA')}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Customers;
