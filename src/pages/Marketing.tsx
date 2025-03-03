
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Percent, Gift, Tag, PlusCircle, Calendar, Clock, Users, Edit, Trash2, ChevronDown } from "lucide-react";

const Marketing = () => {
  const [activeTab, setActiveTab] = useState("coupons");
  
  // بيانات نموذجية للكوبونات
  const coupons = [
    { id: 1, code: "WELCOME20", discount: "20%", type: "percentage", usage: 45, remaining: 55, expires: "2023-12-31" },
    { id: 2, code: "SUMMER30", discount: "30%", type: "percentage", usage: 23, remaining: 77, expires: "2023-09-30" },
    { id: 3, code: "FREESHIP", discount: "الشحن مجاني", type: "shipping", usage: 12, remaining: 38, expires: "2023-10-15" },
    { id: 4, code: "SAVE50", discount: "50 ر.س", type: "fixed", usage: 7, remaining: 93, expires: "2023-11-20" },
  ];
  
  // بيانات نموذجية للعروض الخاصة
  const promotions = [
    { id: 1, name: "عرض نهاية الأسبوع", status: "active", targets: "جميع المنتجات", discount: "15%", startDate: "2023-05-20", endDate: "2023-05-22" },
    { id: 2, name: "عرض الصيف", status: "upcoming", targets: "ملابس صيفية", discount: "25%", startDate: "2023-06-01", endDate: "2023-08-31" },
    { id: 3, name: "عرض الطلاب", status: "inactive", targets: "الإلكترونيات", discount: "10%", startDate: "2023-04-01", endDate: "2023-04-30" },
  ];

  // دالة لتحديد لون حالة العرض
  const getPromotionStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // دالة لترجمة حالة العرض
  const translatePromotionStatus = (status: string) => {
    switch (status) {
      case "active":
        return "نشط";
      case "upcoming":
        return "قادم";
      case "inactive":
        return "غير نشط";
      default:
        return status;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">كوبونات وتسويق</h1>
            <p className="text-gray-600">إدارة الكوبونات والعروض الخاصة في متجرك</p>
          </div>
        </div>

        <Tabs defaultValue="coupons" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8 bg-gray-100 p-1 border border-gray-200">
            <TabsTrigger value="coupons" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Percent size={16} className="ml-2" />
              الكوبونات
            </TabsTrigger>
            <TabsTrigger value="promotions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Gift size={16} className="ml-2" />
              العروض الخاصة
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="coupons" className="animate-fade-in">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">كوبونات الخصم</h2>
              <Button className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2">
                <PlusCircle size={16} />
                إضافة كوبون جديد
              </Button>
            </div>
            
            <Card className="border border-gray-100 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-12 text-sm font-medium text-gray-500 bg-gray-50 p-4 border-b border-gray-100">
                    <div className="col-span-1 flex items-center">#</div>
                    <div className="col-span-2 flex items-center">كود الكوبون</div>
                    <div className="col-span-2">نوع الخصم</div>
                    <div className="col-span-2">قيمة الخصم</div>
                    <div className="col-span-2">الاستخدام</div>
                    <div className="col-span-2">تاريخ الانتهاء</div>
                    <div className="col-span-1 text-left">إجراءات</div>
                  </div>
                  
                  {coupons.map((coupon) => (
                    <div 
                      key={coupon.id} 
                      className="grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-sm"
                    >
                      <div className="col-span-1 flex items-center">{coupon.id}</div>
                      <div className="col-span-2 font-medium text-gray-800 bg-gray-100 py-1 px-2 rounded">{coupon.code}</div>
                      <div className="col-span-2 text-gray-500">
                        {coupon.type === "percentage" ? "نسبة مئوية" : 
                         coupon.type === "fixed" ? "مبلغ ثابت" : 
                         coupon.type === "shipping" ? "شحن مجاني" : coupon.type}
                      </div>
                      <div className="col-span-2 text-gray-800 font-medium">{coupon.discount}</div>
                      <div className="col-span-2 text-gray-500">{coupon.usage} / {coupon.usage + coupon.remaining}</div>
                      <div className="col-span-2 text-gray-500 flex items-center">
                        <Calendar size={14} className="ml-1" />
                        {new Date(coupon.expires).toLocaleDateString('ar-SA')}
                      </div>
                      <div className="col-span-1 flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="promotions" className="animate-fade-in">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">العروض الخاصة</h2>
              <Button className="bg-primary-600 hover:bg-primary-700 flex items-center gap-2">
                <PlusCircle size={16} />
                إضافة عرض جديد
              </Button>
            </div>
            
            <div className="grid gap-4">
              {promotions.map((promo) => (
                <Card key={promo.id} className="hover:shadow-md transition-shadow border border-gray-100">
                  <div className="p-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex items-start md:items-center mb-2 md:mb-0">
                        <div className="h-10 w-10 rounded-md bg-primary-50 flex items-center justify-center text-primary-600 mr-3">
                          <Gift size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{promo.name}</h3>
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-1 ${getPromotionStatusColor(promo.status)}`}>
                            {translatePromotionStatus(promo.status)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                        <div className="text-sm">
                          <span className="text-gray-500 block">المستهدف</span>
                          <span className="text-gray-800 font-medium flex items-center">
                            <Tag size={14} className="ml-1" />
                            {promo.targets}
                          </span>
                        </div>
                        
                        <div className="text-sm">
                          <span className="text-gray-500 block">الخصم</span>
                          <span className="text-gray-800 font-medium">{promo.discount}</span>
                        </div>
                        
                        <div className="text-sm">
                          <span className="text-gray-500 block">الفترة</span>
                          <span className="text-gray-800 font-medium flex items-center">
                            <Calendar size={14} className="ml-1" />
                            {new Date(promo.startDate).toLocaleDateString('ar-SA')} - {new Date(promo.endDate).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        
                        <div className="flex self-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 text-gray-500">
                            تعديل
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 text-red-500">
                            حذف
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Marketing;
