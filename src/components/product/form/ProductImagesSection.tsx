
import React from "react";
import { Upload, ImageIcon } from "lucide-react";
import { ImageUploadGrid } from "@/components/ui/image-upload";

interface ProductImagesSectionProps {
  images: string[];
  storeId?: string;
  onChange: (images: string[]) => void;
  maxImages?: number;
}

const ProductImagesSection: React.FC<ProductImagesSectionProps> = ({
  images,
  storeId,
  onChange,
  maxImages = 5
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">صور المنتج</h3>
      <p className="text-sm text-gray-500">
        يمكنك إضافة حتى {maxImages} صور للمنتج. الصورة الأولى ستكون الصورة الرئيسية.
      </p>
      
      <ImageUploadGrid
        existingImages={images}
        onChange={onChange}
        bucketName="product-images"
        folderPath={storeId ? `store-${storeId}` : 'products'}
        maxFiles={maxImages}
        uploadText="اسحب الصور هنا أو انقر للتحميل"
        emptyText="لم يتم إضافة صور بعد"
      />
      
      {images.length === 0 && (
        <div className="flex items-center justify-center p-6 border border-dashed border-gray-300 rounded-md">
          <div className="text-center">
            <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">يرجى إضافة صورة واحدة على الأقل</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImagesSection;
