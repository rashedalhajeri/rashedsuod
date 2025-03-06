
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { StoreFormData } from "../types";
import LogoUploader from "@/features/dashboard/components/LogoUploader";
import { Upload, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface StoreMediaStepProps {
  formData: StoreFormData;
  handleMediaChange: (name: string, value: string | null) => void;
  tempStoreId: string;
}

const StoreMediaStep: React.FC<StoreMediaStepProps> = ({
  formData,
  handleMediaChange,
  tempStoreId,
}) => {
  const [uploadingBanner, setUploadingBanner] = useState(false);
  
  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة فقط');
      return;
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('حجم الصورة كبير جدًا. يجب أن يكون أقل من 5 ميغابايت');
      return;
    }
    
    setUploadingBanner(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `banner_${tempStoreId}_${Date.now()}.${fileExt}`;
      const filePath = `store_banners/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('store_assets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('store_assets')
        .getPublicUrl(filePath);
      
      handleMediaChange("bannerUrl", urlData.publicUrl);
      toast.success('تم رفع صورة البانر بنجاح');
    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      toast.error('حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploadingBanner(false);
    }
  };
  
  const handleRemoveBanner = () => {
    handleMediaChange("bannerUrl", null);
    toast.success('تم حذف صورة البانر');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">صور المتجر</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="logo">شعار المتجر <span className="text-red-500">*</span></Label>
          <Card>
            <CardContent className="pt-6 pb-4 flex items-center justify-center">
              <div className="text-center">
                <LogoUploader 
                  logoUrl={formData.logoUrl}
                  onLogoUpdate={(url) => handleMediaChange("logoUrl", url)}
                  storeId={tempStoreId}
                />
                <p className="text-xs text-gray-500 mt-2">يرجى رفع شعار المتجر (مطلوب)</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="banner">صورة البانر</Label>
          <Card>
            <CardContent className="pt-6 pb-4">
              {formData.bannerUrl ? (
                <div className="relative">
                  <img 
                    src={formData.bannerUrl} 
                    alt="بانر المتجر" 
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="bg-white/80 hover:bg-white"
                      onClick={() => document.getElementById('banner-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 ml-1" />
                      تغيير
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="bg-white/80 hover:bg-red-500 text-red-500 hover:text-white"
                      onClick={handleRemoveBanner}
                    >
                      حذف
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className={cn(
                    "border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-gray-50/50 transition-all",
                    uploadingBanner && "opacity-50 pointer-events-none"
                  )}
                  onClick={() => document.getElementById('banner-upload')?.click()}
                >
                  <Image className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm font-medium mb-1">اضغط لرفع صورة البانر</p>
                  <p className="text-xs text-gray-500 mb-3">PNG, JPG حتى 5 ميغابايت (اختياري)</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    type="button"
                    disabled={uploadingBanner}
                  >
                    {uploadingBanner ? 'جاري الرفع...' : 'رفع صورة'}
                  </Button>
                </div>
              )}
              <input 
                id="banner-upload" 
                type="file" 
                className="hidden" 
                onChange={handleBannerUpload}
                accept="image/png,image/jpeg,image/gif"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StoreMediaStep;
