
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
        <motion.div 
          className="relative rounded-md overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all aspect-square w-16 h-16 mx-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-50 to-white opacity-70 z-0" />
          <img 
            src={logoUrl} 
            alt="شعار المتجر" 
            className="w-12 h-12 object-contain bg-white/80 p-1 mx-auto my-2 relative z-10 rounded"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100 z-20">
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleClick}
                className="bg-white text-purple-700 hover:bg-purple-50 text-xs h-5 px-2 shadow-sm border border-purple-100"
              >
                <Upload className="h-2 w-2 ml-1" />
                تغيير
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={handleRemoveLogo}
                className="text-xs h-5 px-2 shadow-sm"
              >
                <X className="h-2 w-2 ml-1" />
                حذف
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 1 }}
          whileHover={{ scale: 1.03 }}
          className={cn(
            "border-2 border-dashed rounded-lg p-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all w-full aspect-square max-w-[100px] mx-auto",
            isDragging 
              ? "border-purple-400 bg-purple-50 shadow-md" 
              : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/50",
            isUploading && "opacity-70 pointer-events-none"
          )}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-purple-100 opacity-50 blur-sm"></div>
            <Star className="h-5 w-5 text-purple-500 relative" />
          </div>
          <p className="text-[10px] font-medium mb-1 mt-1 text-purple-700">
            شعار المتجر
          </p>
          <p className="text-[8px] text-gray-500 mb-1">
            PNG, JPG حتى 2 ميغابايت
          </p>
          {isUploading ? (
            <div className="mt-1 text-[10px] text-purple-600 flex items-center">
              <div className="h-2 w-2 rounded-full bg-purple-400 mr-1 animate-pulse"></div>
              جاري الرفع...
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              type="button"
              onClick={handleClick}
              className="text-[8px] h-5 px-2 py-0 mt-1 border-purple-200 text-purple-700 hover:bg-purple-100 hover:text-purple-800"
            >
              <Upload className="h-2 w-2 ml-1" />
              اختيار ملف
            </Button>
          )}
        </motion.div>
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
