
import React from "react";
import { useFormatter } from "@/hooks/use-formatter";
import { usePlatformStats, PlatformStats } from "@/hooks/use-platform-stats";
import PlatformStatCard from "./PlatformStatCard";
import { Store, ShoppingCart, AlertCircle, DollarSign, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const PlatformStatsSection = () => {
  const { data: stats, isLoading, error } = usePlatformStats();
  const formatter = useFormatter();
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  if (error || !stats) {
    return <ErrorState />;
  }
  
  return (
    <div className="w-full mb-6">
      <h2 className="text-xl font-semibold mb-4">إحصائيات المنصة</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <PlatformStatCard
          title="إجمالي المتاجر"
          value={stats.total_stores}
          icon={<Store className="h-5 w-5" />}
          description="جميع المتاجر المسجلة في المنصة"
          delay={0}
        />
        
        <PlatformStatCard
          title="المتاجر النشطة"
          value={stats.active_stores}
          icon={<Activity className="h-5 w-5" />}
          iconClassName="bg-green-100 text-green-600"
          description={`${Math.round((stats.active_stores / (stats.total_stores || 1)) * 100)}% من إجمالي المتاجر`}
          delay={1}
        />
        
        <PlatformStatCard
          title="المتاجر المعلقة"
          value={stats.suspended_stores}
          icon={<AlertCircle className="h-5 w-5" />}
          iconClassName="bg-red-100 text-red-600"
          description={`${Math.round((stats.suspended_stores / (stats.total_stores || 1)) * 100)}% من إجمالي المتاجر`}
          delay={2}
        />
        
        <PlatformStatCard
          title="إجمالي الطلبات"
          value={stats.total_orders}
          icon={<ShoppingCart className="h-5 w-5" />}
          iconClassName="bg-blue-100 text-blue-600"
          delay={3}
        />
        
        <PlatformStatCard
          title="إجمالي الإيرادات"
          value={formatter.currency(stats.total_revenue)}
          icon={<DollarSign className="h-5 w-5" />}
          iconClassName="bg-amber-100 text-amber-600"
          delay={4}
        />
      </div>
      
      <div className="mt-2 text-xs text-muted-foreground text-left">
        آخر تحديث: {formatter.date(new Date(stats.updated_at))}
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="w-full mb-6">
    <h2 className="text-xl font-semibold mb-4">إحصائيات المنصة</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array(5).fill(0).map((_, i) => (
        <Card key={i} className="h-full">
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

const ErrorState = () => (
  <div className="w-full mb-6">
    <h2 className="text-xl font-semibold mb-4">إحصائيات المنصة</h2>
    <Card className="bg-red-50 border-red-200">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center text-red-600">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>حدث خطأ أثناء تحميل إحصائيات المنصة. يرجى المحاولة مرة أخرى لاحقًا.</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default PlatformStatsSection;
