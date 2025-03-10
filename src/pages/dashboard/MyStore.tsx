
import React, { useState, useEffect } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { normalizeStoreDomain } from "@/utils/url-helpers";
import {
  LoadingState,
  NoStoreFound,
  StoreHeader,
  StorePreview,
  StoreTips,
  StoreViewStats,
  StoreCustomizationCard
} from "@/features/dashboard/components/my-store";

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
    return <LoadingState />;
  }
  
  if (!storeData) {
    return <NoStoreFound />;
  }
  
  // Make sure domain is always lowercase for consistency
  const storeDomain = normalizeStoreDomain(storeData.domain_name || storeData.domain || '');
  const storeName = storeData.store_name || storeData.name;
  const customDomain = storeData.custom_domain || null;
  
  // Create a proper URL for the StorePreviewButton
  const storePreviewUrl = storeDomain ? `store/${storeDomain}` : '';
  
  return (
    <div className="container max-w-7xl mx-auto py-8 space-y-8">
      <StoreHeader storePreviewUrl={storePreviewUrl} customDomain={customDomain} />
      
      <Separator className="my-6" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <StorePreview 
            storeName={storeName} 
            storeDomain={storeDomain} 
            logoUrl={logoUrl}
            customDomain={customDomain}
          />
          <StoreTips />
        </div>
        
        <div className="space-y-6">
          <StoreCustomizationCard 
            storeId={storeData.id} 
            logoUrl={logoUrl} 
            onLogoUpdate={handleLogoUpdate} 
          />
          <StoreViewStats />
        </div>
      </div>
    </div>
  );
};

export default MyStore;
