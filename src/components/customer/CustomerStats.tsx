
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, UserMinus, ShoppingBag } from "lucide-react";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

interface CustomerStatsProps {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageSpend: number;
  currency: string;
}

const CustomerStats: React.FC<CustomerStatsProps> = ({
  totalCustomers,
  newCustomers,
  returningCustomers,
  averageSpend,
  currency
}) => {
  const formatCurrency = getCurrencyFormatter(currency);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs text-muted-foreground">
            عميل مسجل في المتجر
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">عملاء جدد</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newCustomers}</div>
          <p className="text-xs text-muted-foreground">
            في آخر 30 يوم
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">عملاء عائدون</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{returningCustomers}</div>
          <p className="text-xs text-muted-foreground">
            عميل قام بأكثر من طلب
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">متوسط الإنفاق</CardTitle>
          <UserMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(averageSpend)}</div>
          <p className="text-xs text-muted-foreground">
            لكل عميل
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerStats;
