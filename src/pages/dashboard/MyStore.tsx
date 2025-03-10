
import React, { useState, useEffect } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import LogoUploader from "@/features/dashboard/components/LogoUploader";
import BannerManager from "@/features/dashboard/components/BannerManager";
import StoreFeatures from "@/features/dashboard/components/StoreFeatures";
import PromoBanner from "@/components/store/banner/PromoBanner";
import { Button } from "@/components/ui/button";
import { Eye, Store } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import StorePreviewButton from "@/features/dashboard/components/StorePreviewButton";

const MyStore = () => {
  const { storeData, isLoading, refetch } = useStoreData();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
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
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (!storeData) {
    return (
      <div className="text-center py-8">
        <div className="text-lg font-medium mb-2">لم يتم العثور على متجر</div>
        <div className="text-gray-500">الرجاء إنشاء متجر جديد أولا</div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-7xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">متجري</h1>
          <p className="text-muted-foreground">إدارة مظهر وإعدادات متجرك</p>
        </div>
        <StorePreviewButton storeUrl={`/store/${storeData.domain_name || storeData.domain}`} />
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>معاينة المتجر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md overflow-hidden">
                <div className="bg-primary-50 flex items-center justify-between px-3 py-2 border-b">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {logoUrl && (
                      <div className="w-8 h-8 rounded-md overflow-hidden bg-white shadow-sm">
                        <img src={logoUrl} alt="شعار المتجر" className="w-full h-full object-contain" />
                      </div>
                    )}
                    <span className="font-semibold">{storeData.store_name || storeData.name}</span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs flex items-center gap-1"
                    onClick={() => window.open(`/store/${storeData.domain_name || storeData.domain}`, '_blank')}
                  >
                    <Eye className="h-3 w-3" />
                    زيارة المتجر
                  </Button>
                </div>
                
                <div className="p-4">
                  <PromoBanner storeDomain={storeData.domain_name || storeData.domain} />
                  
                  <div className="text-center py-8 border rounded-md bg-gray-50 mt-4">
                    <Store className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                    <h3 className="text-lg font-medium">معاينة منتجات المتجر</h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto mt-2">
                      هنا سيتم عرض منتجات متجرك. قم بإضافة منتجات من خلال قسم المنتجات.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Tabs defaultValue="logo">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="logo">شعار المتجر</TabsTrigger>
              <TabsTrigger value="banners">البنرات</TabsTrigger>
              <TabsTrigger value="features">المميزات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="logo">
              <Card>
                <CardHeader>
                  <CardTitle>شعار المتجر</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <LogoUploader 
                    logoUrl={logoUrl} 
                    onLogoUpdate={handleLogoUpdate} 
                    storeId={storeData.id} 
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="banners">
              <BannerManager storeId={storeData.id} />
            </TabsContent>
            
            <TabsContent value="features">
              <StoreFeatures storeId={storeData.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MyStore;
