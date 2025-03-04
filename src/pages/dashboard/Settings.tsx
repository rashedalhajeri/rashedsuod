
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
import { Store, CreditCard, Bell, Shield, Globe, Truck, FileText, ChevronLeft, ChevronRight, Wallet, Calendar, Clock, Info, HelpCircle } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Settings: React.FC = () => {
  const { data: storeData, isLoading } = useStoreData();
  const [activeTab, setActiveTab] = useState("general");
  const tabsListRef = useRef<HTMLDivElement>(null);
  
  const currentPlan = storeData?.subscription_plan || "free";

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

  // دالة مساعدة لعرض نصائح سريعة
  const QuickTip = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start gap-2 mt-4 mb-2">
      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-blue-700">{children}</p>
    </div>
  );

  // مكون للتوجيهات السريعة
  const SettingTooltip = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className="h-4 w-4 text-gray-400 cursor-help ml-1" />
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-60 text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

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
              <div className="flex items-center">
                <div>
                  <CardTitle>إعدادات المتجر الأساسية</CardTitle>
                  <CardDescription>
                    قم بتعديل المعلومات الأساسية لمتجرك
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <QuickTip>
                يمكنك البدء بملء هذه المعلومات الأساسية لمتجرك. سيتم عرض هذه المعلومات للعملاء عند زيارة متجرك.
              </QuickTip>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="store-name">اسم المتجر</Label>
                    <SettingTooltip content="هذا هو الاسم الذي سيظهر للعملاء عند زيارة متجرك" />
                  </div>
                  <Input
                    id="store-name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="اسم المتجر"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="store-url">رابط المتجر</Label>
                    <SettingTooltip content="الرابط الذي سيستخدمه العملاء للوصول إلى متجرك" />
                  </div>
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
                  <div className="flex items-center">
                    <Label htmlFor="store-email">البريد الإلكتروني</Label>
                    <SettingTooltip content="سيتم استخدام هذا البريد الإلكتروني للتواصل مع العملاء وإرسال إشعارات الطلبات" />
                  </div>
                  <Input
                    id="store-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="store-phone">رقم الهاتف</Label>
                    <SettingTooltip content="رقم هاتف للتواصل مع العملاء وسيظهر في صفحة التواصل" />
                  </div>
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
        
        <TabsContent value="domain">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات النطاق</CardTitle>
              <CardDescription>
                قم بتخصيص نطاق متجرك أو إضافة نطاق مخصص
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuickTip>
                النطاق هو عنوان متجرك على الإنترنت. يمكنك استخدام النطاق الافتراضي أو إضافة نطاق مخصص خاص بك (متاح في الباقة الاحترافية).
              </QuickTip>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label>النطاق الحالي</Label>
                    <SettingTooltip content="هذا هو الرابط الحالي الذي يمكن للعملاء استخدامه للوصول إلى متجرك" />
                  </div>
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
                    <div className="flex items-center">
                      <Label htmlFor="custom-domain">النطاق المخصص</Label>
                      <SettingTooltip content="يمكنك إضافة نطاق خاص بك مثل www.mystore.com (متاح في الباقة الاحترافية)" />
                    </div>
                    <div className="flex">
                      <Input
                        id="custom-domain"
                        placeholder="www.example.com"
                        disabled={currentPlan !== "premium"}
                        className={currentPlan !== "premium" ? "bg-gray-100" : ""}
                      />
                      <Button className="mr-2" disabled={currentPlan !== "premium"}>إضافة</Button>
                    </div>
                  </div>
                </div>
                
                {currentPlan !== "premium" && (
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
              <QuickTip>
                كلما زادت طرق الدفع المتاحة في متجرك، زادت فرص المبيعات. يمكنك البدء بالدفع عند الاستلام ثم إضافة بوابات الدفع الإلكتروني لاحقاً.
              </QuickTip>
              
              <div className="grid gap-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Label htmlFor="cash-on-delivery" className="text-base">الدفع عند الاستلام</Label>
                      <SettingTooltip content="يسمح للعملاء بالدفع نقداً عند استلام المنتجات" />
                    </div>
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
                    <div className="flex items-center">
                      <Label htmlFor="my-fatoorah" className="text-base">ماي فاتورة (MyFatoorah)</Label>
                      <SettingTooltip content="بوابة دفع شاملة تدعم KNET وVisa وMastercard وغيرها من وسائل الدفع في الخليج" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-8 px-3 py-1 bg-blue-50 text-blue-600 rounded-md font-medium">MyFatoorah</div>
                    </div>
                    <p className="text-sm text-muted-foreground">بوابة دفع شاملة تدعم العديد من وسائل الدفع في الخليج</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentPlan !== "premium" && (
                      <Badge variant="outline" className="text-xs">
                        الباقة الاحترافية
                      </Badge>
                    )}
                    <Switch 
                      id="my-fatoorah" 
                      checked={myFatoorah}
                      onCheckedChange={setMyFatoorah}
                      disabled={currentPlan !== "premium"}
                    />
                  </div>
                </div>
                
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Label htmlFor="tabby" className="text-base">تابي (Tabby)</Label>
                      <SettingTooltip content="خدمة تتيح للعملاء الدفع على أقساط بدون فوائد أو رسوم إضافية" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-8 px-3 py-1 bg-purple-50 text-purple-600 rounded-md font-medium">Tabby</div>
                    </div>
                    <p className="text-sm text-muted-foreground">الدفع بالتقسيط بدون فوائد - اشتري الآن وادفع لاحقاً</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentPlan !== "premium" && (
                      <Badge variant="outline" className="text-xs">
                        الباقة الاحترافية
                      </Badge>
                    )}
                    <Switch 
                      id="tabby" 
                      checked={tabby}
                      onCheckedChange={setTabby}
                      disabled={currentPlan !== "premium"}
                    />
                  </div>
                </div>
                
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Label htmlFor="paypal" className="text-base">باي بال (PayPal)</Label>
                      <SettingTooltip content="خدمة دفع عالمية مناسبة للعملاء الدوليين" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-8 px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-medium">PayPal</div>
                    </div>
                    <p className="text-sm text-muted-foreground">منصة دفع عالمية للعملاء الدوليين</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentPlan !== "premium" && (
                      <Badge variant="outline" className="text-xs">
                        الباقة الاحترافية
                      </Badge>
                    )}
                    <Switch 
                      id="paypal" 
                      checked={paypal}
                      onCheckedChange={setPaypal}
                      disabled={currentPlan !== "premium"}
                    />
                  </div>
                </div>
              </div>
              
              {currentPlan !== "premium" && (
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
                      <div className="flex items-center">
                        <Label htmlFor="myfatoorah-token" className="text-xs text-blue-700">رمز API الخاص بماي فاتورة</Label>
                        <SettingTooltip content="رمز API الذي يمكنك الحصول عليه من لوحة تحكم ماي فاتورة" />
                      </div>
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
                      <div className="flex items-center">
                        <Label htmlFor="tabby-public-key" className="text-xs text-purple-700">المفتاح العام</Label>
                        <SettingTooltip content="المفتاح العام الذي تحصل عليه من لوحة تحكم تابي" />
                      </div>
                      <Input 
                        id="tabby-public-key" 
                        placeholder="أدخل المفتاح العام"
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="tabby-secret-key" className="text-xs text-purple-700">المفتاح السري</Label>
                        <SettingTooltip content="المفتاح السري الذي تحصل عليه من لوحة تحكم تابي" />
                      </div>
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
                      <div className="flex items-center">
                        <Label htmlFor="paypal-client-id" className="text-xs text-blue-700">معرف العميل</Label>
                        <SettingTooltip content="معرف العميل الذي تحصل عليه من لوحة تحكم باي بال للمطورين" />
                      </div>
                      <Input 
                        id="paypal-client-id" 
                        placeholder="أدخل معرف العميل"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="paypal-secret" className="text-xs text-blue-700">المفتاح السري</Label>
                        <SettingTooltip content="المفتاح السري الذي تحصل عليه من لوحة تحكم باي بال للمطورين" />
                      </div>
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
              <QuickTip>
                ضبط إعدادات الشحن بشكل صحيح يساعد في تحسين تجربة العملاء ويقلل من الأسئلة حول التوصيل والتسليم.
              </QuickTip>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">تفعيل الشحن</h4>
                      <SettingTooltip content="تفعيل خيارات الشحن والتوصيل للعملاء" />
                    </div>
                    <p className="text-sm text-gray-500">السماح بشحن المنتجات للعملاء</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">الشحن المجاني</h4>
                      <SettingTooltip content="توفير شحن مجاني للطلبات التي تتجاوز مبلغ معين" />
                    </div>
                    <p className="text-sm text-gray-500">تفعيل الشحن المجاني للطلبات التي تتجاوز مبلغ معين</p>
                  </div>
                  <Switch />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="free-shipping-threshold">الحد الأدنى للشحن المجاني</Label>
                      <SettingTooltip content="المبلغ الذي يجب أن يتجاوزه الطلب للحصول على شحن مجاني" />
                    </div>
                    <Input
                      id="free-shipping-threshold"
                      type="number"
                      placeholder="50"
                      disabled
                    />
                    <p className="text-xs text-gray-500">أدخل 0 لتفعيل الشحن المجاني لجميع الطلبات</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="shipping-cost">تكلفة الشحن العادي</Label>
                      <SettingTooltip content="تكلفة الشحن الافتراضية للطلبات التي لا تؤهل للشحن المجاني" />
                    </div>
                    <Input
                      id="shipping-cost"
                      type="number"
                      placeholder="5"
                    />
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mt-4">
                  <h3 className="flex items-center text-sm font-medium text-amber-800 mb-2">
                    <Info className="h-4 w-4 mr-1" />
                    إعدادات الشحن المتقدمة
                  </h3>
                  <p className="text-sm text-amber-700 mb-2">
                    يمكنك إضافة مناطق شحن متعددة وتحديد أسعار مختلفة لكل منطقة في الباقة الاحترافية.
                  </p>
                  {currentPlan !== "premium" && (
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <a href="/dashboard/settings?tab=billing">ترقية للباقة الاحترافية</a>
                    </Button>
                  )}
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
              <QuickTip>
                المستندات القانونية مهمة لحماية متجرك وتحديد العلاقة بينك وبين العملاء. تأكد من تحديثها وفقًا للقوانين المحلية.
              </QuickTip>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label>شروط الاستخدام</Label>
                    <SettingTooltip content="شروط استخدام المتجر التي يوافق عليها العملاء عند الشراء" />
                  </div>
                  <textarea
                    className="w-full border border-gray-200 rounded-md px-3 py-2 min-h-32"
                    placeholder="أدخل شروط الاستخدام الخاصة بمتجرك..."
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label>سياسة الخصوصية</Label>
                    <SettingTooltip content="كيفية جمع واستخدام بيانات العملاء في متجرك" />
                  </div>
                  <textarea
                    className="w-full border border-gray-200 rounded-md px-3 py-2 min-h-32"
                    placeholder="أدخل سياسة الخصوصية الخاصة بمتجرك..."
                  ></textarea>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label>سياسة الإرجاع والاستبدال</Label>
                    <SettingTooltip content="سياسة إرجاع واستبدال المنتجات في متجرك" />
                  </div>
                  <textarea
                    className="w-full border border-gray-200 rounded-md px-3 py-2 min-h-32"
                    placeholder="أدخل سياسة الإرجاع والاستبدال الخاصة بمتجرك..."
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
              <QuickTip>
                باقة الاشتراك تحدد الميزات المتاحة في متجرك. كلما كانت الباقة أعلى، كلما زادت الميزات المتاحة وإمكانيات المتجر.
              </QuickTip>
              
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
                            {currentPlan === "free" ? "الباقة المجانية" : 
                             currentPlan === "basic" ? "الباقة الأساسية" : 
                             "الباقة الاحترافية"}
                          </p>
                          <Badge className={currentPlan === "free" ? "bg-gray-500" : 
                                            currentPlan === "basic" ? "bg-blue-500" : 
                                            "bg-primary-500"}>
                            {currentPlan === "free" ? "مجانية" : 
                             currentPlan === "basic" ? "أساسية" : 
                             "احترافية"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">تاريخ انتهاء الاشتراك</p>
                        <p className="font-medium">{storeData?.subscription_end_date ? new Date(storeData.subscription_end_date).toLocaleDateString('ar-SA') : "غير محدد"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500">المتبقي على انتهاء الاشتراك</p>
                        <p className="font-medium">
                          {storeData?.subscription_end_date ? 
                            Math.max(0, Math.ceil((new Date(storeData.subscription_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))) + " يوم" : 
                            "غير محدد"}
                        </p>
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
                      <div className="flex items-center">
                        <Label htmlFor="activation-code">رمز التفعيل</Label>
                        <SettingTooltip content="رمز التفعيل الذي حصلت عليه عند شراء باقة متجرك" />
                      </div>
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
              <QuickTip>
                ضبط الإشعارات يساعدك على البقاء على اطلاع بأحدث التطورات في متجرك دون إزعاج غير ضروري.
              </QuickTip>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">إشعارات البريد الإلكتروني</h4>
                      <SettingTooltip content="استلام إشعارات عبر البريد الإلكتروني عن أنشطة المتجر المختلفة" />
                    </div>
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
                    <div className="flex items-center">
                      <h4 className="font-medium">إشعارات الطلبات الجديدة</h4>
                      <SettingTooltip content="استلام إشعار فوري عند وصول طلب جديد إلى متجرك" />
                    </div>
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
                    <div className="flex items-center">
                      <h4 className="font-medium">رسائل تسويقية</h4>
                      <SettingTooltip content="استلام نصائح ومعلومات عن تحسين أداء متجرك" />
                    </div>
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
              <QuickTip>
                الحفاظ على أمان حسابك أمر ضروري لحماية متجرك. قم بتغيير كلمة المرور بانتظام واستخدم كلمات مرور قوية.
              </QuickTip>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="current-password">كلمة المرور الحالية</Label>
                      <SettingTooltip content="كلمة المرور الحالية لحسابك" />
                    </div>
                    <Input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="new-password">كلمة المرور الجديدة</Label>
                      <SettingTooltip content="يجب أن تحتوي على 8 أحرف على الأقل مع أرقام وأحرف خاصة" />
                    </div>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="confirm-password">تأكيد كلمة المرور الجديدة</Label>
                    <SettingTooltip content="تأكيد كلمة المرور الجديدة للتحقق من صحتها" />
                  </div>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                  />
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100 mt-4">
                  <h3 className="flex items-center text-sm font-medium text-amber-800 mb-2">
                    <Info className="h-4 w-4 mr-1" />
                    نصائح لكلمة مرور قوية
                  </h3>
                  <ul className="text-sm text-amber-700 list-disc list-inside space-y-1">
                    <li>استخدم 8 أحرف على الأقل</li>
                    <li>استخدم مزيجًا من الأحرف الكبيرة والصغيرة</li>
                    <li>أضف أرقامًا وأحرفًا خاصة (@، #، $، !، إلخ)</li>
                    <li>تجنب المعلومات الشخصية مثل تاريخ الميلاد</li>
                  </ul>
                </div>
                
                <Separator className="my-6" />
                
                {currentPlan === "premium" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">إعدادات الأمان المتقدمة</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">تفعيل المصادقة الثنائية</h4>
                          <SettingTooltip content="طبقة إضافية من الأمان تتطلب رمزًا من تطبيق المصادقة أو رسالة نصية" />
                        </div>
                        <p className="text-sm text-gray-500">زيادة أمان حسابك باستخدام رمز إضافي عند تسجيل الدخول</p>
                      </div>
                      <Switch />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">تنبيهات تسجيل الدخول الغريبة</h4>
                          <SettingTooltip content="تلقي إشعار عند تسجيل الدخول من جهاز أو موقع غير معتاد" />
                        </div>
                        <p className="text-sm text-gray-500">تلقي إشعار عند تسجيل الدخول من موقع أو جهاز جديد</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                )}
                
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
