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
import { UserCircle, Store, CreditCard, Bell, Shield, Globe, Truck, FileText, ChevronLeft, ChevronRight, Wallet, Check, X, Calendar, Clock } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";

const Settings: React.FC = () => {
  const { data: storeData, isLoading } = useStoreData();
  const [activeTab, setActiveTab] = useState("general");
  const tabsListRef = useRef<HTMLDivElement>(null);
  
  const currentPlan = "basic";

  const [storeName, setStoreName] = useState(storeData?.store_name || "");
  const [storeUrl, setStoreUrl] = useState(storeData?.domain_name || "");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(storeData?.phone_number || "");
  
  const [cashOnDelivery, setCashOnDelivery] = useState(true);
  const [myFatoorah, setMyFatoorah] = useState(false);
  const [tabby, setTabby] = useState(false);
  const [paypal, setPaypal] = useState(false);
  
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
              <TabsTrigger value="payment_methods" className="flex gap-2 items-center">
                <Wallet className="h-4 w-4" />
                <span className="inline">طرق الدفع</span>
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
        
        <style dangerouslySetInnerHTML={{
          __html: `
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `
        }} />
        
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
        
        <TabsContent value="payment_methods">
          <Card>
            <CardHeader>
              <CardTitle>طرق الدفع</CardTitle>
              <CardDescription>
                قم بتفعيل أو تعطيل طرق الدفع التي تريد استخدامها في متجرك
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="cash-on-delivery" className="text-base">الدفع عند الاستلام</Label>
                    <p className="text-sm text-muted-foreground">السماح للعملاء بالدفع نقداً عند استلام المنتجات</p>
                  </div>
                  <Switch 
                    id="cash-on-delivery" 
                    checked={cashOnDelivery}
                    onCheckedChange={setCashOnDelivery}
                  />
                </div>
                
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="my-fatoorah" className="text-base">ماي فاتورة (MyFatoorah)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-8 px-3 py-1 bg-blue-50 text-blue-600 rounded-md font-medium">MyFatoorah</div>
                    </div>
                    <p className="text-sm text-muted-foreground">بوابة دفع شاملة تدعم العديد من وسائل الدفع في الخليج</p>
                  </div>
                  <Switch 
                    id="my-fatoorah" 
                    checked={myFatoorah}
                    onCheckedChange={setMyFatoorah}
                    disabled={currentPlan === "basic"}
                  />
                  {currentPlan === "basic" && (
                    <Badge variant="outline" className="mr-2 text-xs">
                      الباقة الاحترافية
                    </Badge>
                  )}
                </div>
                
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tabby" className="text-base">تابي (Tabby)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-8 px-3 py-1 bg-purple-50 text-purple-600 rounded-md font-medium">Tabby</div>
                    </div>
                    <p className="text-sm text-muted-foreground">الدفع بالتقسيط بدون فوائد - اشتري الآن وادفع لاحقاً</p>
                  </div>
                  <Switch 
                    id="tabby" 
                    checked={tabby}
                    onCheckedChange={setTabby}
                    disabled={currentPlan === "basic"}
                  />
                  {currentPlan === "basic" && (
                    <Badge variant="outline" className="mr-2 text-xs">
                      الباقة الاحترافية
                    </Badge>
                  )}
                </div>
                
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="paypal" className="text-base">باي بال (PayPal)</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-8 px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">PayPal</div>
                    </div>
                    <p className="text-sm text-muted-foreground">منصة دفع عالمية للعملاء الدوليين</p>
                  </div>
                  <Switch 
                    id="paypal" 
                    checked={paypal}
                    onCheckedChange={setPaypal}
                    disabled={currentPlan === "basic"}
                  />
                  {currentPlan === "basic" && (
                    <Badge variant="outline" className="mr-2 text-xs">
                      الباقة الاحترافية
                    </Badge>
                  )}
                </div>
              </div>
              
              {currentPlan === "basic" && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100 mt-6">
                  <h3 className="text-base font-semibold text-blue-800 mb-2">ترقية للوصول لجميع بوابات الدفع</h3>
                  <p className="text-sm text-blue-700 mb-4">
                    قم بترقية متجرك للباقة الاحترافية للحصول على خيارات دفع متقدمة مثل ماي فاتورة وتابي وباي بال
                  </p>
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
                    <a href="/dashboard/settings?tab=billing">ترقية الآن</a>
                  </Button>
                </div>
              )}
              
              {myFatoorah && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">إعدادات ماي فاتورة</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="myfatoorah-token" className="text-xs text-blue-700">رمز API الخاص بماي فاتورة</Label>
                      <Input 
                        id="myfatoorah-token" 
                        placeholder="أدخل رمز API الخاص بك"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="flex gap-1 text-xs text-blue-600 items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                      <span>يمكنك الحصول على رمز API من لوحة تحكم ماي فاتورة</span>
                    </div>
                  </div>
                </div>
              )}
              
              {tabby && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <h3 className="text-sm font-medium text-purple-800 mb-2">إعدادات تابي</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="tabby-public-key" className="text-xs text-purple-700">المفتاح العام</Label>
                      <Input 
                        id="tabby-public-key" 
                        placeholder="أدخل المفتاح العام"
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="tabby-secret-key" className="text-xs text-purple-700">المفتاح السري</Label>
                      <Input 
                        id="tabby-secret-key" 
                        type="password"
                        placeholder="أدخل المفتاح السري"
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {paypal && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">إعدادات باي بال</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="paypal-client-id" className="text-xs text-blue-700">معرف العميل</Label>
                      <Input 
                        id="paypal-client-id" 
                        placeholder="أدخل معرف العميل"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="paypal-secret" className="text-xs text-blue-700">المفتاح السري</Label>
                      <Input 
                        id="paypal-secret" 
                        type="password"
                        placeholder="أدخل المفتاح السري"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Switch 
                        id="paypal-sandbox" 
                        className="data-[state=checked]:bg-blue-600"
                      />
                      <Label htmlFor="paypal-sandbox" className="text-xs text-blue-700">وضع الاختبار (Sandbox)</Label>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="bg-primary hover:bg-primary/90">
                  حفظ التغييرات
                </Button>
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
                  <CardTitle>بطاقة المتجر</CardTitle>
                  <CardDescription>
                    معلومات المتجر وتفاصيل الاشتراك
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Store className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">اسم المتجر</p>
                        <p className="font-medium">{storeData?.store_name || "متجري"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">رابط المتجر</p>
                        <p className="font-medium">{storeData?.domain_name || "my-store"}.linok.me</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                        <p className="font-medium">user@example.com</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">الباقة الحالية</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {currentPlan === "basic" ? "الباقة الأساسية" : "الباقة الاحترافية"}
                          </p>
                          <Badge className={currentPlan === "basic" ? "bg-blue-500" : "bg-primary-500"}>
                            {currentPlan === "basic" ? "أساسية" : "احترافية"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">تاريخ انتهاء الاشتراك</p>
                        <p className="font-medium">15 مايو 2024</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">المتبقي على انتهاء الاشتراك</p>
                        <p className="font-medium">45 يوم</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-base font-medium mb-3">تفعيل الباقة برمز التفعيل</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="activation-code">رمز التفعيل</Label>
                      <Input
                        id="activation-code"
                        placeholder="أدخل رمز التفعيل هنا"
                      />
                    </div>
                    <Button onClick={() => toast.success("تم التحقق من الرمز بنجاح")}>
                      تفعيل
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-base font-medium mb-3">شراء باقة جديدة</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    يمكنك ترقية باقتك الحالية أو تجديد الاشتراك من خلال شراء باقة جديدة
                  </p>
                  <Button onClick={() => setActiveTab("billing-plans")}>
                    عرض الباقات المتاحة
                  </Button>
                </div>
              </div>
              
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
