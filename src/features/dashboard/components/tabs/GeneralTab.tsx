import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SaveButton from "@/components/ui/save-button";
import LogoUploader from "@/features/dashboard/components/LogoUploader";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface GeneralTabProps {
  storeData: any;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ storeData }) => {
  const [storeValues, setStoreValues] = useState({
    storeName: "",
    email: "",
    phone: "",
    address: "",
    currency: "KWD",
    language: "العربية"
  });
  
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (storeData) {
      setStoreValues({
        storeName: storeData.store_name || "",
        email: "",
        phone: storeData.phone_number || "",
        address: "",
        currency: "KWD",
        language: "العربية"
      });
      
      if (storeData.logo_url) {
        setLogoUrl(storeData.logo_url);
      }
    }
  }, [storeData]);

  const handleLogoUpdate = (url: string | null) => {
    setLogoUrl(url);
  };

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
          logo_url: logoUrl,
          currency: "KWD"
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

  return (
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
          <CardDescription>العملة الافتراضية للمتجر هي الدينار الكويتي</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="store-currency">العملة</Label>
              <Input 
                id="store-currency" 
                value="الدينار الكويتي (KWD)" 
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
  );
};

export default GeneralTab;
