
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStoreData } from "@/hooks/use-store-data";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Activity,
} from "lucide-react";

// نستخدم بيانات تجريبية للتوضيح
const dummySalesData = [
  { month: "يناير", sales: 1200, orders: 42 },
  { month: "فبراير", sales: 1800, orders: 58 },
  { month: "مارس", sales: 1400, orders: 49 },
  { month: "أبريل", sales: 2000, orders: 62 },
  { month: "مايو", sales: 2400, orders: 78 },
  { month: "يونيو", sales: 1800, orders: 55 },
];

const dummyOrders = [
  { id: "ORD-001", customer: "أحمد محمد", date: "2023-06-15", status: "مكتمل", total: 350 },
  { id: "ORD-002", customer: "سارة خالد", date: "2023-06-14", status: "قيد التجهيز", total: 420 },
  { id: "ORD-003", customer: "محمد علي", date: "2023-06-13", status: "قيد الشحن", total: 180 },
];

const dummyProducts = [
  { id: "PROD-001", name: "قميص أزرق", price: 120, stock: 25, status: "متاح" },
  { id: "PROD-002", name: "بنطلون جينز", price: 150, stock: 18, status: "متاح" },
  { id: "PROD-003", name: "حذاء رياضي", price: 220, stock: 5, status: "منخفض المخزون" },
];

const Home = () => {
  const { data: storeData, isLoading } = useStoreData();

  // نعدل المكونات لتوافق متطلبات PropTypes
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1>
      </div>

      {/* WelcomeSection مع تمرير جميع القيم المطلوبة */}
      <div className="bg-accent/50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          مرحباً بك في متجر {storeData?.store_name || "متجري"}
        </h2>
        <p className="text-muted-foreground">
          لديك 5 طلبات جديدة و 3 منتجات منخفضة المخزون
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* تعديل StatsCard ليتوافق مع متطلبات PropTypes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">إجمالي المبيعات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 text-primary mr-2" />
              <div>
                <div className="text-2xl font-bold">2,350 ريال</div>
                <p className="text-xs text-muted-foreground">↗️ زيادة 14% عن الشهر الماضي</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 text-orange-500 mr-2" />
              <div>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">↘️ انخفاض 5% عن الشهر الماضي</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">تم إضافة 5 منتجات جديدة</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">عدد العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">↗️ زيادة 20% عن الشهر الماضي</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
                {/* نستخدم مخطط بسيط بدلاً من SalesChart */}
                <div className="h-[300px] flex items-end justify-between">
                  {dummySalesData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="flex space-x-1">
                        <div 
                          className="bg-primary w-8 rounded-t-md" 
                          style={{ height: `${item.sales / 30}px` }}
                        />
                        <div 
                          className="bg-secondary w-8 rounded-t-md" 
                          style={{ height: `${item.orders * 3}px` }}
                        />
                      </div>
                      <span className="text-xs mt-2">{item.month}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4 space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-primary rounded-full mr-1"></div>
                    <span className="text-xs">المبيعات</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-secondary rounded-full mr-1"></div>
                    <span className="text-xs">الطلبات</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="col-span-3 flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>أحدث الطلبات</CardTitle>
                  <CardDescription>آخر الطلبات الواردة</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 px-4 text-start text-sm">رقم الطلب</th>
                          <th className="py-2 px-4 text-start text-sm">العميل</th>
                          <th className="py-2 px-4 text-start text-sm">الحالة</th>
                          <th className="py-2 px-4 text-start text-sm">المبلغ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dummyOrders.map((order) => (
                          <tr key={order.id} className="border-b">
                            <td className="py-2 px-4 text-sm">{order.id}</td>
                            <td className="py-2 px-4 text-sm">{order.customer}</td>
                            <td className="py-2 px-4 text-sm">{order.status}</td>
                            <td className="py-2 px-4 text-sm">{order.total} ريال</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>أحدث المنتجات</CardTitle>
                <CardDescription>آخر المنتجات المضافة</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-start text-sm">رمز المنتج</th>
                        <th className="py-2 px-4 text-start text-sm">اسم المنتج</th>
                        <th className="py-2 px-4 text-start text-sm">السعر</th>
                        <th className="py-2 px-4 text-start text-sm">المخزون</th>
                        <th className="py-2 px-4 text-start text-sm">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dummyProducts.map((product) => (
                        <tr key={product.id} className="border-b">
                          <td className="py-2 px-4 text-sm">{product.id}</td>
                          <td className="py-2 px-4 text-sm">{product.name}</td>
                          <td className="py-2 px-4 text-sm">{product.price} ريال</td>
                          <td className="py-2 px-4 text-sm">{product.stock}</td>
                          <td className="py-2 px-4 text-sm">{product.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
