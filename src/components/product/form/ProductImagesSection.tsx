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
  return <div className="space-y-4">
      <h3 className="font-medium">صور المنتج</h3>
      <p className="text-sm text-gray-500">
        يمكنك إضافة حتى {maxImages} صور للمنتج. الصورة الأولى ستكون الصورة الرئيسية.
      </p>
      
      <ImageUploadGrid images={images} onImagesChange={onChange} maxImages={maxImages} storeId={storeId} />
      
      {images.length === 0}
    </div>;
};
export default ProductImagesSection;