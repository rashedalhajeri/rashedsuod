
import React from "react";
import { Label } from "@/components/ui/label";
import { ImageUploadGrid } from "@/components/ui/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage } from "lucide-react";

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
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          <FileImage className="h-5 w-5 text-blue-500" />
          صور المنتج
          <span className="text-sm font-normal text-gray-500 mr-2">
            ({images.length} من {maxImages})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUploadGrid 
          images={images}
          onImagesChange={handleImagesChange}
          maxImages={maxImages}
          storeId={storeId}
        />
        
        <div className="mt-4 text-center">
          {images.length === 0 ? (
            <div className="p-4 border rounded-md border-yellow-200 bg-yellow-50 text-yellow-700 text-sm">
              لم يتم إضافة أي صور للمنتج. يرجى إضافة صورة واحدة على الأقل.
            </div>
          ) : (
            <p className="text-xs text-gray-500">
              الصورة الأولى هي الصورة الرئيسية للمنتج. يمكنك إضافة حتى {maxImages} صور.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImagesSection;
