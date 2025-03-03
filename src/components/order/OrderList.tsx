
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Eye, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ar } from "date-fns/locale";

// Mock data for orders
const generateMockOrders = () => {
  const statusOptions = [
    { value: "pending", label: "قيد الانتظار", color: "warning" },
    { value: "processing", label: "قيد المعالجة", color: "warning" },
    { value: "shipped", label: "تم الشحن", color: "info" },
    { value: "delivered", label: "تم التسليم", color: "success" },
    { value: "cancelled", label: "ملغي", color: "destructive" },
    { value: "refunded", label: "مسترجع", color: "destructive" },
  ];

  const paymentStatusOptions = [
    { value: "paid", label: "مدفوع", color: "success" },
    { value: "pending", label: "قيد الانتظار", color: "warning" },
    { value: "failed", label: "فشل الدفع", color: "destructive" },
    { value: "refunded", label: "تم استرداد المبلغ", color: "destructive" },
  ];

  const customerNames = [
    "أحمد محمد",
    "سارة عبدالله",
    "محمد علي",
    "فاطمة أحمد",
    "عبدالرحمن محمد",
    "نورة خالد",
    "عبدالله محمد",
    "ريم سعيد",
    "خالد يوسف",
    "لمياء عبدالعزيز",
  ];

  const randomDate = (start: Date, end: Date) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const orders = [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  for (let i = 1; i <= 30; i++) {
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const paymentStatus = paymentStatusOptions[Math.floor(Math.random() * paymentStatusOptions.length)];
    const customer = customerNames[Math.floor(Math.random() * customerNames.length)];
    const orderDate = randomDate(thirtyDaysAgo, now);
    const total = Math.floor(Math.random() * 1000) + 50;
    const itemCount = Math.floor(Math.random() * 5) + 1;

    orders.push({
      id: `ORDER-${10000 + i}`,
      customer,
      status: status.value,
      statusLabel: status.label,
      statusColor: status.color,
      paymentStatus: paymentStatus.value,
      paymentStatusLabel: paymentStatus.label,
      paymentStatusColor: paymentStatus.color,
      date: orderDate,
      dateFormatted: formatDistanceToNow(orderDate, { addSuffix: true, locale: ar }),
      total,
      itemCount,
      products: Array.from({ length: itemCount }, (_, j) => ({
        id: `PROD-${j + 1}`,
        name: `منتج ${j + 1}`,
        price: Math.floor(Math.random() * 200) + 50,
        quantity: Math.floor(Math.random() * 3) + 1,
      })),
    });
  }

  return orders;
};

type OrderListProps = {
  searchQuery: string;
  statusFilter: string;
  dateRangeFilter: string;
  onOpenDetails: (orderId: string) => void;
};

const OrderList = ({
  searchQuery,
  statusFilter,
  dateRangeFilter,
  onOpenDetails,
}: OrderListProps) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);

  useEffect(() => {
    // Simulate API call
    setOrders(generateMockOrders());
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Apply date range filter
    if (dateRangeFilter && dateRangeFilter !== "all") {
      const now = new Date();
      let fromDate: Date;

      switch (dateRangeFilter) {
        case "today":
          fromDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "yesterday":
          fromDate = new Date(now);
          fromDate.setDate(fromDate.getDate() - 1);
          fromDate.setHours(0, 0, 0, 0);
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(23, 59, 59, 999);
          filtered = filtered.filter(
            (order) => order.date >= fromDate && order.date <= yesterday
          );
          break;
        case "last7days":
          fromDate = new Date(now);
          fromDate.setDate(fromDate.getDate() - 7);
          filtered = filtered.filter((order) => order.date >= fromDate);
          break;
        case "last30days":
          fromDate = new Date(now);
          fromDate.setDate(fromDate.getDate() - 30);
          filtered = filtered.filter((order) => order.date >= fromDate);
          break;
        default:
          break;
      }
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customer.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter, dateRangeFilter]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const toggleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter((id) => id !== orderId));
    }
  };

  const getStatusBadgeVariant = (statusColor: string) => {
    switch (statusColor) {
      case "success":
        return "success";
      case "warning":
        return "warning";
      case "destructive":
        return "destructive";
      case "info":
        return "info";
      default:
        return "secondary";
    }
  };

  const isAllSelected = filteredOrders.length > 0 && selectedOrders.length === filteredOrders.length;

  if (filteredOrders.length === 0) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 opacity-50"
          >
            <path d="M16 16h6"></path>
            <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
            <path d="M7.5 4.27l9 5.15"></path>
            <path d="M3.29 7 12 12l8.71-5"></path>
            <path d="M12 22V12"></path>
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold">لا توجد طلبات</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          لا توجد طلبات تطابق معايير البحث الحالية.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="h-12 px-4 text-right">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={toggleSelectAll}
                aria-label="Select all"
              />
            </th>
            <th className="h-12 px-4 text-right font-medium">رقم الطلب</th>
            <th className="h-12 px-4 text-right font-medium">العميل</th>
            <th className="h-12 px-4 text-right font-medium">الحالة</th>
            <th className="h-12 px-4 text-right font-medium">حالة الدفع</th>
            <th className="h-12 px-4 text-right font-medium">المبلغ</th>
            <th className="h-12 px-4 text-right font-medium">التاريخ</th>
            <th className="h-12 px-4 text-right font-medium">العمليات</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr
              key={order.id}
              className="border-b transition-colors hover:bg-muted/50"
            >
              <td className="p-4 align-middle">
                <Checkbox
                  checked={selectedOrders.includes(order.id)}
                  onCheckedChange={(checked) =>
                    toggleSelectOrder(order.id, !!checked)
                  }
                  aria-label={`Select order ${order.id}`}
                />
              </td>
              <td className="p-4 align-middle font-medium">{order.id}</td>
              <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <div className="flex h-full w-full items-center justify-center bg-muted font-semibold">
                      {order.customer.charAt(0)}
                    </div>
                  </Avatar>
                  <span>{order.customer}</span>
                </div>
              </td>
              <td className="p-4 align-middle">
                <Badge
                  variant={getStatusBadgeVariant(order.statusColor) as any}
                  className="whitespace-nowrap"
                >
                  {order.statusLabel}
                </Badge>
              </td>
              <td className="p-4 align-middle">
                <Badge
                  variant={getStatusBadgeVariant(order.paymentStatusColor) as any}
                  className="whitespace-nowrap"
                >
                  {order.paymentStatusLabel}
                </Badge>
              </td>
              <td className="p-4 align-middle font-medium">
                {order.total} ر.س
              </td>
              <td className="p-4 align-middle text-muted-foreground">
                {order.dateFormatted}
              </td>
              <td className="p-4 align-middle">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenDetails(order.id)}
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">عرض</span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">المزيد</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onOpenDetails(order.id)}>
                        عرض التفاصيل
                      </DropdownMenuItem>
                      <DropdownMenuItem>طباعة الفاتورة</DropdownMenuItem>
                      <DropdownMenuItem>تحديث الحالة</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        إلغاء الطلب
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
