import React, { useState, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import useStoreData from "@/hooks/use-store-data";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import SubscriptionPlans from "@/features/dashboard/components/SubscriptionPlans";
import { Separator } from "@/components/ui/separator";
import { UserCircle, Store, CreditCard, Bell, Shield, Globe, Truck, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";

const Settings: React.FC = () => {
  const { data: storeData, isLoading } = useStoreData();
  const [activeTab, setActiveTab] = useState("general");
  const tabsListRef = useRef<HTMLDivElement>(null);
  
  // Mock current plan
  const currentPlan = "basic";

  // Form states
  const [storeName, setStoreName] = useState(storeData?.store_name || "");
  const [storeUrl, setStoreUrl] = useState(storeData?.domain_name || "");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(storeData?.phone_number || "");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  const handleSaveSettings = () => {
    toast.success("تم حفظ الإعدادات بنجاح");
  };

  const scrollLeft = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">إعدادات المتجر</h1>
        <p className="text-gray-500">قم بتخصيص إعدادات متجرك ومعلومات حسابك</p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="relative mb-8">
          <button 
            onClick={scrollLeft} 
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white shadow-md rounded-full p-1 z-10 hover:bg-gray-100"
            aria-label="Scroll tabs right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          
          <div className="mx-6 overflow-hidden relative">
            <TabsList 
              ref={tabsListRef}
              className="flex whitespace-nowrap overflow-x-auto scrollbar-hide bg-gray-100 p-1 scroll-smooth hide-scrollbar"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <TabsTrigger value="general" className="flex gap-2 items-center">
                <Store className="h-4 w-4" />
                <span className="inline">عام</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex gap-2 items-center">
                <UserCircle className="h-4 w-4" />
                <span className="inline">الملف الشخصي</span>
              </TabsTrigger>
              <TabsTrigger value="domain" className="flex gap-2 items-center">
                <Globe className="h-4 w-4" />
                <span className="inline">النطاق</span>
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex gap-2 items-center">
                <Truck className="h-4 w-4" />
                <span className="inline">الشحن</span>
              </TabsTrigger>
              <TabsTrigger value="legal" className="flex gap-2 items-center">
                <FileText className="h-4 w-4" />
                <span className="inline">القانونية</span>
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex gap-2 items-center">
                <CreditCard className="h-4 w-4" />
                <span className="inline">الاشتراك</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex gap-2 items-center">
                <Bell className="h-4 w-4" />
                <span className="inline">الإشعارات</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex gap-2 items-center">
                <Shield className="h-4 w-4" />
                <span className="inline">الأمان</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <button 
            onClick={scrollRight} 
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white shadow-md rounded-full p-1 z-10 hover:bg-gray-100"
            aria-label="Scroll tabs left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
        
        <style jsx>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات المتجر</CardTitle>
              <CardDescription>
                قم بتعديل إعدادات متجرك الأساسية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store-name">اسم المتجر</Label>
                  <Input
                    id="store-name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="اسم المتجر"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-url">رابط المتجر</Label>
                  <div className="flex">
                    <Input
                      id="store-url"
                      value={storeUrl}
                      onChange={(e) => setStoreUrl(e.target.value)}
                      className="rounded-r-none"
                      placeholder="رابط-المتجر"
                    />
                    <div className="bg-gray-100 border border-r-0 border-gray-200 text-gray-500 px-3 py-2 text-sm flex items-center rounded-l-md">
                      .linok.me
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-email">البريد الإلكتروني</Label>
                  <Input
                    id="store-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="store-phone">رقم الهاتف</Label>
                  <Input
                    id="store-phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+965 XXXXXXXX"
                  />
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings}>
                  حفظ التغييرات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>معلومات الملف الشخصي</CardTitle>
              <CardDescription>
                قم بتعديل معلومات الملف الشخصي الخاص بك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full-name">الاسم الكامل</Label>
                    <Input
                      id="full-name"
                      placeholder="الاسم الكامل"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email-address">البريد الإلكتروني</Label>
                    <Input
                      id="email-address"
                      type="email"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex justify-end">
                  <Button onClick={() => toast.success("تم حفظ الملف الشخصي بنجاح")}>
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="domain">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النطاق</CardTitle>
              <CardDescription>
                قم بتخصيص نطاق متجرك أو إضافة نطاق مخصص
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>النطاق الحالي</Label>
                  <div className="flex items-center">
                    <div className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-md flex-1">
                      <span className="font-medium">{storeUrl || "your-store"}.linok.me</span>
                    </div>
                    <Button variant="outline" className="mr-2">نسخ</Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-medium mb-2">إضافة نطاق مخصص</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      متوفر فقط للباقة الاحترافية. قم بترقية باقتك لإضافة نطاق مخصص.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="custom-domain">النطاق المخصص</Label>
                    <div className="flex">
                      <Input
                        id="custom-domain"
                        placeholder="www.example.com"
                        disabled={currentPlan === "basic"}
                        className={currentPlan === "basic" ? "bg-gray-100" : ""}
                      />
                      <Button className="mr-2" disabled={currentPlan === "basic"}>إضافة</Button>
                    </div>
                  </div>
                </div>
                
                {currentPlan === "basic" && (
                  <div className="mt-4">
                    <Button variant="outline" asChild>
                      <a href="/dashboard/settings?tab=billing">ترقية للباقة الاحترافية</a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>خيارات الشحن</CardTitle>
              <CardDescription>
                قم بإعداد طرق الشحن ومناطق التوصيل
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">تفعيل الشحن</h4>
                    <p className="text-sm text-gray-500">السماح بشحن المنتجات للعملاء</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">الشحن المجاني</h4>
                    <p className="text-sm text-gray-500">تفعيل الشحن المجاني للطلبات التي تتجاوز مبلغ معين</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => toast.success("تم حفظ إعدادات الشحن بنجاح")}>
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>المستندات القانونية</CardTitle>
              <CardDescription>
                إعداد شروط الاستخدام وسياسة الخصوصية
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label>شروط الاستخدام</Label>
                  <textarea
                    className="w-full border border-gray-200 rounded-md px-3 py-2 min-h-32"
                    placeholder="أدخل شروط الاستخدام الخاصة بمتجرك..."
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <Label>سياسة الخصوصية</Label>
                  <textarea
                    className="w-full border border-gray-200 rounded-md px-3 py-2 min-h-32"
                    placeholder="أدخل سياسة الخصوصية الخاصة بمتجرك..."
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => toast.success("تم حفظ المستندات القانونية بنجاح")}>
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="billing">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>باقة الاشتراك الحالية</CardTitle>
                  <CardDescription>
                    تفاصيل الباقة الحالية وخيارات الترقية
                  </CardDescription>
                </div>
                <Badge className={currentPlan === "basic" ? "bg-blue-500" : "bg-primary-500"}>
                  {currentPlan === "basic" ? "الأساسية" : "الاحترافية"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-6">
                أنت مشترك حالياً في الباقة {currentPlan === "basic" ? "الأساسية" : "الاحترافية"} بقيمة {currentPlan === "basic" ? "90" : "150"} د.ك لمدة 6 أشهر.
                تنتهي صلاحية اشتراكك في 15 مايو 2024.
              </p>
              
              <Separator className="my-6" />
              
              <SubscriptionPlans />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الإشعارات</CardTitle>
              <CardDescription>
                تحكم في كيفية تلقي الإشعارات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">إشعارات البريد الإلكتروني</h4>
                    <p className="text-sm text-gray-500">استلام إشعارات عبر البريد الإلكتروني</p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">إشعارات الطلبات الجديدة</h4>
                    <p className="text-sm text-gray-500">استلام إشعار عند وصول طلب جديد</p>
                  </div>
                  <Switch
                    checked={orderNotifications}
                    onCheckedChange={setOrderNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">رسائل تسويقية</h4>
                    <p className="text-sm text-gray-500">استلام تحديثات ونصائح لتطوير متجرك</p>
                  </div>
                  <Switch
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => toast.success("تم حفظ إعدادات الإشعارات بنجاح")}>
                    حفظ التغييرات
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الأمان</CardTitle>
              <CardDescription>
                إدارة كلمة المرور وإعدادات الأمان الأخرى
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex justify-end">
                  <Button onClick={() => toast.success("تم تغيير كلمة المرور بنجاح")}>
                    تغيير كلمة المرور
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Settings;
