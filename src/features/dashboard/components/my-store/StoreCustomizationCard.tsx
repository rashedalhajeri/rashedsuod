
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LogoUploader from "@/features/dashboard/components/LogoUploader";
import BannerManager from "@/features/dashboard/components/BannerManager";
import StoreFeatures from "@/features/dashboard/components/StoreFeatures";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StoreCustomizationCardProps {
  storeId: string;
  logoUrl: string | null;
  onLogoUpdate: (url: string | null) => void;
}

const StoreCustomizationCard: React.FC<StoreCustomizationCardProps> = ({
  storeId,
  logoUrl,
  onLogoUpdate
}) => {
  const [activeTab, setActiveTab] = useState("logo");

  return (
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
                  onLogoUpdate={onLogoUpdate} 
                  storeId={storeId} 
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
          <BannerManager storeId={storeId} />
        </TabsContent>
        
        <TabsContent value="features">
          <StoreFeatures storeId={storeId} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default StoreCustomizationCard;
