
import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, ArrowRight, HelpCircle, ExternalLink, FileText, Mail, PhoneCall, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Support: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">مركز الدعم</h1>
          <Button className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>فتح تذكرة دعم</span>
          </Button>
        </div>
        
        <div className="relative">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="كيف يمكننا مساعدتك؟" 
            className="pl-3 pr-10" 
          />
        </div>
        
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="faq">الأسئلة الشائعة</TabsTrigger>
            <TabsTrigger value="tickets">تذاكر الدعم</TabsTrigger>
            <TabsTrigger value="contact">اتصل بنا</TabsTrigger>
          </TabsList>
          
          <TabsContent value="faq">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    كيفية إضافة منتج جديد؟
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    يمكنك إضافة منتج جديد بالانتقال إلى صفحة المنتجات والنقر على زر "إضافة منتج"...
                  </p>
                  <Button variant="link" className="px-0 mt-2 text-primary">
                    قراءة المزيد <ArrowRight className="mr-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    كيف يمكنني تغيير إعدادات المتجر؟
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    يمكنك تعديل إعدادات متجرك من خلال الذهاب إلى صفحة الإعدادات...
                  </p>
                  <Button variant="link" className="px-0 mt-2 text-primary">
                    قراءة المزيد <ArrowRight className="mr-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    كيف أقوم بإدارة الطلبات؟
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    يمكنك إدارة الطلبات من خلال قسم الطلبات في لوحة التحكم...
                  </p>
                  <Button variant="link" className="px-0 mt-2 text-primary">
                    قراءة المزيد <ArrowRight className="mr-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary" />
                    كيف أضيف خيارات الدفع؟
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    يمكنك إضافة خيارات الدفع من خلال صفحة المدفوعات في الإعدادات...
                  </p>
                  <Button variant="link" className="px-0 mt-2 text-primary">
                    قراءة المزيد <ArrowRight className="mr-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  مركز المساعدة
                </CardTitle>
                <CardDescription>
                  استكشف مواردنا التعليمية وأدلة الاستخدام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto flex-col items-center justify-center py-6 gap-2 text-primary-foreground hover:bg-primary-50 hover:text-primary-700">
                    <FileText className="h-8 w-8 mb-2" />
                    <span className="font-medium">دليل المستخدم</span>
                    <span className="text-xs text-muted-foreground">تعرف على جميع خصائص المنصة</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex-col items-center justify-center py-6 gap-2 text-primary-foreground hover:bg-primary-50 hover:text-primary-700">
                    <ExternalLink className="h-8 w-8 mb-2" />
                    <span className="font-medium">مركز المعرفة</span>
                    <span className="text-xs text-muted-foreground">مقالات وشروحات مفصلة</span>
                  </Button>
                  
                  <Button variant="outline" className="h-auto flex-col items-center justify-center py-6 gap-2 text-primary-foreground hover:bg-primary-50 hover:text-primary-700">
                    <HelpCircle className="h-8 w-8 mb-2" />
                    <span className="font-medium">الأسئلة المتكررة</span>
                    <span className="text-xs text-muted-foreground">إجابات للأسئلة الشائعة</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tickets">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium">
                  <MessageSquare className="h-4 w-4 inline-block ml-2" />
                  تذاكر الدعم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">لا توجد تذاكر دعم مفتوحة</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    إذا كنت بحاجة إلى مساعدة، يمكنك فتح تذكرة دعم جديدة وسيقوم فريقنا بالرد عليك في أقرب وقت
                  </p>
                  <Button className="mt-4 gap-2">
                    <Plus className="h-4 w-4" />
                    <span>فتح تذكرة دعم</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium">
                  اتصل بفريق الدعم
                </CardTitle>
                <CardDescription>
                  يمكنك التواصل معنا عبر إحدى وسائل الاتصال التالية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-primary-100 bg-primary-50">
                    <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                      <Mail className="h-8 w-8 text-primary-600 mb-4" />
                      <h3 className="font-medium mb-1">البريد الإلكتروني</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        أرسل لنا بريدًا إلكترونيًا وسنرد خلال 24 ساعة
                      </p>
                      <span className="text-primary-700 font-medium">support@example.com</span>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-primary-100">
                    <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                      <MessageSquare className="h-8 w-8 text-primary-600 mb-4" />
                      <h3 className="font-medium mb-1">الدردشة المباشرة</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        تحدث مع أحد ممثلي فريق الدعم مباشرة
                      </p>
                      <Button size="sm">بدء الدردشة</Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-primary-100">
                    <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
                      <PhoneCall className="h-8 w-8 text-primary-600 mb-4" />
                      <h3 className="font-medium mb-1">الهاتف</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        اتصل بنا من الأحد إلى الخميس من 9 صباحًا إلى 5 مساءً
                      </p>
                      <span className="text-primary-700 font-medium">+966 123 456 789</span>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Support;
