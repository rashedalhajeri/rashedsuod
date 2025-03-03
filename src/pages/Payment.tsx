
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle, AlertCircle, Clock, PlusCircle, Globe, Shield, ChevronDown, Filter } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Payment = () => {
  const [activeTab, setActiveTab] = useState("methods");
  
  // حالة فعالية طرق الدفع
  const [paymentMethods, setPaymentMethods] = useState({
    creditCard: true,
    paypal: false,
    applepay: true,
    bank: true,
    cod: true
  });

  const togglePaymentMethod = (method: keyof typeof paymentMethods) => {
    setPaymentMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));
  };

  // بيانات نموذجية للمعاملات
  const transactions = [
    { id: "TRX-001", date: "2023-05-15", method: "creditCard", amount: 350, status: "completed", order: "ORD-002" },
    { id: "TRX-002", date: "2023-05-13", method: "bank", amount: 520, status: "pending", order: "ORD-001" },
    { id: "TRX-003", date: "2023-05-10", method: "cod", amount: 230, status: "completed", order: "ORD-003" },
    { id: "TRX-004", date: "2023-05-08", method: "applepay", amount: 180, status: "failed", order: "ORD-004" },
  ];

  // دالة لتحديد لون حالة المعاملة
  const getTransactionStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // دالة لتحديد أيقونة حالة المعاملة
  const getTransactionStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={14} />;
      case "pending":
        return <Clock size={14} />;
      case "failed":
        return <AlertCircle size={14} />;
      default:
        return null;
    }
  };

  // دالة لترجمة حالة المعاملة
  const translateTransactionStatus = (status: string) => {
    switch (status) {
      case "completed":
        return "مكتملة";
      case "pending":
        return "قيد الانتظار";
      case "failed":
        return "فشلت";
      default:
        return status;
    }
  };

  // دالة لترجمة طريقة الدفع
  const translatePaymentMethod = (method: string) => {
    switch (method) {
      case "creditCard":
        return "بطاقة ائتمان";
      case "paypal":
        return "باي بال";
      case "applepay":
        return "آبل باي";
      case "bank":
        return "تحويل بنكي";
      case "cod":
        return "الدفع عند الاستلام";
      default:
        return method;
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">نظام الدفع</h1>
            <p className="text-gray-600">إدارة طرق الدفع والمعاملات المالية</p>
          </div>
        </div>

        <Tabs defaultValue="methods" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-8 bg-gray-100 p-1 border border-gray-200">
            <TabsTrigger value="methods" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <CreditCard size={16} className="ml-2" />
              طرق الدفع
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Globe size={16} className="ml-2" />
              المعاملات
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="methods" className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-semibold">بطاقات الائتمان</CardTitle>
                  <Switch 
                    checked={paymentMethods.creditCard}
                    onCheckedChange={() => togglePaymentMethod('creditCard')}
                  />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 ml-3">
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <p className="text-gray-600">قبول الدفع بالبطاقات الائتمانية (فيزا، ماستركارد)</p>
                      <div className="flex items-center mt-1">
                        <Shield size={14} className="text-green-600 ml-1" />
                        <span className="text-xs text-green-600">معاملات آمنة ومشفرة</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    رسوم المعاملات: 2.9% + 0.30 ر.س لكل معاملة
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    إعدادات البطاقات
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-semibold">آبل باي</CardTitle>
                  <Switch 
                    checked={paymentMethods.applepay}
                    onCheckedChange={() => togglePaymentMethod('applepay')}
                  />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-md bg-gray-50 flex items-center justify-center text-gray-600 ml-3">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.5 12.5c0-1.4.8-2.6 2-3.2-1-.7-2.5-1.1-3.7-1.1-.8 0-1.5.2-2.1.6-.6.4-1 .6-1.4.6-.5 0-.9-.2-1.6-.5-.4-.2-1.1-.5-1.8-.5-1.6 0-3.2 1-4 2.5-1 1.8-1 4.5.9 7 .7.9 1.6 2 2.8 2 .6 0 1-.2 1.4-.4.5-.2.9-.4 1.4-.4.5 0 .9.2 1.4.4.4.2.8.4 1.4.4 1.2 0 2.1-1.1 2.8-2 .5-.7.9-1.5 1.1-2.4-1.3-.4-2.2-1.7-2.2-3z"></path>
                        <path d="M15.4 7.8c.7-.8 1.1-1.8 1.1-2.8-1.1.1-2 .5-2.6 1.3-.7.7-1.1 1.7-1 2.7 1.1 0 2-.4 2.5-1.2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600">قبول الدفع من خلال خدمة آبل باي</p>
                      <div className="flex items-center mt-1">
                        <Shield size={14} className="text-green-600 ml-1" />
                        <span className="text-xs text-green-600">دفع سريع وآمن</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    رسوم المعاملات: 1.9% لكل معاملة
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    إعدادات آبل باي
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-semibold">تحويل بنكي</CardTitle>
                  <Switch 
                    checked={paymentMethods.bank}
                    onCheckedChange={() => togglePaymentMethod('bank')}
                  />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-md bg-green-50 flex items-center justify-center text-green-600 ml-3">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600">قبول التحويلات البنكية المباشرة</p>
                      <div className="flex items-center mt-1">
                        <Clock size={14} className="text-orange-600 ml-1" />
                        <span className="text-xs text-orange-600">قد تستغرق 1-3 أيام عمل</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    بدون رسوم إضافية
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    تعديل بيانات الحساب البنكي
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-semibold">الدفع عند الاستلام</CardTitle>
                  <Switch 
                    checked={paymentMethods.cod}
                    onCheckedChange={() => togglePaymentMethod('cod')}
                  />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-md bg-orange-50 flex items-center justify-center text-orange-600 ml-3">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-600">السماح للعملاء بالدفع نقداً عند استلام الطلب</p>
                      <div className="flex items-center mt-1">
                        <AlertCircle size={14} className="text-orange-600 ml-1" />
                        <span className="text-xs text-orange-600">معدل إلغاء أعلى</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    رسوم إضافية قد تطبق من قبل شركة الشحن
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">
                    إعدادات الدفع عند الاستلام
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="border border-gray-100 hover:shadow-md transition-shadow border-dashed">
                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                  <div className="h-16 w-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-4">
                    <PlusCircle size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">إضافة طريقة دفع جديدة</h3>
                  <p className="text-gray-500 text-sm mb-4">يمكنك تكامل المزيد من طرق الدفع مع متجرك</p>
                  <Button variant="outline">استكشاف الخيارات</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions" className="animate-fade-in">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-700">سجل المعاملات</h2>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                تصفية
                <ChevronDown size={16} />
              </Button>
            </div>
            
            <Card className="border border-gray-100 overflow-hidden">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-12 text-sm font-medium text-gray-500 bg-gray-50 p-4 border-b border-gray-100">
                    <div className="col-span-2 flex items-center">رقم المعاملة</div>
                    <div className="col-span-2">التاريخ</div>
                    <div className="col-span-2">طريقة الدفع</div>
                    <div className="col-span-2">المبلغ</div>
                    <div className="col-span-2">رقم الطلب</div>
                    <div className="col-span-2">الحالة</div>
                  </div>
                  
                  {transactions.map((transaction) => (
                    <div 
                      key={transaction.id} 
                      className="grid grid-cols-12 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 text-sm"
                    >
                      <div className="col-span-2 font-medium text-gray-800">{transaction.id}</div>
                      <div className="col-span-2 text-gray-500">{new Date(transaction.date).toLocaleDateString('ar-SA')}</div>
                      <div className="col-span-2 text-gray-500">{translatePaymentMethod(transaction.method)}</div>
                      <div className="col-span-2 text-gray-800 font-medium">{transaction.amount} ر.س</div>
                      <div className="col-span-2 text-gray-500">{transaction.order}</div>
                      <div className="col-span-2">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTransactionStatusColor(transaction.status)}`}>
                          {getTransactionStatusIcon(transaction.status)}
                          <span className="mr-1">{translateTransactionStatus(transaction.status)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Payment;
