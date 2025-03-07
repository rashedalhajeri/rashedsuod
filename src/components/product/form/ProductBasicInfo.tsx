
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadGrid } from "@/components/ui/image-upload";
import { formatCurrency } from "@/utils/currency-formatter";

interface ProductBasicInfoProps {
  name: string;
  description: string;
  price: number;
  discount_price: number | null;
  images: string[];
  storeId?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImagesChange: (images: string[]) => void;
}

const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  name,
  description,
  price,
  discount_price,
  images,
  storeId,
  handleChange,
  handleImagesChange,
}) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-lg font-medium">اسم المنتج</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="أدخل اسم المنتج"
                className="text-lg"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg font-medium">وصف المنتج</Label>
              <Textarea
                id="description"
                name="description"
                value={description || ""}
                onChange={handleChange}
                placeholder="أدخل وصف المنتج"
                rows={5}
                className="resize-none"
              />
            </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-lg font-medium">السعر</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.001"
                  value={price}
                  onChange={handleChange}
                  className="flex-1"
                />
                {price > 0 && (
                  <p className="text-sm text-gray-500">
                    {formatCurrency(price)}
                  </p>
                )}
              </div>
              
              {discount_price !== null && (
                <div className="space-y-2">
                  <Label htmlFor="discount_price" className="text-lg font-medium">السعر بعد الخصم</Label>
                  <Input
                    id="discount_price"
                    name="discount_price"
                    type="number"
                    min="0"
                    step="0.001"
                    value={discount_price}
                    onChange={handleChange}
                  />
                  {discount_price > 0 && (
                    <p className="text-sm text-gray-500">
                      {formatCurrency(discount_price)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div>
            <Label className="text-lg font-medium mb-3 block">صور المنتج</Label>
            <ImageUploadGrid 
              images={images}
              onImagesChange={handleImagesChange}
              maxImages={5}
              storeId={storeId}
            />
            <p className="text-xs text-gray-500 text-center mt-2">
              الصورة الأولى هي الصورة الرئيسية للمنتج. يمكنك إضافة حتى 5 صور.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductBasicInfo;
