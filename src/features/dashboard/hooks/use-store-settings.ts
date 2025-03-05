
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { isValidDomainName } from "@/utils/url-utils";

export const useStoreSettings = (storeData: any) => {
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
  
  const handleStoreValueChange = (field: string, value: string) => {
    setStoreValues({
      ...storeValues,
      [field]: value
    });
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
  
  return {
    storeValues,
    logoUrl,
    isSaving,
    handleLogoUpdate,
    handleStoreValueChange,
    handleSaveGeneralSettings
  };
};
