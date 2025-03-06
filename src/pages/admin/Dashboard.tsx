
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useFormatter } from "@/hooks/use-formatter";
import { supabase } from "@/integrations/supabase/client";
import { Store, ShoppingBag, AlertCircle, Users, CircleDollarSign, TrendingUp } from "lucide-react";
import { useAuthState } from "@/hooks/use-auth-state";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePlatformStats } from "@/hooks/use-platform-stats";

const AdminDashboard = () => {
  const formatter = useFormatter();
  const { userId } = useAuthState();
  const { data: stats, isLoading } = usePlatformStats();
  
  // عدد المشرفين
  const { data: adminCount } = useQuery({
    queryKey: ['adminCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('admin_users')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      return count || 0;
    }
  });
  
  // عدد الطلبات اليوم
  const { data: todayOrdersCount } = useQuery({
    queryKey: ['todayOrdersCount'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());
        
      if (error) throw error;
      return count || 0;
    }
  });
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المشرف</h1>
          <p className="mt-1 text-sm text-gray-600">
            مرحباً بك في لوحة تحكم المشرف، يمكنك من هنا مراقبة وإدارة نشاط المنصة بالكامل
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Link to="/admin/stores">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary-200">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>المتاجر</span>
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Store className="h-5 w-5 text-blue-600" />
                    </div>
                  </CardTitle>
                  <CardDescription>إجمالي المتاجر المسجلة وحالتها</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{isLoading ? "-" : stats?.total_stores}</p>
                      <p className="text-xs text-gray-500">الكل</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-green-600">{isLoading ? "-" : stats?.active_stores}</p>
                      <p className="text-xs text-gray-500">نشط</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-red-600">{isLoading ? "-" : stats?.suspended_stores}</p>
                      <p className="text-xs text-gray-500">معلق</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to="/admin/orders">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary-200">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>الطلبات</span>
                    <div className="p-2 bg-green-100 rounded-full">
                      <ShoppingBag className="h-5 w-5 text-green-600" />
                    </div>
                  </CardTitle>
                  <CardDescription>إجمالي الطلبات والمبيعات</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold">{isLoading ? "-" : stats?.total_orders}</p>
                      <p className="text-xs text-gray-500">الكل</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-amber-600">{todayOrdersCount ?? "-"}</p>
                      <p className="text-xs text-gray-500">اليوم</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/admin/statistics">
              <Card className="h-full transition-all hover:shadow-md hover:border-primary-200">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>الإيرادات</span>
                    <div className="p-2 bg-purple-100 rounded-full">
                      <CircleDollarSign className="h-5 w-5 text-purple-600" />
                    </div>
                  </CardTitle>
                  <CardDescription>إجمالي الإيرادات من جميع المتاجر</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-2">
                    <p className="text-3xl font-bold text-purple-600">
                      {isLoading ? "-" : formatter.currency(stats?.total_revenue || 0)}
                    </p>
                    <div className="mt-3 flex items-center justify-center text-sm">
                      <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">+12%</span>
                      <span className="text-gray-500 mr-1">من الشهر الماضي</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-3"
          >
            <Card>
              <CardHeader>
                <CardTitle>التنبيهات المهمة</CardTitle>
                <CardDescription>تنبيهات تحتاج إلى اهتمامك</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                      </div>
                      <div className="mr-3">
                        <h3 className="text-sm font-medium text-amber-800">3 متاجر تحتاج إلى مراجعة</h3>
                        <div className="mt-1 text-sm text-amber-700">
                          <p>هناك 3 متاجر جديدة تنتظر المراجعة والموافقة.</p>
                        </div>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="text-amber-800 bg-amber-100 border-amber-300 hover:bg-amber-200">
                            مراجعة المتاجر
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="mr-3">
                        <h3 className="text-sm font-medium text-red-800">تقارير عن مشاكل في المدفوعات</h3>
                        <div className="mt-1 text-sm text-red-700">
                          <p>هناك 5 تقارير عن مشاكل في عمليات الدفع خلال الـ 24 ساعة الماضية.</p>
                        </div>
                        <div className="mt-2">
                          <Button variant="outline" size="sm" className="text-red-800 bg-red-100 border-red-300 hover:bg-red-200">
                            عرض التفاصيل
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>المشرفون</CardTitle>
                <CardDescription>فريق إدارة المنصة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-3">
                  <div className="bg-blue-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{adminCount ?? "-"}</p>
                  <p className="text-sm text-gray-500">إجمالي المشرفين</p>
                  
                  <Button size="sm" className="mt-4" asChild>
                    <Link to="/admin/admins">إدارة المشرفين</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>آخر النشاطات</CardTitle>
              <CardDescription>أحدث إجراءات المشرفين على المنصة</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="border-r-2 border-gray-200 border-dashed absolute h-full right-5 top-0"></div>
                <ul className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="mr-10 relative">
                      <div className="absolute right-[-1.625rem] mt-1.5 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500">منذ {i} ساعة</span>
                        <span className="text-gray-700">قام <span className="font-medium text-primary-700">أحمد محمد</span> بتعليق متجر <span className="font-medium">متجر الإلكترونيات</span> بسبب مخالفة الشروط</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin/activity-logs">عرض جميع النشاطات</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
