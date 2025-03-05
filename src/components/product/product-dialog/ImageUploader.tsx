
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, AlertCircle, X } from "lucide-react";

interface ImageUploaderProps {
  storeId?: string;
  onImageUploaded: (imageUrl: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export interface UploadState {
  progress: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  storeId,
  onImageUploaded,
  className,
  children
}) => {
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    status: 'idle'
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const simulateUploadProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 95) {
        progress = 95;
        clearInterval(interval);
      }
      
      setUploadState(prev => ({
        ...prev,
        progress
      }));
    }, 200);
    
    return () => clearInterval(interval);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setUploadState({
        progress: 0,
        status: 'error',
        error: "يرجى رفع صورة فقط"
      });
      toast.error("يرجى رفع صورة فقط");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setUploadState({
        progress: 0,
        status: 'error',
        error: "يجب أن يكون حجم الصورة أقل من 5 ميجابايت"
      });
      toast.error("يجب أن يكون حجم الصورة أقل من 5 ميجابايت");
      return;
    }
    
    try {
      setUploadState({
        progress: 0,
        status: 'uploading'
      });
      
      const stopSimulation = simulateUploadProgress();
      
      if (!storeId) {
        toast.error("لم يتم العثور على معرف المتجر");
        setUploadState({
          progress: 0,
          status: 'error',
          error: "لم يتم العثور على معرف المتجر"
        });
        return;
      }
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${storeId}/${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('store-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      stopSimulation();
      
      if (error) {
        throw error;
      }
      
      setUploadState({
        progress: 100,
        status: 'success'
      });
      
      const { data: urlData } = supabase.storage
        .from('store-images')
        .getPublicUrl(filePath);
      
      onImageUploaded(urlData.publicUrl);
      toast.success("تم رفع الصورة بنجاح");
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadState({
        progress: 0,
        status: 'error',
        error: "حدث خطأ أثناء رفع الصورة"
      });
      toast.error("حدث خطأ أثناء رفع الصورة");
    }
  };

  const resetUploadState = () => {
    setUploadState({
      progress: 0,
      status: 'idle'
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />
      
      {uploadState.status === 'uploading' ? (
        <div className="flex flex-col items-center w-full px-8">
          <div className="flex items-center gap-2 mb-2 text-blue-600">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            <p className="text-sm font-medium">جاري رفع الصورة...</p>
          </div>
          <Progress value={uploadState.progress} className="w-full h-2" />
          <p className="text-xs text-gray-500 mt-2">{Math.round(uploadState.progress)}%</p>
        </div>
      ) : uploadState.status === 'error' ? (
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-red-100 p-2 mb-2">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <p className="text-sm font-medium text-red-600">فشل رفع الصورة</p>
          <p className="text-xs text-red-500">{uploadState.error}</p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 text-red-600 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              resetUploadState();
            }}
          >
            حاول مرة أخرى
          </Button>
        </div>
      ) : (
        <div onClick={() => fileInputRef.current?.click()}>
          {children || (
            <div className="flex flex-col items-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm font-medium">اضغط هنا لرفع صورة</p>
              <p className="text-xs text-gray-500">يدعم صيغ JPG، PNG بحد أقصى 5MB</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
