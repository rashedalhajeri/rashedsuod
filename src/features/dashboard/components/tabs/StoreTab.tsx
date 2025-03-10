
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogoUploader from "@/features/dashboard/components/LogoUploader";
import BannerManager from "@/features/dashboard/components/BannerManager";
import StoreFeatures from "@/features/dashboard/components/StoreFeatures";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SaveButton from "@/components/ui/save-button";

interface StoreTabProps {
  storeData: any;
}

const StoreTab: React.FC<StoreTabProps> = ({ storeData }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(storeData?.logo_url || null);
  const [banners, setBanners] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleLogoUpdate = async (url: string | null) => {
    setLogoUrl(url);
    
    // Save logo URL to database
    try {
      setIsSaving(true);
      const { error } = await supabase
        .from('stores')
        .update({ logo_url: url })
        .eq('id', storeData.id);
        
      if (error) throw error;
      toast.success("تم تحديث شعار المتجر بنجاح");
    } catch (error) {
      console.error("Error updating store logo:", error);
      toast.error("حدث خطأ أثناء تحديث شعار المتجر");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="logo">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="logo">شعار المتجر</TabsTrigger>
          <TabsTrigger value="banners">البنرات الإعلانية</TabsTrigger>
          <TabsTrigger value="features">مميزات المتجر</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>شعار المتجر</CardTitle>
              <CardDescription>
                قم برفع شعار متجرك ليظهر للعملاء في صفحة المتجر والواجهة الرئيسية
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full max-w-sm">
                <LogoUploader 
                  logoUrl={logoUrl} 
                  onLogoUpdate={handleLogoUpdate} 
                  storeId={storeData.id} 
                />
              </div>
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
  );
};

export default StoreTab;
