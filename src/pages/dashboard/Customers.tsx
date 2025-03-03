
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Mail, UserPlus, Filter } from "lucide-react";
import { useStoreData } from "@/hooks/use-store-data";

// العملاء التجريبية
const dummyCustomers = [
  {
    id: "1",
    name: "محمد أحمد",
    email: "mohamed@example.com",
    phone: "+966512345678",
    orders: 8,
    totalSpent: 1250,
    lastOrder: "2023-06-15",
  },
  {
    id: "2",
    name: "فاطمة علي",
    email: "fatima@example.com",
    phone: "+966523456789",
    orders: 5,
    totalSpent: 850,
    lastOrder: "2023-06-10",
  },
  {
    id: "3",
    name: "أحمد محمود",
    email: "ahmed@example.com",
    phone: "+966534567890",
    orders: 3,
    totalSpent: 520,
    lastOrder: "2023-06-05",
  },
  {
    id: "4",
    name: "سارة محمد",
    email: "sara@example.com",
    phone: "+966545678901",
    orders: 12,
    totalSpent: 2200,
    lastOrder: "2023-06-18",
  },
  {
    id: "5",
    name: "عمر خالد",
    email: "omar@example.com",
    phone: "+966556789012",
    orders: 2,
    totalSpent: 350,
    lastOrder: "2023-05-28",
  },
];

// مكون CustomerStats المخصص
const CustomerStats = ({ newCustomers, totalCustomers, totalSpent }: { 
  newCustomers: number;
  totalCustomers: number;
  totalSpent: number;
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">
            +{newCustomers} عميل جديد هذا الشهر
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSpent} ريال</div>
          <p className="text-xs text-muted-foreground">
            متوسط 430 ريال لكل عميل
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">معدل التفاعل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">68%</div>
          <p className="text-xs text-muted-foreground">
            زيادة 12% عن الشهر الماضي
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const Customers = () => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: storeData } = useStoreData();

  const handleCustomerSelection = (customerId: string, selected: boolean) => {
    if (selected) {
      setSelectedCustomers((prev) => [...prev, customerId]);
    } else {
      setSelectedCustomers((prev) =>
        prev.filter((id) => id !== customerId)
      );
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedCustomers(dummyCustomers.map((customer) => customer.id));
    } else {
      setSelectedCustomers([]);
    }
  };

  // تصفية العملاء بناءً على البحث
  const filteredCustomers = dummyCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  // إحصائيات العملاء
  const totalSpent = dummyCustomers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">العملاء</h1>
          <p className="text-muted-foreground mt-1">إدارة قاعدة عملائك</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          إضافة عميل
        </Button>
      </div>

      {/* إحصائيات العملاء */}
      <CustomerStats
        newCustomers={3}
        totalCustomers={dummyCustomers.length}
        totalSpent={totalSpent}
      />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>جميع العملاء</CardTitle>
          <CardDescription>
            عرض وإدارة جميع عملائك
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row justify-between p-4 space-y-3 md:space-y-0">
            <div className="flex w-full md:w-1/3 items-center relative">
              <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن عميل..."
                className="pl-3 pr-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="جميع العملاء" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع العملاء</SelectItem>
                  <SelectItem value="active">العملاء النشطين</SelectItem>
                  <SelectItem value="new">العملاء الجدد</SelectItem>
                  <SelectItem value="vip">كبار العملاء</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]">
                    <Checkbox
                      checked={
                        selectedCustomers.length === filteredCustomers.length &&
                        filteredCustomers.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>اسم العميل</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>رقم الهاتف</TableHead>
                  <TableHead>عدد الطلبات</TableHead>
                  <TableHead>إجمالي المشتريات</TableHead>
                  <TableHead>آخر طلب</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCustomers.includes(customer.id)}
                          onCheckedChange={(checked) =>
                            handleCustomerSelection(customer.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.orders}</TableCell>
                      <TableCell>{customer.totalSpent} ريال</TableCell>
                      <TableCell>{customer.lastOrder}</TableCell>
                      <TableCell className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>إجراءات</DropdownMenuLabel>
                            <DropdownMenuItem>
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              إرسال بريد إلكتروني
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              تعديل البيانات
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-32">
                      لا يوجد عملاء متطابقين مع معايير البحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {selectedCustomers.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-sm">
                تم تحديد {selectedCustomers.length} عميل
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedCustomers([])}>
                  إلغاء التحديد
                </Button>
                <Button variant="secondary" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  إرسال بريد إلكتروني
                </Button>
                <Button variant="destructive" size="sm">
                  حذف المحدد
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
