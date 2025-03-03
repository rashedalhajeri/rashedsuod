
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoreData } from "@/hooks/use-store-data";
import SalesChart from "@/features/dashboard/components/SalesChart";
import StatsCard from "@/features/dashboard/components/StatsCard";
import WelcomeSection from "@/features/dashboard/components/WelcomeSection";
import RecentOrders from "@/features/dashboard/components/RecentOrders";
import RecentProducts from "@/features/dashboard/components/RecentProducts";
import { LayoutDashboard, ShoppingBag, Package, Users, ChevronLeft, Activity } from "lucide-react";

const Home = () => {
  const { data: storeData, isLoading } = useStoreData();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1>
      </div>

      <WelcomeSection storeName={storeData?.store_name} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="إجمالي المبيعات"
          value="2,350 ريال"
          description="↗️ زيادة 14% عن الشهر الماضي"
          icon={<ShoppingBag className="h-5 w-5 text-primary" />}
        />
        <StatsCard
          title="الطلبات"
          value="23"
          description="↘️ انخفاض 5% عن الشهر الماضي"
          icon={<ShoppingBag className="h-5 w-5 text-orange-500" />}
        />
        <StatsCard
          title="المنتجات"
          value="45"
          description="تم إضافة 5 منتجات جديدة"
          icon={<Package className="h-5 w-5 text-blue-500" />}
        />
        <StatsCard
          title="عدد العملاء"
          value="15"
          description="↗️ زيادة 20% عن الشهر الماضي"
          icon={<Users className="h-5 w-5 text-green-500" />}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          <TabsTrigger value="activity">النشاطات</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>مخطط المبيعات</CardTitle>
                <CardDescription>
                  المبيعات والطلبات خلال الأشهر الماضية
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2">
                <SalesChart />
              </CardContent>
            </Card>
            <div className="col-span-3 flex flex-col gap-4">
              <RecentOrders />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <RecentProducts />
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>التحليلات</CardTitle>
              <CardDescription>
                هذه الميزة قيد التطوير وستكون متاحة قريباً
              </CardDescription>
            </CardHeader>
            <CardContent className="h-64 flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  ميزة التحليلات قيد التطوير وستكون متاحة في تحديث قادم
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>النشاطات الأخيرة</CardTitle>
              <CardDescription>
                سجل النشاطات في متجرك
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[400px]">
                {/* قائمة النشاطات - ستكون متاحة في تحديث قادم */}
                <div className="py-12 text-center text-muted-foreground">
                  سجل النشاطات قيد التطوير وسيكون متاحاً قريباً
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;
