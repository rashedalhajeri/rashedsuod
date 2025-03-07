
import React from "react";
import { Label } from "@/components/ui/label";
import { ImageUploadGrid } from "@/components/ui/image-upload";

interface ProductImagesSectionProps {
  images: string[];
  storeId?: string;
  handleImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ProductImagesSection: React.FC<ProductImagesSectionProps> = ({
  images,
  storeId,
  handleImagesChange,
  maxImages = 5
}) => {
  return (
    <div className="space-y-4 pt-4 border-t border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-md font-medium">صور المنتج <span className="text-red-500">*</span></Label>
        <span className="text-sm text-gray-500">
          ({images.length} من {maxImages})
        </span>
      </div>
      
      <ImageUploadGrid 
        images={images}
        onImagesChange={handleImagesChange}
        maxImages={maxImages}
        storeId={storeId}
      />
      
      <p className="text-xs text-gray-500 text-center">
        الصورة الأولى هي الصورة الرئيسية للمنتج. يمكنك إضافة حتى {maxImages} صور.
      </p>
    </div>
  );
};

export default ProductImagesSection;
