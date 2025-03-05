import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import SaveButton from "@/components/ui/save-button";
import LogoUploader from "@/features/dashboard/components/LogoUploader";
import { formatStoreUrl, isValidDomainName } from "@/utils/url-utils";

interface GeneralSettingsProps {
  storeData: any;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ storeData }) => {
  const [storeValues, setStoreValues] = useState({
    storeName: "",
    email: "",
    phone: "",
    address: "",
    currency: "",
    language: "العربية",
    domainName: ""
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
        currency: storeData.currency || "SAR",
        language: "العربية",
        domainName: storeData.domain_name || ""
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
      
      // Validate domain name if it was changed
      if (storeValues.domainName !== storeData.domain_name) {
        if (!isValidDomainName(storeValues.domainName)) {
          toast.error("اسم النطاق يجب أن يحتوي على أحرف إنجليزية وأرقام وشرطات فقط");
          setIsSaving(false);
          return;
        }
        
        // Check domain availability
        const { data: existingDomain, error: domainError } = await supabase
          .from('stores')
          .select('id')
          .eq('domain_name', storeValues.domainName)
          .neq('id', storeData.id)
          .maybeSingle();
          
        if (domainError) {
          throw domainError;
        }
        
        if (existingDomain) {
          toast.error("اسم النطاق غير متاح، الرجاء اختيار اسم آخر");
          setIsSaving(false);
          return;
        }
      }
      
      const { error } = await supabase
        .from('stores')
        .update({
          store_name: storeValues.storeName,
          phone_number: storeValues.phone,
          domain_name: storeValues.domainName,
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
  
  // Display formatted domain for user
  const formattedDomainUrl = storeValues.domainName ? formatStoreUrl(storeValues.domainName) : '';
  
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
            <Label htmlFor="store-domain">اسم النطاق</Label>
            <div className="flex items-center mt-1">
              <Input 
                id="store-domain" 
                value={storeValues.domainName} 
                onChange={(e) => setStoreValues({...storeValues, domainName: e.target.value})}
                className="flex-1" 
                placeholder="example"
              />
              <span className="text-gray-500 mr-2">.linok.me</span>
            </div>
            {formattedDomainUrl && (
              <p className="text-sm text-muted-foreground mt-1">
                عنوان المتجر: {formattedDomainUrl}
              </p>
            )}
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
  );
};

export default GeneralSettings;
