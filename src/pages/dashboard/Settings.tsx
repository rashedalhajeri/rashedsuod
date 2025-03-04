
import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import useStoreData, { isPaidPlan } from "@/hooks/use-store-data";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import SubscriptionPlans from "@/features/dashboard/components/SubscriptionPlans";
import { Separator } from "@/components/ui/separator";
import { Store, CreditCard, Bell, Shield, Globe, Truck, FileText, ChevronLeft, ChevronRight, Wallet, Calendar, Clock, Info, HelpCircle, Package, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import PaymentMethodItem from "@/features/dashboard/components/PaymentMethodItem";
import PromotionAlert from "@/features/dashboard/components/PromotionAlert";

const Settings: React.FC = () => {
  const { data: storeData, isLoading, refetch } = useStoreData();
  const [activeTab, setActiveTab] = useState("general");
  const tabsListRef = useRef<HTMLDivElement>(null);
  
  const currentPlan = storeData?.subscription_plan || "free";
  const isPaid = currentPlan === "basic" || currentPlan === "premium";

  useEffect(() => {
    if (storeData) {
      setStoreName(storeData.store_name || "");
      setStoreUrl(storeData.domain_name || "");
      setPhoneNumber(storeData.phone_number || "");
      
      const getUserEmail = async () => {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.email) {
          setEmail(data.user.email);
        }
      };
      
      getUserEmail();
    }
  }, [storeData]);
  
  const [storeName, setStoreName] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  
  const [cashOnDelivery, setCashOnDelivery] = useState(true);
  const [myFatoorah, setMyFatoorah] = useState(false);
  const [tabby, setTabby] = useState(false);
  const [paypal, setPaypal] = useState(false);
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  const handleSaveSettings = async () => {
    try {
      if (!storeData?.id) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      const { error } = await supabase
        .from('stores')
        .update({
          store_name: storeName
        })
        .eq('id', storeData.id);
        
      if (error) {
        throw error;
      }
      
      toast.success("تم حفظ الإعدادات بنجاح");
      refetch();
    } catch (error) {
      console.error("خطأ في حفظ الإعدادات:", error);
      toast.error("حدث خطأ أثناء حفظ الإعدادات");
    }
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

  const QuickTip = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-blue-50 border border-blue-100 rounded-md p-3 flex items-start gap-2 mt-4 mb-2">
      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-blue-700">{children}</p>
    </div>
  );

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
      
      {currentPlan === "free" && <PromotionAlert type="free" />}
      
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
                هذه المعلومات الأساسية لمتجرك تم جلبها من بيانات المتجر. يمكنك تعديل اسم المتجر فقط، بينما يظهر رابط المتجر للقراءة فقط.
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
                    <SettingTooltip content="الرابط الذي سيستخدمه العملاء للوصول إلى متجرك (للقراءة فقط)" />
                  </div>
                  <div className="flex">
                    <Input
                      id="store-url"
                      value={storeUrl}
                      readOnly
                      className="rounded-r-none bg-gray-100"
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
                    <SettingTooltip content="البريد الإلكتروني المرتبط بحسابك (للقراءة فقط)" />
                  </div>
                  <Input
                    id="store-email"
                    type="email"
                    value={email}
                    readOnly
                    className="bg-gray-100"
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
                    readOnly
                    className="bg-gray-100"
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
                عرض معلومات نطاق متجرك أو إضافة نطاق مخصص
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuickTip>
                النطاق هو عنوان متجرك على الإنترنت. يظهر النطاق الافتراضي لمتجرك أدناه. يمكنك إضافة نطاق مخصص في الباقة الاحترافية.
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
                    <Button 
                      variant="outline" 
                      className="mr-2"
                      onClick={() => {
                        navigator.clipboard.writeText(`${storeUrl}.linok.me`);
                        toast.success("تم نسخ الرابط بنجاح");
                      }}
                    >
                      نسخ
                    </Button>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-medium mb-2">إضافة نطاق مخصص</h4>
                    <p className="text-sm text-gray-500 mb-4">
                      متوفر فقط للب��قة الاحترافية. قم بترقية باقتك لإضافة نطاق مخصص.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Label htmlFor="custom-domain">الن��اق المخصص</Label>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>طرق الدفع</CardTitle>
                  <CardDescription>
                    قم بتفعيل وإعداد طرق الدفع التي تريد توفيرها لعملائك
                  </CardDescription>
                </div>
                {!isPaid && (
                  <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                    بوابات الدفع متاحة فقط في الباقات المدفوعة
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <QuickTip>
                كلما زادت طرق الدفع المتاحة في متجرك، زادت فرص إتمام عمليات الشراء. الباقة المجانية توفر الدفع عند الاستلام فقط، بينما توفر الباقات المدفوعة جميع بوابات الدفع الإلكتروني.
              </QuickTip>
              
              <div className="grid gap-6">
                <PaymentMethodItem 
                  id="cash-on-delivery"
                  title="الدفع عند الاستلام"
                  description="خيار شائع يتيح للعملاء الدفع نقداً عند استلام منتجاتهم"
                  checked={cashOnDelivery}
                  onCheckedChange={setCashOnDelivery}
                  icon={<Wallet className="h-5 w-5 text-gray-500 ml-2" />}
                  color="bg-green-500"
                  isPaidPlan={isPaid}
                  tooltipContent="يسمح للعملاء بالدفع نقداً عند استلام المنتجات"
                />
                
                <PaymentMethodItem 
                  id="my-fatoorah"
                  title="ماي فاتورة (MyFatoorah)"
                  description="بوابة دفع شاملة تدعم العديد من وسائل الدفع في الخليج"
                  checked={myFatoorah}
                  onCheckedChange={setMyFatoorah}
                  disabled={!isPaid}
                  icon={<CreditCard className="h-5 w-5 text-blue-500 ml-2" />}
                  color="bg-blue-500"
                  isPaidPlan={isPaid}
                  tooltipContent="بوابة دفع شاملة تدعم KNET وVisa وMastercard وغيرها من وسائل الدفع في الخليج"
                  badges={[
                    { text: "KNET", color: "bg-blue-50 text-blue-600" },
                    { text: "Visa", color: "bg-blue-50 text-blue-600" },
                    { text: "Mastercard", color: "bg-blue-50 text-blue-600" },
                    { text: "mada", color: "bg-blue-50 text-blue-600" },
                    { text: "Apple Pay", color: "bg-blue-50 text-blue-600" }
                  ]}
                />
                
                <PaymentMethodItem 
                  id="tabby"
                  title="تابي (Tabby)"
                  description="الدفع بالتقسيط بدون فوائد - اشتري الآن وادفع لاحقاً"
                  checked={tabby}
                  onCheckedChange={setTabby}
                  disabled={!isPaid}
                  icon={<CreditCard className="h-5 w-5 text-purple-500 ml-2" />}
                  color="bg-purple-500"
                  isPaidPlan={isPaid}
                  tooltipContent="خدمة تتيح للعملاء الدفع على أقساط بدون فوائد أو رسوم إضافية"
                  badges={[
                    { text: "قسّمها على 4", color: "bg-purple-50 text-purple-600" },
                    { text: "ادفع لاحقاً", color: "bg-purple-50 text-purple-600" }
                  ]}
                />
                
                <PaymentMethodItem 
                  id="paypal"
                  title="باي بال (PayPal)"
                  description="منصة دفع عالمية للعملاء الدوليين"
                  checked={paypal}
                  onCheckedChange={setPaypal}
                  disabled={!isPaid}
                  icon={<CreditCard className="h-5 w-5 text-blue-700 ml-2" />}
                  color="bg-blue-700"
                  isPaidPlan={isPaid}
                  tooltipContent="خدمة دفع عالمية مناسبة للعملاء الدوليين"
                  badges={[
                    { text: "PayPal", color: "bg-blue-100 text-blue-700" }
                  ]}
                />
              </div>
              
              {!isPaid && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100 mt-6">
                  <h3 className="text-base font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    ترقية للوصول لجميع بوابات الدفع
                  </h3>
                  <p className="text-sm text-blue-700 mb-4">
                    قم بترقية متجرك للباقة الأساسية أو الاحترافية للحصول على خيارات دفع متقدمة مثل ماي فاتورة وتابي وباي بال
                  </p>
                  <Button variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
                    <a href="/dashboard/settings?tab=billing">ترقية الآن</a>
                  </Button>
                </div>
              )}
              
              {myFatoorah && currentPlan === "premium" && (
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mt-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                    <CreditCard className="h-4 w-4 text-blue-700 mr-2" />
                    إعدادات ماي فاتورة
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="myfatoorah-mode" className="text-sm text-blue-700">بيئة الاختبار</Label>
                        <SettingTooltip content="استخدام بيئة الاختبار لتجربة عمليات الدفع دون إجراء معاملات حقيقية" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="myfatoorah-mode" className="data-[state=checked]:bg-blue-600" />
                        <Label htmlFor="myfatoorah-mode" className="text-xs text-blue-700">
                          تفعيل بيئة الاختبار (Sandbox)
                        </Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="myfatoorah-token" className="text-sm text-blue-700">رمز API الخاص بماي فاتورة</Label>
                        <SettingTooltip content="رمز API الذي يمكنك الحصول عليه من لوحة تحكم ماي فاتورة" />
                      </div>
                      <Input 
                        id="myfatoorah-token" 
                        placeholder="أدخل رمز API الخاص بك"
                        className="border-blue-200 focus:border-blue-400"
                      />
                      <div className="flex gap-1 text-xs text-blue-600 items-center">
                        <Info className="h-4 w-4" />
                        <span>يمكنك الحصول على رمز API من <a href="https://myfatoorah.com" target="_blank" className="underline">لوحة تحكم ماي فاتورة</a></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {tabby && currentPlan === "premium" && (
                <div className="bg-purple-50 p-5 rounded-lg border border-purple-100 mt-4">
                  <h3 className="text-sm font-medium text-purple-800 mb-3 flex items-center">
                    <CreditCard className="h-4 w-4 text-purple-700 mr-2" />
                    إعدادات تابي
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="tabby-mode" className="text-sm text-purple-700">بيئة الاختبار</Label>
                        <SettingTooltip content="استخدام بيئة الاختبار لتجربة عمليات الدفع دون إجراء معاملات حقيقية" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="tabby-mode" className="data-[state=checked]:bg-purple-600" />
                        <Label htmlFor="tabby-mode" className="text-xs text-purple-700">
                          تفعيل بيئة الاختبار (Sandbox)
                        </Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="tabby-public-key" className="text-sm text-purple-700">المفتاح العام</Label>
                        <SettingTooltip content="المفتاح العام الذي تحصل عليه من لوحة تحكم تابي" />
                      </div>
                      <Input 
                        id="tabby-public-key" 
                        placeholder="أدخل المفتاح العام"
                        className="border-purple-200 focus:border-purple-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="tabby-secret-key" className="text-sm text-purple-700">المفتاح السري</Label>
                        <SettingTooltip content="المفتاح السري الذي تحصل عليه من لوحة تحكم تابي" />
                      </div>
                      <Input 
                        id="tabby-secret-key" 
                        type="password"
                        placeholder="أدخل المفتاح السري"
                        className="border-purple-200 focus:border-purple-400"
                      />
                      <div className="flex gap-1 text-xs text-purple-600 items-center">
                        <Info className="h-4 w-4" />
                        <span>يمكنك الحصول على مفاتيح API من <a href="https://business.tabby.ai" target="_blank" className="underline">لوحة تحكم تابي للأعمال</a></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {paypal && currentPlan === "premium" && (
                <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 mt-4">
                  <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center">
                    <CreditCard className="h-4 w-4 text-blue-700 mr-2" />
                    إعدادات باي بال
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="paypal-sandbox" className="text-sm text-blue-700">بيئة الاختبار</Label>
                        <SettingTooltip content="استخدام بيئة الاختبار لتجربة عمليات الدفع دون إجراء معاملات حقيقية" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch id="paypal-sandbox" className="data-[state=checked]:bg-blue-600" />
                        <Label htmlFor="paypal-sandbox" className="text-xs text-blue-700">
                          تفعيل بيئة الاختبار (Sandbox)
                        </Label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="paypal-client-id" className="text-sm text-blue-700">معرف العميل (Client ID)</Label>
                        <SettingTooltip content="معرف العميل الذي تحصل عليه من لوحة تحكم باي بال للمطورين" />
                      </div>
                      <Input 
                        id="paypal-client-id" 
                        placeholder="أدخل معرف العميل"
                        className="border-blue-200 focus:border-blue-400"
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="paypal-secret" className="text-sm text-blue-700">المفتاح السري</Label>
                        <SettingTooltip content="المفتاح السري الذي تحصل عليه من لوحة تحكم باي بال للمطورين" />
                      </div>
                      <Input 
                        id="paypal-secret" 
                        type="password"
                        placeholder="أدخل المفتاح السري"
                        className="border-blue-200 focus:border-blue-400"
                      />
                      <div className="flex gap-1 text-xs text-blue-600 items-center">
                        <Info className="h-4 w-4" />
                        <span>يمكنك الحصول على مفاتيح API من <a href="https://developer.paypal.com" target="_blank" className="underline">لوحة تحكم باي بال للمطورين</a></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end">
                <Button onClick={() => toast.success("تم حفظ إعدادات طرق الدفع بنجاح")} className="bg-primary hover:bg-primary/90">
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
              
              {currentPlan === "free" && <PromotionAlert type="free" section="shipping" />}
              
              <div className="space-y-6">
                <div className="grid gap-6">
                  <PaymentMethodItem 
                    id="standard-shipping"
                    title="الشحن القياسي"
                    description="خدمة التوصيل الأساسية للعملاء بسعر ثابت"
                    checked={true}
                    onCheckedChange={() => {}}
                    icon={<Truck className="h-5 w-5 text-gray-500 ml-2" />}
                    color="bg-green-500"
                    isPaidPlan={true}
                    tooltipContent="خدمة الشحن الأساسية المتاحة لجميع الباقات"
                    additionalContent={
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pr-9">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Label htmlFor="shipping-cost">تكلفة الشحن</Label>
                            <SettingTooltip content="سعر الشحن الذي سيتم تطبيقه على الطلبات" />
                          </div>
                          <Input
                            id="shipping-cost"
                            type="number"
                            placeholder="5"
                            defaultValue="5"
                          />
                          <p className="text-xs text-gray-500">أدخل القيمة بالدينار الكويتي</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Label htmlFor="shipping-days">مدة التوصيل (أيام)</Label>
                            <SettingTooltip content="متوسط وقت التوصيل المتوقع بالأيام" />
                          </div>
                          <Input
                            id="shipping-days"
                            type="number"
                            placeholder="3"
                            defaultValue="3"
                          />
                          <p className="text-xs text-gray-500">عدد الأيام المتوقعة للتوصيل</p>
                        </div>
                      </div>
                    }
                  />
                  
                  <PaymentMethodItem 
                    id="free-shipping"
                    title="الشحن المجاني"
                    description="توفير شحن مجاني للطلبات التي تتجاوز مبلغ معين"
                    checked={false}
                    onCheckedChange={() => {}}
                    icon={<Package className="h-5 w-5 text-blue-500 ml-2" />}
                    color="bg-blue-500"
                    isPaidPlan={isPaid}
                    disabled={!isPaid}
                    tooltipContent="تفعيل خدمة الشحن المجاني عند تجاوز مبلغ معين"
                    additionalContent={
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pr-9">
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <Label htmlFor="free-shipping-threshold">الحد الأدنى للشحن المجاني</Label>
                            <SettingTooltip content="المبلغ الذي يجب أن يتجاوزه الطلب للحصول على شحن مجاني" />
                          </div>
                          <Input
                            id="free-shipping-threshold"
                            type="number"
                            placeholder="50"
                            disabled={!isPaid}
                            className={!isPaid ? "bg-gray-100" : ""}
                          />
                          <p className="text-xs text-gray-500">أدخل 0 لتفعيل الشحن المجاني لجميع الطلبات</p>
                        </div>
                      </div>
                    }
                  />
                  
                  <PaymentMethodItem 
                    id="linok-delivery"
                    title="توصيل Linok"
                    description="استخدام خدمة التوصيل الخاصة بمنصة Linok لإدارة الشحنات"
                    checked={false}
                    onCheckedChange={() => {}}
                    icon={<Truck className="h-5 w-5 text-purple-500 ml-2" />}
                    color="bg-purple-500"
                    isPaidPlan={isPaid}
                    disabled={!isPaid || currentPlan !== "premium"}
                    tooltipContent="خدمة توصيل مدارة بواسطة فريق Linok (متاحة فقط للباقة الاحترافية)"
                    badges={currentPlan === "premium" ? [
                      { text: "متاح للباقة الاحترافية فقط", color: "bg-purple-50 text-purple-600" }
                    ] : []}
                    additionalContent={
                      currentPlan === "premium" ? (
                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mt-4 pr-9">
                          <h3 className="text-sm font-medium text-purple-800 mb-3">تفاصيل خدمة توصيل Linok</h3>
                          <p className="text-sm text-purple-700 mb-4">
                            هذه الخدمة تتيح إرسال طلبات العملاء مباشرة إلى فريق التوصيل الخاص بمنصة Linok. سيقوم فريق Linok بإدارة عملية التوصيل وتتبع الشحنات ومتابعتها مع العملاء.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex items-center">
                                <Checkbox id="delivery-notifications" />
                                <label htmlFor="delivery-notifications" className="text-sm text-purple-700 mr-2">
                                  إرسال إشعارات للعملاء عند تحديث حالة الشحنة
                                </label>
                              </div>
                              <div className="flex items-center">
                                <Checkbox id="delivery-tracking" />
                                <label htmlFor="delivery-tracking" className="text-sm text-purple-700 mr-2">
                                  تفعيل تتبع الشحنات للعملاء
                                </label>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="delivery-note" className="text-sm text-purple-700">ملاحظات إضافية لفريق التوصيل</Label>
                              <Textarea 
                                id="delivery-note"
                                placeholder="أدخل أي تعليمات خاصة لفريق التوصيل"
                                className="border-purple-200 focus:border-purple-400"
                              />
                            </div>
                          </div>
                        </div>
                      ) : null
                    }
                  />
                  
                  <PaymentMethodItem 
                    id="custom-shipping-zones"
                    title="مناطق توصيل مخصصة"
                    description="تحديد مناطق توصيل مختلفة مع أسعار مخصصة لكل منطقة"
                    checked={false}
                    onCheckedChange={() => {}}
                    icon={<MapPin className="h-5 w-5 text-green-600 ml-2" />}
                    color="bg-green-600"
                    isPaidPlan={currentPlan === "premium"}
                    disabled={currentPlan !== "premium"}
                    tooltipContent="إضافة مناطق شحن متعددة مع أسعار مختلفة لكل منطقة (متاح فقط للباقة الاحترافية)"
                    badges={currentPlan === "premium" ? [
                      { text: "متاح للباقة الاحترافية فقط", color: "bg-green-50 text-green-600" }
                    ] : []}
                  />
                </div>
                
                {currentPlan !== "premium" && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100 mt-6">
                    <h3 className="text-base font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                      ترقية للوصول لجميع ميزات الشحن المتقدمة
                    </h3>
                    <p className="text-sm text-blue-700 mb-4">
                      قم بترقية متجرك للباقة الاحترافية للحصول على ميزات شحن متقدمة مثل خدمة توصيل Linok ومناطق التوصيل المخصصة
                    </p>
                    <Button variant="default" className="bg-blue-600 hover:bg-blue-700" asChild>
                      <a href="/dashboard/settings?tab=billing">ترقية الآن</a>
                    </Button>
                  </div>
                )}
                
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
                ضبط الإشعارات يساعدك ع��ى البقاء على اطلاع بأحدث التطورات في متجرك دون إزعاج غير ضروري.
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
                    <p className="text-sm text-gray-500">��ستلام تحديثات ونصائح لتطوير متجرك</p>
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
