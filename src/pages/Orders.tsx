
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { 
  Package, Search, Filter, ArrowDownUp, Printer, 
  Download, CalendarRange, Tags, Clock, CheckCircle2, 
  TruckIcon, ShoppingBag, AlertCircle, XCircle, BarChart4
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { OrderList } from "@/components/order/OrderList";
import { OrderDetails } from "@/components/order/OrderDetails";
import { OrderFilters } from "@/components/order/OrderFilters";
import { OrderStats } from "@/components/order/OrderStats";
import { EmptyState } from "@/components/ui/empty-state";

// Order status types
export type OrderStatus = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "cancelled" 
  | "returned";

// Order object type
export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  date: string;
  status: OrderStatus;
  total: number;
  payment_method: string;
  items: OrderItem[];
  shipping_address?: string;
  tracking_number?: string;
  notes?: string;
}

// Order item type
export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  variant?: string;
}

const Orders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "1",
        order_number: "ORD-2023-001",
        customer_name: "أحمد محمد",
        customer_phone: "+965 555 1234",
        customer_email: "ahmed@example.com",
        date: "2023-06-15T14:30:00Z",
        status: "delivered",
        total: 79.50,
        payment_method: "بطاقة ائتمان",
        items: [
          {
            id: "item1",
            product_id: "prod1",
            product_name: "قميص قطني",
            product_image: "https://via.placeholder.com/50",
            quantity: 2,
            price: 29.75,
            variant: "أزرق / وسط"
          },
          {
            id: "item2",
            product_id: "prod2",
            product_name: "بنطلون جينز",
            product_image: "https://via.placeholder.com/50",
            quantity: 1,
            price: 20.00,
            variant: "أسود / 32"
          }
        ],
        shipping_address: "شارع السالم، بلوك 5، منزل 10، الكويت",
        tracking_number: "TRK123456789",
        notes: "ترك الطلب عند الباب"
      },
      {
        id: "2",
        order_number: "ORD-2023-002",
        customer_name: "فاطمة عبدالله",
        customer_phone: "+965 555 5678",
        date: "2023-06-14T09:15:00Z",
        status: "processing",
        total: 45.00,
        payment_method: "الدفع عند الاستلام",
        items: [
          {
            id: "item3",
            product_id: "prod3",
            product_name: "حقيبة يد",
            product_image: "https://via.placeholder.com/50",
            quantity: 1,
            price: 45.00
          }
        ],
        shipping_address: "شارع الخليج، بلوك 3، شقة 7، الكويت"
      },
      {
        id: "3",
        order_number: "ORD-2023-003",
        customer_name: "خالد العلي",
        customer_phone: "+965 555 9012",
        customer_email: "khalid@example.com",
        date: "2023-06-13T16:45:00Z",
        status: "pending",
        total: 120.25,
        payment_method: "بطاقة ائتمان",
        items: [
          {
            id: "item4",
            product_id: "prod4",
            product_name: "سماعات لاسلكية",
            product_image: "https://via.placeholder.com/50",
            quantity: 1,
            price: 89.99
          },
          {
            id: "item5",
            product_id: "prod5",
            product_name: "شاحن سريع",
            product_image: "https://via.placeholder.com/50",
            quantity: 2,
            price: 15.13
          }
        ],
        shipping_address: "شارع الجابر، بلوك 8، منزل 22، الكويت"
      },
      {
        id: "4",
        order_number: "ORD-2023-004",
        customer_name: "نورة الفهد",
        customer_phone: "+965 555 3456",
        date: "2023-06-12T11:20:00Z",
        status: "shipped",
        total: 65.75,
        payment_method: "بطاقة ائتمان",
        items: [
          {
            id: "item6",
            product_id: "prod6",
            product_name: "فستان صيفي",
            product_image: "https://via.placeholder.com/50",
            quantity: 1,
            price: 65.75,
            variant: "أحمر / صغير"
          }
        ],
        shipping_address: "شارع فهد السالم، بلوك 2، شقة 15، الكويت",
        tracking_number: "TRK987654321"
      },
      {
        id: "5",
        order_number: "ORD-2023-005",
        customer_name: "سعود القحطاني",
        customer_phone: "+965 555 7890",
        customer_email: "saud@example.com",
        date: "2023-06-11T13:10:00Z",
        status: "cancelled",
        total: 25.50,
        payment_method: "بطاقة ائتمان",
        items: [
          {
            id: "item7",
            product_id: "prod7",
            product_name: "قبعة رياضية",
            product_image: "https://via.placeholder.com/50",
            quantity: 1,
            price: 25.50,
            variant: "أبيض / موحد"
          }
        ],
        shipping_address: "شارع عبدالله السالم، بلوك 6، منزل 30، الكويت",
        notes: "تم إلغاء الطلب بواسطة العميل"
      }
    ];

    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
    setIsLoading(false);
  }, []);

  // Filter orders based on search query and active tab
  useEffect(() => {
    let result = [...orders];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.order_number.toLowerCase().includes(query) ||
        order.customer_name.toLowerCase().includes(query) ||
        order.customer_phone.includes(query) ||
        (order.customer_email && order.customer_email.toLowerCase().includes(query))
      );
    }
    
    // Filter by status tab
    if (activeTab !== "all") {
      result = result.filter(order => order.status === activeTab);
    }
    
    setFilteredOrders(result);
  }, [searchQuery, activeTab, orders]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-KW', { style: 'currency', currency: 'KWD' }).format(amount);
  };

  // Handler for selecting an order
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  // Order status counts
  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      processing: orders.filter(o => o.status === "processing").length,
      shipped: orders.filter(o => o.status === "shipped").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
      returned: orders.filter(o => o.status === "returned").length,
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">الطلبات</h1>
            <p className="text-muted-foreground">إدارة ومتابعة طلبات العملاء</p>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2 md:mt-0">
            <Button variant="outline" size="sm" className="gap-1">
              <Printer className="h-4 w-4" />
              <span>طباعة</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              <span>تصدير</span>
            </Button>
            <Button size="sm" className="gap-1">
              <Package className="h-4 w-4" />
              <span>إنشاء طلب جديد</span>
            </Button>
          </div>
        </div>

        <OrderStats />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
          {/* Filters and order list - takes 3 columns on desktop */}
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="بحث في الطلبات..."
                  className="pr-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? "bg-primary-50" : ""}
              >
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowDownUp className="h-4 w-4" />
              </Button>
            </div>

            {showFilters && <OrderFilters />}

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">
                  الكل
                  <Badge variant="secondary" className="mr-2">{statusCounts.all}</Badge>
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex-1">
                  جديد
                  <Badge variant="secondary" className="mr-2">{statusCounts.pending}</Badge>
                </TabsTrigger>
                <TabsTrigger value="processing" className="flex-1">
                  قيد المعالجة
                  <Badge variant="secondary" className="mr-2">{statusCounts.processing}</Badge>
                </TabsTrigger>
                <TabsTrigger value="shipped" className="flex-1">
                  تم الشحن
                  <Badge variant="secondary" className="mr-2">{statusCounts.shipped}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <OrderList 
                  orders={filteredOrders} 
                  onSelectOrder={handleSelectOrder}
                  selectedOrderId={selectedOrder?.id}
                  formatCurrency={formatCurrency}
                />
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                <OrderList 
                  orders={filteredOrders} 
                  onSelectOrder={handleSelectOrder}
                  selectedOrderId={selectedOrder?.id}
                  formatCurrency={formatCurrency}
                />
              </TabsContent>
              <TabsContent value="processing" className="mt-4">
                <OrderList 
                  orders={filteredOrders} 
                  onSelectOrder={handleSelectOrder}
                  selectedOrderId={selectedOrder?.id}
                  formatCurrency={formatCurrency}
                />
              </TabsContent>
              <TabsContent value="shipped" className="mt-4">
                <OrderList 
                  orders={filteredOrders} 
                  onSelectOrder={handleSelectOrder}
                  selectedOrderId={selectedOrder?.id}
                  formatCurrency={formatCurrency}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Order details - takes 4 columns on desktop */}
          <div className="md:col-span-4 space-y-4">
            {selectedOrder ? (
              <OrderDetails 
                order={selectedOrder} 
                formatCurrency={formatCurrency}
              />
            ) : (
              <EmptyState
                icon={<Package className="h-10 w-10 text-muted-foreground" />}
                title="لم يتم تحديد أي طلب"
                description="يرجى تحديد طلب من القائمة لعرض تفاصيله"
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
