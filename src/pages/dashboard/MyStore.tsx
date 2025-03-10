import React, { useState, useEffect } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import LogoUploader from "@/features/dashboard/components/LogoUploader";
import BannerManager from "@/features/dashboard/components/BannerManager";
import StoreFeatures from "@/features/dashboard/components/StoreFeatures";
import PromoBanner from "@/components/store/banner/PromoBanner";
import { Button } from "@/components/ui/button";
import { BellRing, Eye, ExternalLink, Layout, Palette, PencilRuler, Settings, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import StorePreviewButton from "@/features/dashboard/components/StorePreviewButton";

const MyStore = () => {
  const { storeData, isLoading, refetch } = useStoreData();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("logo");
  
  useEffect(() => {
    if (storeData?.logo_url) {
      setLogoUrl(storeData.logo_url);
    }
  }, [storeData]);
  
  const handleLogoUpdate = async (url: string | null) => {
    if (!storeData?.id) return;
    
    setLogoUrl(url);
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('stores')
        .update({ logo_url: url })
        .eq('id', storeData.id);
        
      if (error) throw error;
      toast.success("تم تحديث شعار المتجر بنجاح");
      refetch();
    } catch (error) {
      console.error("Error updating store logo:", error);
      toast.error("حدث خطأ أثناء تحديث شعار المتجر");
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!storeData) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Store className="w-8 h-8 text-muted-foreground" />
        </div>
        <div className="text-xl font-medium mb-2">لم يتم العثور على متجر</div>
        <div className="text-muted-foreground mb-6">الرجاء إنشاء متجر جديد أولاً</div>
        <Button variant="default" asChild>
          <a href="/create-store">إنشاء متجر جديد</a>
        </Button>
      </div>
    );
  }
  
  const storeDomain = storeData.domain_name || storeData.domain;
  const storeName = storeData.store_name || storeData.name;
  
  const storePreviewUrl = storeDomain ? `store/${storeDomain.toLowerCase()}` : '';
  
  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Store className="w-7 h-7 text-primary" />
            متجري
          </h1>
          <p className="text-muted-foreground mt-1">
            قم بإدارة مظهر متجرك وتخصيص العناصر المرئية لتحسين تجربة عملائك
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="text-sm gap-1.5"
            variant="outline"
            asChild
          >
            <a href={`/dashboard/settings`}>
              <Settings className="h-4 w-4" />
              إعدادات المتجر
            </a>
          </Button>
          <StorePreviewButton 
            storeUrl={storePreviewUrl} 
            className="shadow-sm bg-gradient-to-r from-primary/90 to-primary hover:from-primary hover:to-primary/90 transition-all text-white"
          />
        </div>
      </div>
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  معاينة المتجر
                </CardTitle>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs flex items-center gap-1"
                  onClick={() => window.open(`/store/${storeDomain}`, '_blank')}
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  فتح في نافذة جديدة
                </Button>
              </div>
              <CardDescription>
                هذه معاينة لكيفية ظهور متجرك للعملاء
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b">
                <div className="bg-white/50 flex items-center justify-between p-3">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {logoUrl && (
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-white shadow-sm flex items-center justify-center">
                        <img src={logoUrl} alt="شعار المتجر" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <span className="font-semibold">{storeName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      متصل
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs flex items-center gap-1 h-7"
                      onClick={() => window.open(`/store/${storeDomain}`, '_blank')}
                    >
                      <Eye className="h-3 w-3" />
                      زيارة المتجر
                    </Button>
                  </div>
                </div>
                
                <div className="p-0">
                  <PromoBanner storeDomain={storeDomain} />
                  
                  <div className="text-center py-10 bg-gray-50 mt-2 mx-2 mb-2 rounded-md border border-dashed border-gray-200">
                    <Store className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                    <h3 className="text-lg font-medium mb-1">معاينة منتجات المتجر</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-2 px-4">
                      هنا سيتم عرض منتجات متجرك بتنسيق جذاب. قم بإضافة منتجات من خلال قسم المنتجات.
                    </p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="mt-3"
                      asChild
                    >
                      <a href="/dashboard/products">
                        إضافة منتجات
                        <PencilRuler className="h-3.5 w-3.5 mr-1" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-primary/5 to-primary/10 py-3 flex justify-between items-center">
              <div className="flex items-center text-xs text-muted-foreground">
                <BellRing className="h-3.5 w-3.5 mr-1.5" />
                يمكنك معاينة التغييرات فوراً بعد تطبيقها
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs flex items-center gap-1 border-primary/20 bg-white"
                onClick={() => window.open(`/store/${storeDomain}`, '_blank')}
              >
                <Eye className="h-3.5 w-3.5" />
                معاينة كاملة
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden shadow-sm border-none">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-3">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                نصائح لتحسين المتجر
              </CardTitle>
              <CardDescription>
                إليك بعض النصائح التي تساعدك على تحسين مظهر وأداء متجرك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-md bg-amber-50/50">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-amber-900">قم بإضافة شعار متجرك</h3>
                    <p className="text-sm text-amber-700 mt-1">
                      يساعد شعار المتجر المميز على تعزيز هوية علامتك التجارية وجعلها أكثر احترافية وسهلة التذكر للعملاء.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-md bg-emerald-50/50">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-emerald-900">أضف بنرات ت��ويجية جذابة</h3>
                    <p className="text-sm text-emerald-700 mt-1">
                      البنرات الترويجية تساعد في عرض العروض والمنتجات الجديدة وجذب انتباه العملاء لزيادة المبيعات.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 border rounded-md bg-blue-50/50">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900">أبرز مميزات متجرك</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      عرض مميزات متجرك مثل الشحن السريع أو الدفع الآمن يزيد من ثقة العملاء ويحسن تجربة الشراء.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="shadow-md border-none overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="text-lg">تخصيص المتجر</CardTitle>
              <CardDescription>
                قم بتخصيص عناصر متجرك وشكله العام
              </CardDescription>
            </CardHeader>
            
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full grid grid-cols-3 rounded-none bg-muted/70 p-0">
                <TabsTrigger value="logo" className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none py-2">
                  الشعار
                </TabsTrigger>
                <TabsTrigger value="banners" className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none py-2">
                  البنرات
                </TabsTrigger>
                <TabsTrigger value="features" className="rounded-none data-[state=active]:bg-white data-[state=active]:shadow-none py-2">
                  المميزات
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="logo" className="p-4 pt-6">
                <div className="space-y-4">
                  <div className="text-center border-b pb-4">
                    <h3 className="font-medium text-base mb-1">شعار المتجر</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      قم بتحميل شعار لمتجرك ليظهر في صفحات المتجر
                    </p>
                    <div className="flex justify-center">
                      <LogoUploader 
                        logoUrl={logoUrl} 
                        onLogoUpdate={handleLogoUpdate} 
                        storeId={storeData.id} 
                      />
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-2">
                    <h4 className="font-medium">نصائح للشعار المثالي:</h4>
                    <ul className="list-disc list-inside space-y-1 mr-2">
                      <li>استخدم صورة بخلفية شفافة (PNG)</li>
                      <li>يفضل استخدام أبعاد متساوية (مربع)</li>
                      <li>الحجم المثالي: 512×512 بكسل</li>
                      <li>تجنب النصوص الصغيرة في الشعار</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="banners">
                <BannerManager storeId={storeData.id} />
              </TabsContent>
              
              <TabsContent value="features">
                <StoreFeatures storeId={storeData.id} />
              </TabsContent>
            </Tabs>
          </Card>
          
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-primary" />
                إحصائيات المعاينة
              </CardTitle>
              <CardDescription className="text-xs">
                عدد مرات معاينة متجرك خلال الأسبوع الماضي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between border rounded-lg p-3 bg-muted/20">
                <div className="text-2xl font-bold text-primary">24</div>
                <div className="text-xs text-muted-foreground">معاينة</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyStore;
