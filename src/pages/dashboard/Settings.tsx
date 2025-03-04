import React, { useState, useRef, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import SubscriptionPlans from "@/features/dashboard/components/SubscriptionPlans";
import { Separator } from "@/components/ui/separator";
import { Store, CreditCard, Bell, Shield, Globe, Truck, FileText, ChevronLeft, ChevronRight, Wallet, Calendar, Clock, Info, HelpCircle, Package, MapPin, Upload, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import PromotionAlert from "@/features/dashboard/components/PromotionAlert";
import PaymentMethodItem from "@/features/dashboard/components/PaymentMethodItem";
import ShippingMethodForm from "@/features/dashboard/components/ShippingMethodForm";
import useStoreData from "@/hooks/use-store-data";
import SaveButton from "@/components/ui/save-button";
import LogoUploader from "@/features/dashboard/components/LogoUploader";

type TabsType = 'general' | 'payment' | 'shipping' | 'integrations' | 'billing';

const Settings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const tabRef = useRef<HTMLDivElement>(null);
  const searchParams = new URLSearchParams(location.search);
  const [activeTab, setActiveTab] = useState<TabsType>((searchParams.get("tab") as TabsType) || "general");
  
  // استخدام useStoreData لجلب بيانات المتجر
  const { data: storeData, isLoading, error } = useStoreData();
  
  // قيم الإدخال من بيانات المتجر
  const [storeValues, setStoreValues] = useState({
    storeName: "",
    email: "",
    phone: "",
    address: "",
    currency: "",
    language: "العربية" // ثابت حاليًا
  });
  
  // حالة طرق الدفع والشحن - تم نقلها هنا ليتوافق ترتيب الـ hooks
  const [paymentMethods, setPaymentMethods] = useState({
    "cash-on-delivery": true,
    "credit-card": false,
    "apple-pay": false,
    "mada": false,
  });
  
  const [shippingMethods, setShippingMethods] = useState({
    "standard-shipping": true,
    "free-shipping": false,
    "linok-delivery": false,
    "custom-zones": false,
  });
  
  // حالة حفظ التغييرات
  const [isSaving, setIsSaving] = useState(false);
  
  // حالة شعار المتجر
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  
  // تحديث القيم عند استرجاع بيانات المتجر
  useEffect(() => {
    if (storeData) {
      setStoreValues({
        storeName: storeData.store_name || "",
        email: "", // يمكن إضافته لاحقًا في قاعدة البيانات إذا لزم الأمر
        phone: storeData.phone_number || "",
        address: "", // يمكن إضافته لاحقًا في قاعدة البيانات إذا لزم الأمر
        currency: storeData.currency || "SAR",
        language: "العربية" // ثابت حاليًا
      });
      
      // تحديث شعار المتجر إذا كان موجودًا
      if (storeData.logo_url) {
        setLogoUrl(storeData.logo_url);
      }
    }
  }, [storeData]);
  
  useEffect(() => {
    // عند تحميل الصفحة، تحقق من وجود علامة التبويب في URL وقم بتعيينها كعلامة التبويب النشطة
    const tabFromUrl = searchParams.get("tab") as TabsType;
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);
  
  const handleTabChange = (tab: TabsType) => {
    setActiveTab(tab);
    searchParams.set("tab", tab);
    navigate({ pathname: location.pathname, search: searchParams.toString() });
  };
  
  // تحديث حالة طرق الدفع
  const handlePaymentMethodChange = (id: string, checked: boolean) => {
    setPaymentMethods(prev => ({
      ...prev,
      [id]: checked
    }));
    
    toast.success(checked ? "تم تفعيل طريقة الدفع بنجاح" : "تم تعطيل طريقة الدفع");
  };
  
  // تحديث حالة طرق الشحن
  const handleShippingMethodChange = (id: string, checked: boolean) => {
    setShippingMethods(prev => ({
      ...prev,
      [id]: checked
    }));
    
    toast.success(checked ? "تم تفعيل طريقة الشحن بنجاح" : "تم تعطيل طريقة الشحن");
  };
  
  // تحديث شعار المتجر
  const handleLogoUpdate = (url: string | null) => {
    setLogoUrl(url);
  };
  
  // حفظ التغييرات
  const handleSaveGeneralSettings = async () => {
    try {
      setIsSaving(true);
      
      if (!storeData?.id) {
        toast.error("لم يتم العثور على معرف المتجر");
        return;
      }
      
      const { error } = await supabase
        .from('stores')
        .update({
          store_name: storeValues.storeName,
          phone_number: storeValues.phone,
          logo_url: logoUrl
        })
        .eq('id', storeData.id);
      
      if (error) {
        throw error;
      }
      
      toast.success("تم حفظ التغييرات بنجاح");
    } catch (error) {
      console.error("خطأ في حفظ التغييرات:", error);
      toast.error("حدث خطأ في حفظ التغييرات");
    } finally {
      setIsSaving(false);
    }
  };
  
  // خطأ تحميل بيانات المتجر
  if (error) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">
          <p className="text-red-500">حدث خطأ في تحميل بيانات المتجر. يرجى المحاولة مرة أخرى.</p>
        </div>
      </DashboardLayout>
    );
  }
  
  // جاري تحميل بيانات المتجر
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-4 text-center">
          <p>جاري تحميل بيانات المتجر...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  // مثال لنوع الباقة الحالية - نأخذها من بيانات المتجر الفعلية
  const subscriptionType = storeData?.subscription_plan || "free";
  const isPaidPlan = subscriptionType !== "free";
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-bold tracking-tight">إعدادات المتجر</h1>
        
        <Tabs defaultValue="general" value={activeTab} className="w-full" onValueChange={(tab) => handleTabChange(tab as TabsType)}>
          <TabsList className="grid grid-cols-3 lg:grid-cols-5 w-full bg-white border">
            <TabsTrigger value="general">عام</TabsTrigger>
            <TabsTrigger value="payment">الدفع</TabsTrigger>
            <TabsTrigger value="shipping">الشحن</TabsTrigger>
            <TabsTrigger value="integrations">التكاملات</TabsTrigger>
            <TabsTrigger value="billing">الباقة</TabsTrigger>
          </TabsList>
          
          {/* إعدادات عامة */}
          <TabsContent value="general">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات المتجر</CardTitle>
                  <CardDescription>تعديل اسم المتجر والشعار والوصف</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="store-name">اسم المتجر</Label>
                      <Input 
                        id="store-name" 
                        value={storeValues.storeName} 
                        onChange={(e) => setStoreValues({...storeValues, storeName: e.target.value})}
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-logo">شعار المتجر</Label>
                      <LogoUploader 
                        logoUrl={logoUrl} 
                        onLogoUpdate={handleLogoUpdate} 
                        storeId={storeData?.id}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="store-description">وصف المتجر</Label>
                    <Textarea 
                      id="store-description" 
                      defaultValue={`متجر ${storeValues.storeName || storeData?.store_name} الإلكتروني`} 
                      className="mt-1 resize-none" 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الاتصال</CardTitle>
                  <CardDescription>تعديل معلومات الاتصال الخاصة بالمتجر</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="store-email">البريد الإلكتروني</Label>
                      <Input 
                        type="email" 
                        id="store-email" 
                        value={storeValues.email} 
                        onChange={(e) => setStoreValues({...storeValues, email: e.target.value})}
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-phone">رقم الهاتف</Label>
                      <Input 
                        type="tel" 
                        id="store-phone" 
                        value={storeValues.phone} 
                        onChange={(e) => setStoreValues({...storeValues, phone: e.target.value})}
                        className="mt-1 dir-ltr" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="store-address">العنوان</Label>
                    <Input 
                      id="store-address" 
                      value={storeValues.address} 
                      onChange={(e) => setStoreValues({...storeValues, address: e.target.value})}
                      className="mt-1" 
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>العملة واللغة</CardTitle>
                  <CardDescription>تعديل العملة واللغة الافتراضية للمتجر</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="store-currency">العملة</Label>
                      <Input 
                        id="store-currency" 
                        value={storeValues.currency} 
                        className="mt-1" 
                        disabled 
                      />
                    </div>
                    <div>
                      <Label htmlFor="store-language">اللغة</Label>
                      <Input 
                        id="store-language" 
                        value={storeValues.language} 
                        className="mt-1" 
                        disabled 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <SaveButton onClick={handleSaveGeneralSettings} isSaving={isSaving} />
            </div>
          </TabsContent>
          
          {/* إعدادات الدفع */}
          <TabsContent value="payment">
            <div className="space-y-4">
              <PromotionAlert type={subscriptionType} section="payment" />
              
              <div className="space-y-3">
                <PaymentMethodItem
                  id="cash-on-delivery"
                  title="الدفع عند الاستلام"
                  description="السماح للعملاء بالدفع نقدًا عند استلام الطلب"
                  checked={paymentMethods["cash-on-delivery"]}
                  onCheckedChange={(checked) => handlePaymentMethodChange("cash-on-delivery", checked)}
                  isPaidPlan={true}
                  icon={<Wallet className="h-5 w-5" />}
                  color="bg-primary-500"
                  tooltipContent="عند تفعيل هذا الخيار، سيتمكن العملاء من الدفع نقدًا عند استلام الطلب"
                />
                
                <PaymentMethodItem
                  id="credit-card"
                  title="بطاقات الائتمان"
                  description="قبول الدفع عبر بطاقات فيزا وماستركارد"
                  checked={paymentMethods["credit-card"]}
                  onCheckedChange={(checked) => handlePaymentMethodChange("credit-card", checked)}
                  disabled={!isPaidPlan}
                  isPaidPlan={isPaidPlan}
                  icon={<CreditCard className="h-5 w-5" />}
                  color="bg-blue-500"
                  tooltipContent="قبول الدفع عبر بطاقات الائتمان العالمية"
                  badges={[
                    { text: "رسوم 2.9% لكل عملية", color: "bg-blue-50 text-blue-700" }
                  ]}
                />
                
                <PaymentMethodItem
                  id="mada"
                  title="مدى"
                  description="قبول الدفع عبر بطاقات مدى المحلية"
                  checked={paymentMethods["mada"]}
                  onCheckedChange={(checked) => handlePaymentMethodChange("mada", checked)}
                  disabled={!isPaidPlan}
                  isPaidPlan={isPaidPlan}
                  icon={<img src="/payment-icons/mada.png" alt="Mada" className="h-5 w-5 object-contain" />}
                  color="bg-green-500"
                  tooltipContent="قبول الدفع عبر بطاقات مدى المحلية"
                  badges={[
                    { text: "رسوم 2.5% لكل عملية", color: "bg-green-50 text-green-700" }
                  ]}
                />
                
                <PaymentMethodItem
                  id="apple-pay"
                  title="Apple Pay"
                  description="قبول الدفع عبر خدمة Apple Pay"
                  checked={paymentMethods["apple-pay"]}
                  onCheckedChange={(checked) => handlePaymentMethodChange("apple-pay", checked)}
                  disabled={!isPaidPlan}
                  isPaidPlan={isPaidPlan}
                  icon={<svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.72 6.72c-1.967 0-2.825 1.388-4.205 1.388-1.413 0-2.495-1.388-4.204-1.388-1.677 0-3.459 1.023-4.556 2.988-1.568 2.977-.41 7.367 1.116 9.79.742 1.083 1.624 2.296 2.781 2.258 1.116-.041 1.536-.727 2.879-.727 1.341 0 1.726.727 2.88.702 1.198-.023 1.96-1.08 2.7-2.164.847-1.235 1.194-2.445 1.22-2.51-.026-.025-2.345-.904-2.37-3.582-.02-2.234 1.82-3.306 1.904-3.356-.727-1.235-2.426-1.379-3.015-1.41l-.13.01zM15.29.028C13.752.704 12.704 2.03 12.28 3.33c1.391.11 2.83-.797 3.72-1.796.8-.921 1.416-2.206 1.229-3.506h.062z"></path></svg>}
                  color="bg-black"
                  tooltipContent="قبول الدفع عبر خدمة Apple Pay"
                  badges={[
                    { text: "رسوم 2.5% لكل عملية", color: "bg-gray-100 text-gray-700" }
                  ]}
                />
              </div>
            </div>
          </TabsContent>
          
          {/* إعدادات الشحن */}
          <TabsContent value="shipping">
            <div className="space-y-4">
              <PromotionAlert type={subscriptionType} section="shipping" />
              
              <div className="space-y-3">
                <PaymentMethodItem
                  id="standard-shipping"
                  title="الشحن القياسي"
                  description="خيارات الشحن الأساسية للمتجر"
                  checked={shippingMethods["standard-shipping"]}
                  onCheckedChange={(checked) => handleShippingMethodChange("standard-shipping", checked)}
                  isPaidPlan={true}
                  icon={<Truck className="h-5 w-5" />}
                  color="bg-primary-500"
                  tooltipContent="إعدادات الشحن القياسي للمتجر"
                  additionalContent={
                    <ShippingMethodForm isPaidPlan={isPaidPlan} />
                  }
                />
                
                <PaymentMethodItem
                  id="linok-delivery"
                  title="توصيل Linok"
                  description="استخدام خدمة توصيل Linok لتوصيل الطلبات بسرعة واحترافية"
                  checked={shippingMethods["linok-delivery"]}
                  onCheckedChange={(checked) => handleShippingMethodChange("linok-delivery", checked)}
                  isPaidPlan={isPaidPlan}
                  icon={<div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold">L</div>}
                  color="bg-primary-500"
                  tooltipContent="عند تفعيل هذه الميزة، سيتم تحويل الطلبات تلقائيًا إلى نظام توصيل Linok"
                  badges={[
                    { text: "سريع وموثوق", color: "bg-primary-50 text-primary-700" },
                    { text: "تتبع مباشر", color: "bg-blue-50 text-blue-700" }
                  ]}
                />
              </div>
              
              <Card className="border-dashed border-gray-300 bg-gray-50/50">
                <CardContent className="p-6 flex flex-col items-center">
                  <Package className="h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-md font-medium text-gray-700 mb-1">مميزات شحن إضافية قادمة قريبًا</h3>
                  <p className="text-sm text-gray-500 text-center mb-3">
                    نعمل على إضافة المزيد من خيارات الشحن والتكامل مع شركات الشحن المحلية والعالمية
                  </p>
                  <Button variant="outline" size="sm" className="text-xs">
                    اقتراح ميزة جديدة
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* تكاملات */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>تكاملات قادمة</CardTitle>
                <CardDescription>
                  ربط متجرك مع خدمات أخرى لتوسيع إمكانياته
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>نحن نعمل على إضافة المزيد من التكاملات مع خدمات أخرى مثل:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Google Analytics</li>
                  <li>Facebook Pixel</li>
                  <li>Mailchimp</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* الباقة */}
          <TabsContent value="billing">
            <div className="space-y-6">
              <SubscriptionPlans />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
