
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
  maxImages = 5,
}) => {
  const handleImagesChange = (newImages: string[]) => {
    onChange(newImages);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">صور المنتج</h3>
        
        {images.length === 0 && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              الرجاء إضافة صورة واحدة على الأقل للمنتج.
            </AlertDescription>
          </Alert>
        )}
        
        <ImageUploadGrid
          images={images}
          onImagesChange={handleImagesChange}
          maxImages={maxImages}
          storeId={storeId}
        />
        
        <p className="text-sm text-gray-500 mt-2">
          يمكنك إضافة حتى {maxImages} صور. الصورة الأولى ستكون الصورة الرئيسية للمنتج.
        </p>
      </CardContent>
    </Card>
  );
};

export default ProductImagesSection;
