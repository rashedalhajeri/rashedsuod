
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
import { Store, CreditCard, Bell, Shield, Globe, Truck, FileText, ChevronLeft, ChevronRight, Wallet, Calendar, Clock, Info, HelpCircle, Package, MapPin, PaintBucket, Eye, Link, Copy, ExternalLink, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import PaymentMethodItem from "@/features/dashboard/components/PaymentMethodItem";
import ShippingMethodForm from "@/features/dashboard/components/ShippingMethodForm";
import useStoreData, { isPaidPlan } from "@/hooks/use-store-data";
import SaveButton from "@/components/ui/save-button";
import LogoUploader from "@/features/dashboard/components/LogoUploader";
import StoreThemes from "@/features/dashboard/components/StoreThemes";

const Settings = () => {
  const { data: storeData } = useStoreData();
  const [activeTab, setActiveTab] = useState("store");
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [storeLogoUrl, setStoreLogoUrl] = useState<string | null>(null);
  const [storeDescription, setStoreDescription] = useState<string>("");
  
  // Set initial logo URL and description from store data
  useEffect(() => {
    if (storeData?.logo_url) {
      setStoreLogoUrl(storeData.logo_url);
    }
    // Check if store description exists in storeData and use it
    if (storeData?.description) {
      setStoreDescription(storeData.description);
    }
  }, [storeData]);
  
  // Function to handle logo update
  const handleLogoUpdate = (url: string | null) => {
    setStoreLogoUrl(url);
    // You can add the logic to save the logo URL to the database here
  };
  
  // Function to handle description change
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setStoreDescription(e.target.value);
  };
  
  // Function to handle save button click - making it async to return a Promise
  const handleSaveClick = async (): Promise<void> => {
    setIsSaving(true);
    
    // Return a Promise to match the expected type
    return new Promise((resolve) => {
      // Simulate saving data
      setTimeout(() => {
        setIsSaving(false);
        toast.success("تم حفظ الإعدادات بنجاح");
        resolve();
      }, 1500);
    });
  };
  
  // Function to copy store URL
  const copyStoreUrl = () => {
    if (!storeData?.domain_name) return;
    
    const storeUrl = `/store-preview/${storeData.domain_name}`;
    navigator.clipboard.writeText(window.location.origin + storeUrl);
    setIsCopied(true);
    
    toast.success("تم نسخ رابط المتجر");
    
    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  };
  
  const openStorePreview = () => {
    if (!storeData?.domain_name) return;
    window.open(`/store-preview/${storeData.domain_name}`, '_blank');
  };

  // Check if current subscription is paid
  const isCurrentPaidPlan = storeData ? isPaidPlan(storeData.subscription_plan) : false;
  
  // Mock payment methods data
  const paymentMethods = [
    {
      id: "cash-on-delivery",
      title: "الدفع عند الاستلام",
      description: "السماح للعملاء بالدفع نقدًا عند استلام الطلب",
      checked: true,
      color: "bg-green-500",
      icon: <Wallet className="h-5 w-5" />,
      tooltipContent: "طريقة دفع بسيطة تتيح للعملاء الدفع عند استلام الطلب",
      badges: []
    },
    {
      id: "credit-card",
      title: "بطاقات الائتمان",
      description: "قبول المدفوعات عبر بطاقات الائتمان والخصم",
      checked: isCurrentPaidPlan,
      color: "bg-blue-500",
      icon: <CreditCard className="h-5 w-5" />,
      tooltipContent: "دمج بوابات الدفع الإلكتروني (متاح في الباقات المدفوعة)",
      badges: [{ text: "الأكثر استخدامًا", color: "bg-blue-100 text-blue-700" }]
    },
    {
      id: "bank-transfer",
      title: "التحويل البنكي",
      description: "قبول التحويلات البنكية المباشرة",
      checked: false,
      color: "bg-purple-500",
      icon: <Globe className="h-5 w-5" />,
      tooltipContent: "السماح للعملاء بالدفع عبر التحويل البنكي المباشر",
      badges: []
    }
  ];
  
  return (
    <DashboardLayout>
      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">إعدادات المتجر</h1>
              <p className="text-muted-foreground">تخصيص إعدادات متجرك وضبط الخيارات</p>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
              <TabsTrigger value="store" className="gap-2">
                <Store className="h-4 w-4" />
                <span className="hidden sm:inline">متجري</span>
              </TabsTrigger>
              <TabsTrigger value="payment" className="gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden sm:inline">الدفع</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <PaintBucket className="h-4 w-4" />
                <span className="hidden sm:inline">المظهر</span>
              </TabsTrigger>
              <TabsTrigger value="shipping" className="gap-2">
                <Truck className="h-4 w-4" />
                <span className="hidden sm:inline">الشحن</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="gap-2">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">مشاهدة المتجر</span>
              </TabsTrigger>
            </TabsList>
            
            {/* قسم إعدادات المتجر */}
            <TabsContent value="store" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>معلومات المتجر</CardTitle>
                  <CardDescription>
                    تعديل معلومات المتجر الأساسية
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">اسم المتجر</Label>
                      <Input id="storeName" defaultValue={storeData?.store_name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="domainName">اسم النطاق</Label>
                      <Input id="domainName" defaultValue={storeData?.domain_name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeDescription">وصف المتجر</Label>
                      <Textarea
                        id="storeDescription"
                        placeholder="وصف تفصيلي عن متجرك"
                        value={storeDescription}
                        onChange={handleDescriptionChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>شعار المتجر</Label>
                      <LogoUploader 
                        logoUrl={storeLogoUrl} 
                        onLogoUpdate={handleLogoUpdate}
                        storeId={storeData?.id}
                      />
                    </div>
                  </div>
                  <SaveButton isSaving={isSaving} onClick={handleSaveClick} />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* قسم إعدادات الدفع */}
            <TabsContent value="payment" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الدفع</CardTitle>
                  <CardDescription>
                    إدارة طرق الدفع المتاحة لزبائنك
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paymentMethods.map((method) => (
                    <PaymentMethodItem
                      key={method.id}
                      id={method.id}
                      title={method.title}
                      description={method.description}
                      checked={method.checked}
                      onCheckedChange={() => {}}
                      isPaidPlan={method.id === "cash-on-delivery" ? true : isCurrentPaidPlan}
                      icon={method.icon}
                      color={method.color}
                      tooltipContent={method.tooltipContent}
                      badges={method.badges}
                    />
                  ))}
                  <Button>إضافة طريقة دفع جديدة</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* قسم مظهر المتجر */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>مظهر المتجر</CardTitle>
                  <CardDescription>
                    تخصيص مظهر وتصميم المتجر
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <StoreThemes />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* قسم إعدادات الشحن */}
            <TabsContent value="shipping" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات الشحن</CardTitle>
                  <CardDescription>
                    تحديد خيارات الشحن المتاحة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Removed title and description props from ShippingMethodForm components */}
                  <ShippingMethodForm isPaidPlan={isCurrentPaidPlan} />
                  <ShippingMethodForm isPaidPlan={isCurrentPaidPlan} />
                  <ShippingMethodForm isPaidPlan={isCurrentPaidPlan} />
                  <Button>إضافة طريقة شحن جديدة</Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* قسم معاينة المتجر */}
            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>معاينة المتجر</CardTitle>
                  <CardDescription>
                    قم بمعاينة متجرك كما سيظهر للزبائن
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* معاينة المتجر */}
                  <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative border">
                    <iframe 
                      src={storeData?.domain_name ? `/store-preview/${storeData.domain_name}` : '/store-preview/demo-store'} 
                      className="w-full h-full border-0"
                      title="معاينة المتجر"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Button onClick={openStorePreview} className="bg-primary/90 hover:bg-primary">
                        <ExternalLink className="h-5 w-5 ml-2" />
                        فتح المعاينة
                      </Button>
                    </div>
                  </div>
                  
                  {/* رابط المتجر */}
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">رابط المتجر</h3>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div className="flex-1 bg-muted p-3 rounded-md border">
                        <code className="text-sm truncate block" dir="ltr">
                          {window.location.origin}/store-preview/{storeData?.domain_name || 'demo-store'}
                        </code>
                      </div>
                      <Button size="icon" variant="outline" onClick={copyStoreUrl}>
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                      <Button onClick={openStorePreview}>
                        <ExternalLink className="h-4 w-4 ml-1" />
                        فتح
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-800">
                    <p className="text-sm">هذه معاينة فقط. قد لا تعمل بعض الميزات حتى يتم نشر المتجر بشكل رسمي.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
