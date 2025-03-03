
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Filter, ChevronDown, Package, Truck, Check, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  // نموذج مؤقت لبيانات الطلبات
  const orders = [
    { id: "ORD-001", date: "12/05/2023", customer: "أحمد محمد", total: 230, status: "completed", items: 3 },
    { id: "ORD-002", date: "14/05/2023", customer: "نورة العلي", total: 150, status: "processing", items: 2 },
    { id: "ORD-003", date: "15/05/2023", customer: "خالد عبدالله", total: 400, status: "shipped", items: 5 },
    { id: "ORD-004", date: "16/05/2023", customer: "سارة الأحمد", total: 300, status: "pending", items: 4 }
  ];

  // دالة لتحديد أيقونة حالة الطلب
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <RefreshCw size={18} className="text-orange-500" />;
      case "processing":
        return <Package size={18} className="text-blue-500" />;
      case "shipped":
        return <Truck size={18} className="text-purple-500" />;
      case "completed":
        return <Check size={18} className="text-green-500" />;
      default:
        return null;
    }
  };

  // دالة لتحديد لون حالة الطلب
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // دالة لترجمة حالة الطلب
  const translateStatus = (status: string) => {
    switch (status) {
      case "pending":
        return "قيد الانتظار";
      case "processing":
        return "قيد المعالجة";
      case "shipped":
        return "تم الشحن";
      case "completed":
        return "مكتمل";
      default:
        return status;
    }
  };

  // تصفية الطلبات حسب الحالة
  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">الطلبات</h1>
            <p className="text-gray-600">إدارة طلبات المتجر</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={16} />
              تصفية
              <ChevronDown size={16} />
            </Button>
            <Button className="bg-primary-600 hover:bg-primary-700">
              إضافة طلب جديد
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-4 mb-8 bg-gray-100 p-1 border border-gray-200">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">الكل</TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">قيد الانتظار</TabsTrigger>
            <TabsTrigger value="processing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">قيد المعالجة</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">مكتملة</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="animate-fade-in">
            <div className="grid gap-4">
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow border border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center p-4 gap-4">
                      <div className="flex items-center md:w-1/4">
                        <div className="h-10 w-10 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mr-3">
                          <ShoppingBag size={18} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                      </div>
                      
                      <div className="md:w-1/4">
                        <p className="text-sm text-gray-500">العميل</p>
                        <p className="font-medium text-gray-800">{order.customer}</p>
                      </div>
                      
                      <div className="md:w-1/4">
                        <p className="text-sm text-gray-500">المنتجات</p>
                        <p className="font-medium text-gray-800">{order.items} منتجات</p>
                      </div>
                      
                      <div className="md:w-1/4">
                        <p className="text-sm text-gray-500">المبلغ</p>
                        <p className="font-medium text-gray-800">{order.total} ر.س</p>
                      </div>
                      
                      <div className="md:w-1/4">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="mr-1">{translateStatus(order.status)}</span>
                        </div>
                      </div>
                      
                      <div className="md:w-1/4 text-left">
                        <Button variant="ghost" size="sm">
                          عرض التفاصيل
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                  <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">لا توجد طلبات</h3>
                  <p className="mt-1 text-gray-500">لم يتم العثور على طلبات تطابق المعايير.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
