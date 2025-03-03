
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useStoreData } from "@/hooks/use-store-data";
import {
  Calendar,
  Download,
  Eye,
  Filter,
  MoreHorizontal,
  Package,
  Search,
  Trash2,
} from "lucide-react";

// استخدام بيانات تجريبية للطلبات
const dummyOrders = [
  {
    id: "ORD-001",
    customer: "أحمد محمد",
    date: "2023-06-15",
    status: "مكتمل",
    total: 350,
    items: 3,
  },
  {
    id: "ORD-002",
    customer: "سارة خالد",
    date: "2023-06-14",
    status: "قيد التجهيز",
    total: 420,
    items: 2,
  },
  {
    id: "ORD-003",
    customer: "محمد علي",
    date: "2023-06-13",
    status: "قيد الشحن",
    total: 180,
    items: 1,
  },
  {
    id: "ORD-004",
    customer: "فاطمة أحمد",
    date: "2023-06-12",
    status: "مكتمل",
    total: 550,
    items: 4,
  },
  {
    id: "ORD-005",
    customer: "خالد محمود",
    date: "2023-06-11",
    status: "ملغي",
    total: 220,
    items: 2,
  },
  {
    id: "ORD-006",
    customer: "نورا حسن",
    date: "2023-06-10",
    status: "مكتمل",
    total: 320,
    items: 3,
  },
  {
    id: "ORD-007",
    customer: "عمر سعيد",
    date: "2023-06-09",
    status: "قيد التجهيز",
    total: 490,
    items: 5,
  },
];

const Orders = () => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const { data: storeData } = useStoreData();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleOrderSelection = (orderId: string, selected: boolean) => {
    if (selected) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedOrders(dummyOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "مكتمل":
        return <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>;
      case "قيد التجهيز":
        return <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>;
      case "قيد الشحن":
        return <Badge className="bg-orange-500 hover:bg-orange-600">{status}</Badge>;
      case "ملغي":
        return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // تصفية الطلبات بناءً على البحث والحالة
  const filteredOrders = dummyOrders.filter((order) => {
    const matchesSearch =
      searchTerm === "" ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">الطلبات</h1>
          <p className="text-muted-foreground mt-1">إدارة طلبات متجرك</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            تصفية حسب التاريخ
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            تصدير
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>جميع الطلبات</CardTitle>
          <CardDescription>
            إدارة ومتابعة جميع طلبات متجرك
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row justify-between p-4 space-y-3 md:space-y-0">
            <div className="flex w-full md:w-1/3 items-center relative">
              <Search className="absolute right-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث عن طلب..."
                className="pl-3 pr-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Select
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="مكتمل">مكتمل</SelectItem>
                  <SelectItem value="قيد التجهيز">قيد التجهيز</SelectItem>
                  <SelectItem value="قيد الشحن">قيد الشحن</SelectItem>
                  <SelectItem value="ملغي">ملغي</SelectItem>
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
                        selectedOrders.length === filteredOrders.length && filteredOrders.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>المنتجات</TableHead>
                  <TableHead>الإجمالي</TableHead>
                  <TableHead className="text-left">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={(checked) =>
                            handleOrderSelection(order.id, !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.items}</TableCell>
                      <TableCell>{order.total} ريال</TableCell>
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
                              <Eye className="mr-2 h-4 w-4" />
                              عرض التفاصيل
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Package className="mr-2 h-4 w-4" />
                              تحديث الحالة
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              إلغاء الطلب
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center h-32">
                      لا توجد طلبات متطابقة مع معايير البحث
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {selectedOrders.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <span className="text-sm">
                تم تحديد {selectedOrders.length} طلب
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedOrders([])}>
                  إلغاء التحديد
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  حذف المحدد
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center p-8 text-muted-foreground">
        <p>
          هل تواجه مشكلة في إدارة الطلبات؟{" "}
          <Link to="/dashboard/support" className="text-primary hover:underline">
            تواصل مع الدعم
          </Link>
        </p>
        <p className="mt-2">
          <Link to="/dashboard/help/orders" className="text-primary hover:underline">
            مركز المساعدة - إدارة الطلبات
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Orders;
