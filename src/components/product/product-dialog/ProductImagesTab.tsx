
import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Image, ImagePlus, X } from "lucide-react";
import { ProductFormData } from "./use-product-form";
import { ImageUploader } from "./ImageUploader";

interface UploadingImage {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  url?: string;
  error?: string;
}

interface ProductImagesTabProps {
  formData: ProductFormData;
  formErrors: { image?: string; [key: string]: string | undefined };
  storeData: any;
  onFormDataChange: (updates: Partial<ProductFormData>) => void;
}

export const ProductImagesTab: React.FC<ProductImagesTabProps> = ({
  formData,
  formErrors,
  storeData,
  onFormDataChange
}) => {
  const [uploadingImages, setUploadingImages] = useState<UploadingImage[]>([]);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);

  const handleMainImageUploaded = (imageUrl: string) => {
    onFormDataChange({ image_url: imageUrl });
  };

  const handleRemoveImage = () => {
    onFormDataChange({ image_url: null });
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const updatedImages = [...formData.additional_images];
    updatedImages.splice(index, 1);
    onFormDataChange({ additional_images: updatedImages });
  };

  const handleAdditionalImageUploaded = (imageUrl: string) => {
    const updatedImages = [...formData.additional_images, imageUrl];
    onFormDataChange({ additional_images: updatedImages });
  };

  const handleMultipleImagesUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (!storeData?.id) {
      return;
    }
    
    const newUploadingImages: UploadingImage[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: 'uploading'
    }));
    
    setUploadingImages(prev => [...prev, ...newUploadingImages]);
    
    // Logic for handling multiple images upload
    // This is a simplified version - you'll need to implement the actual upload logic
    if (multipleFileInputRef.current) {
      multipleFileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-2">
        <Label htmlFor="image_url">صورة المنتج الرئيسية</Label>
        <div className="flex flex-col gap-3">
          {formData.image_url ? (
            <div className="relative w-full h-48 bg-gray-50 rounded-md overflow-hidden border border-green-200 transition-all hover:shadow-md group">
              <img 
                src={formData.image_url} 
                alt="Product" 
                className="w-full h-full object-contain" 
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8 rounded-full shadow-lg"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-green-50 text-green-700 p-2 text-sm flex items-center gap-2 border-t border-green-200">
                <Image className="h-4 w-4" />
                تم رفع الصورة بنجاح
              </div>
            </div>
          ) : (
            <div className="w-full h-48 border-2 border-dashed rounded-md overflow-hidden">
              <ImageUploader 
                storeId={storeData?.id}
                onImageUploaded={handleMainImageUploaded}
                className="w-full h-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition"
              />
            </div>
          )}
          
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Image className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                id="image_url" 
                name="image_url" 
                placeholder="أو أدخل رابط صورة المنتج مباشرة" 
                value={formData.image_url || ''} 
                onChange={(e) => onFormDataChange({ image_url: e.target.value })}
                className="pl-3 pr-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label className="flex items-center justify-between">
          <span>صور إضافية للمنتج</span>
          <span className="text-xs text-muted-foreground">
            {Array.isArray(formData.additional_images) ? formData.additional_images.length : 0}/5 صور
          </span>
        </Label>
        
        <input
          type="file"
          accept="image/*"
          multiple
          ref={multipleFileInputRef}
          onChange={handleMultipleImagesUpload}
          className="hidden"
        />
        
        {Array.isArray(formData.additional_images) && formData.additional_images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
            {formData.additional_images.map((imageUrl, index) => (
              <div key={index} className="relative aspect-square bg-gray-50 rounded-md overflow-hidden border border-gray-200 group hover:shadow-md transition-all">
                <img 
                  src={imageUrl} 
                  alt={`Additional ${index + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleRemoveAdditionalImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {formData.additional_images.length < 5 && (
          <div className="w-full">
            <ImageUploader
              storeId={storeData?.id}
              onImageUploaded={handleAdditionalImageUploaded}
              className="w-full"
            >
              <Button 
                type="button" 
                variant="outline" 
                className="w-full h-20 border-dashed flex flex-col gap-1 hover:bg-gray-50 transition-colors"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-sm">إضافة صور للمنتج</span>
                <span className="text-xs text-muted-foreground">يمكنك إضافة حتى 5 صور</span>
              </Button>
            </ImageUploader>
          </div>
        )}
      </div>
    </div>
  );
};
