
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/DashboardLayout";
import OrderList from "@/components/order/OrderList";
import OrderDetails from "@/components/order/OrderDetails";
import OrderFilters from "@/components/order/OrderFilters";
import OrderStats from "@/components/order/OrderStats";
import { Search, Filter, Download, Plus, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const Orders = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const totalOrders = 124;
  const pendingOrders = 32;
  const processingOrders = 15;
  const shippedOrders = 48;
  const deliveredOrders = 29;

  const handleOpenDetails = (orderId: string) => {
    setSelectedOrder(orderId);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedOrder(null);
  };

  const handleRefresh = () => {
    toast({
      title: "تحديث الطلبات",
      description: "تم تحديث قائمة الطلبات بنجاح",
    });
  };

  const handleExport = () => {
    toast({
      title: "تصدير الطلبات",
      description: "جاري تصدير قائمة الطلبات إلى ملف Excel",
    });
  };

  const handleCreateOrder = () => {
    toast({
      title: "إنشاء طلب جديد",
      description: "سيتم إضافة القدرة على إنشاء طلبات يدوية قريبًا",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">الطلبات</h2>
            <p className="text-muted-foreground">
              إدارة جميع طلبات العملاء ومتابعة حالتها
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              تحديث
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
            >
              <Download className="mr-2 h-4 w-4" />
              تصدير
            </Button>
            <Button
              size="sm"
              onClick={handleCreateOrder}
            >
              <Plus className="mr-2 h-4 w-4" />
              طلب جديد
            </Button>
          </div>
        </div>

        <OrderStats
          totalOrders={totalOrders}
          pendingOrders={pendingOrders}
          processingOrders={processingOrders}
          shippedOrders={shippedOrders}
          deliveredOrders={deliveredOrders}
        />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Tabs 
              defaultValue="all" 
              className="w-full" 
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">الكل ({totalOrders})</TabsTrigger>
                <TabsTrigger value="pending">قيد الانتظار ({pendingOrders})</TabsTrigger>
                <TabsTrigger value="processing">قيد المعالجة ({processingOrders})</TabsTrigger>
                <TabsTrigger value="shipped">تم الشحن ({shippedOrders})</TabsTrigger>
                <TabsTrigger value="delivered">تم التوصيل ({deliveredOrders})</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="البحث عن طلب بالاسم أو رقم الطلب أو رقم الهاتف..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="h-4 w-4" />
              فلترة
              <Badge variant="secondary" className="mr-2 rounded-sm px-1">
                {statusFilter !== "all" || dateRangeFilter !== "all" ? "2" : "0"}
              </Badge>
            </Button>
          </div>

          {isFiltersOpen && (
            <OrderFilters
              statusFilter={statusFilter}
              dateRangeFilter={dateRangeFilter}
              onStatusChange={setStatusFilter}
              onDateRangeChange={setDateRangeFilter}
              onClose={() => setIsFiltersOpen(false)}
            />
          )}

          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">قائمة الطلبات</CardTitle>
              <CardDescription>
                {totalOrders} طلب في النظام
              </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-350px)]">
                <OrderList
                  searchQuery={searchQuery}
                  statusFilter={statusFilter === "all" ? activeTab : statusFilter}
                  dateRangeFilter={dateRangeFilter}
                  onOpenDetails={handleOpenDetails}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {isDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-start justify-end overflow-hidden bg-background/80 p-0">
          <div className="absolute inset-0 bg-black/40" onClick={handleCloseDetails}></div>
          <div className="relative h-full w-full max-w-[90%] border-l bg-background shadow-xl animate-in slide-in-from-right md:max-w-2xl">
            <OrderDetails orderId={selectedOrder} onClose={handleCloseDetails} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Orders;
