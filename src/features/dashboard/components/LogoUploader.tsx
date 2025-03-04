import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoUploaderProps {
  logoUrl: string | null;
  onLogoUpdate: (url: string | null) => void;
  storeId?: string;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  logoUrl,
  onLogoUpdate,
  storeId
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!validateImage(file)) return;
    await uploadImage(file);
  };

  const validateImage = (file: File): boolean => {
    if (!file.type.startsWith('image/')) {
      toast.error('يرجى اختيار ملف صورة فقط');
      return false;
    }
    
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      toast.error('حجم الصورة كبير جدًا. يجب أن يكون أقل من 2 ميغابايت');
      return false;
    }
    
    return true;
  };

  const uploadImage = async (file: File) => {
    if (!storeId) {
      toast.error('معرف المتجر غير متوفر');
      return;
    }
    
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${storeId}_${Date.now()}.${fileExt}`;
      const filePath = `store_logos/${fileName}`;
      
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
      
      onLogoUpdate(urlData.publicUrl);
      toast.success('تم رفع الشعار بنجاح');
    } catch (error) {
      console.error('خطأ في رفع الصورة:', error);
      toast.error('حدث خطأ أثناء رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    onLogoUpdate(null);
    toast.success('تم حذف الشعار');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    
    if (validateImage(file)) {
      await uploadImage(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mt-1">
      {logoUrl ? (
        <div className="relative rounded-md overflow-hidden border border-gray-200">
          <img 
            src={logoUrl} 
            alt="شعار المتجر" 
            className="w-full h-24 object-contain bg-white p-2"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleClick}
                className="bg-white text-black hover:bg-gray-100"
              >
                <Upload className="h-3 w-3 ml-1" />
                تغيير
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleRemoveLogo}
              >
                <X className="h-3 w-3 ml-1" />
                حذف
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors",
            isDragging ? "border-primary bg-primary-50" : "border-gray-300",
            isUploading && "opacity-70 pointer-events-none"
          )}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Image className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium mb-1">
            اسحب وأفلت ملف الشعار هنا أو انقر للاختيار
          </p>
          <p className="text-xs text-gray-500 mb-2">
            PNG, JPG, SVG, GIF حتى 2 ميغابايت
          </p>
          {isUploading ? (
            <div className="mt-2 text-xs text-primary-600">جاري الرفع...</div>
          ) : (
            <Button 
              size="sm" 
              variant="secondary"
              type="button"
              onClick={handleClick}
            >
              <Upload className="h-3 w-3 ml-1" />
              اختيار ملف
            </Button>
          )}
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default LogoUploader;
