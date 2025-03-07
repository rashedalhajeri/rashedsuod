
import React from "react";
import { Label } from "@/components/ui/label";
import { ImageUploadGrid } from "@/components/ui/image-upload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileImage, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
        <div className="space-y-4">
          <ImageUploadGrid 
            images={images}
            onImagesChange={handleImagesChange}
            maxImages={maxImages}
            storeId={storeId}
          />
          
          <div className="mt-4 text-center">
            {images.length === 0 ? (
              <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-700">
                  لم يتم إضافة أي صور للمنتج. يرجى إضافة صورة واحدة على الأقل.
                </AlertDescription>
              </Alert>
            ) : (
              <p className="text-xs text-gray-500">
                الصورة الأولى هي الصورة الرئيسية للمنتج. يمكنك سحب وإفلات الصور لإعادة ترتيبها.
              </p>
            )}
          </div>
          
          {images.length > 0 && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <div key={index} className={`relative border rounded-md overflow-hidden ${index === 0 ? 'ring-2 ring-primary' : ''}`}>
                    <img src={image} alt={`صورة ${index + 1}`} className="w-full aspect-square object-cover" />
                    {index === 0 && (
                      <span className="absolute top-0 right-0 bg-primary text-white text-xs px-1.5 py-0.5 rounded-bl-md">
                        رئيسية
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductImagesSection;
