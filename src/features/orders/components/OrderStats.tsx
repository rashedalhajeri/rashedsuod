
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Clock, Box, TruckIcon, CheckCircle2, XCircle } from "lucide-react";

interface OrderStats {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface OrderStatsProps {
  stats: OrderStats;
  isLoading?: boolean;
}

const OrderStats: React.FC<OrderStatsProps> = ({ 
  stats, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 w-8 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-3 w-16 bg-gray-200 rounded mx-auto mt-2"></div>
                <div className="h-5 w-6 bg-gray-200 rounded mx-auto mt-1"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium flex items-center">
          <ShoppingBag className="h-5 w-5 inline-block ml-2" />
          إحصائيات الطلبات
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-5 w-5 text-gray-700" />
            </div>
            <p className="text-xs text-gray-500 mt-1">الإجمالي</p>
            <p className="text-lg font-semibold">{stats.total}</p>
          </div>
          
          <div className="text-center">
            <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="h-5 w-5 text-amber-700" />
            </div>
            <p className="text-xs text-gray-500 mt-1">قيد الانتظار</p>
            <p className="text-lg font-semibold text-amber-700">{stats.pending}</p>
          </div>
          
          <div className="text-center">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Box className="h-5 w-5 text-blue-700" />
            </div>
            <p className="text-xs text-gray-500 mt-1">قيد المعالجة</p>
            <p className="text-lg font-semibold text-blue-700">{stats.processing}</p>
          </div>
          
          <div className="text-center">
            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <TruckIcon className="h-5 w-5 text-indigo-700" />
            </div>
            <p className="text-xs text-gray-500 mt-1">تم الشحن</p>
            <p className="text-lg font-semibold text-indigo-700">{stats.shipped}</p>
          </div>
          
          <div className="text-center">
            <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-5 w-5 text-green-700" />
            </div>
            <p className="text-xs text-gray-500 mt-1">تم التوصيل</p>
            <p className="text-lg font-semibold text-green-700">{stats.delivered}</p>
          </div>
          
          <div className="text-center">
            <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-5 w-5 text-red-700" />
            </div>
            <p className="text-xs text-gray-500 mt-1">ملغي</p>
            <p className="text-lg font-semibold text-red-700">{stats.cancelled}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderStats;
