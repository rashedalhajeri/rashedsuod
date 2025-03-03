
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircleDollarSign,
  Package,
  Truck,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface OrderStatsProps {
  totalOrders: number;
  completedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  currencySymbol: string;
}

export function OrderStats({
  totalOrders,
  completedOrders,
  processingOrders,
  shippedOrders,
  cancelledOrders,
  totalRevenue,
  currencySymbol
}: OrderStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              +12%
            </span>{" "}
            مقارنة بالشهر الماضي
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">قيد المعالجة</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{processingOrders}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-rose-500 inline-flex items-center">
              <ArrowDown className="mr-1 h-3 w-3" />
              -4%
            </span>{" "}
            مقارنة بالشهر الماضي
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">قيد الشحن</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{shippedOrders}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              +8%
            </span>{" "}
            مقارنة بالشهر الماضي
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} {currencySymbol}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 inline-flex items-center">
              <ArrowUp className="mr-1 h-3 w-3" />
              +16%
            </span>{" "}
            مقارنة بالشهر الماضي
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
