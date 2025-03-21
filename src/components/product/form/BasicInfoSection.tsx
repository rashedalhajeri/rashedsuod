
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BadgePercent, Sparkles } from "lucide-react";

interface BasicInfoSectionProps {
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  toggleDiscount?: () => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  name,
  description,
  price,
  discountPrice,
  handleInputChange,
  toggleDiscount
}) => {
  // Only consider it a discount if the discount price is not null and is less than the regular price
  const hasDiscount = discountPrice !== null;
  const discountPercentage = hasDiscount && price > 0 && discountPrice! > 0 && discountPrice! < price
    ? Math.round(((price - discountPrice!) / price) * 100) 
    : 0;

  return (
    <div className="space-y-4 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-3 mb-4">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">معلومات المنتج الأساسية</h3>
      </div>
      
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-sm font-medium text-gray-700">
            اسم المنتج <span className="text-red-500">*</span>
          </Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="أدخل اسم المنتج" 
            value={name} 
            onChange={handleInputChange} 
            className="border-gray-200 focus-visible:ring-blue-500"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="description" className="text-sm font-medium text-gray-700">وصف المنتج</Label>
          <Textarea 
            id="description" 
            name="description" 
            placeholder="أدخل وصف المنتج"
            value={description} 
            onChange={handleInputChange} 
            rows={4}
            className="border-gray-200 focus-visible:ring-blue-500 resize-none"
          />
        </div>

        <div className="space-y-4 pt-3 border-t border-gray-100 mt-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
              السعر <span className="text-red-500">*</span>
            </Label>
            <Button 
              type="button" 
              variant={hasDiscount ? "default" : "outline"} 
              size="sm" 
              onClick={toggleDiscount}
              className={`text-xs flex items-center gap-1 ${hasDiscount ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'text-yellow-600 border-yellow-200 hover:bg-yellow-50'}`}
            >
              <BadgePercent className={`h-4 w-4 ${hasDiscount ? 'text-white' : 'text-yellow-600'}`} />
              {discountPrice === null ? "إضافة خصم" : "إلغاء الخصم"}
            </Button>
          </div>

          <div className="space-y-4">
            {/* Original Price field */}
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <div className="relative w-full">
                  <Input 
                    id="price" 
                    name="price" 
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="أدخل سعر المنتج" 
                    value={price} 
                    onChange={handleInputChange}
                    className={`
                      border-gray-200 focus-visible:ring-blue-500 pl-16 dir-ltr text-left
                      ${hasDiscount ? 'text-gray-500 bg-gray-50 border-gray-200' : 'border-blue-200 bg-blue-50/30'}
                    `}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none bg-gray-50 border-r border-gray-200 rounded-l-md w-14 justify-center">
                    <span className={`${hasDiscount ? 'text-gray-500' : 'text-blue-700'} font-medium`}>د.ك</span>
                  </div>
                </div>
                <span className="text-gray-500 text-xs whitespace-nowrap font-medium">السعر الأصلي</span>
              </div>
            </div>
            
            {/* Discount Price field - shown only when discount is enabled */}
            {hasDiscount && (
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-full">
                    <Input 
                      id="discount_price" 
                      name="discount_price" 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="أدخل سعر الخصم" 
                      value={discountPrice || ""} 
                      onChange={handleInputChange}
                      className="border-green-200 focus-visible:ring-green-500 pl-16 dir-ltr text-left bg-green-50/50"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none bg-green-50 border-r border-green-200 rounded-l-md w-14 justify-center">
                      <span className="text-green-700 font-medium">د.ك</span>
                    </div>
                  </div>
                  <span className="text-green-600 text-xs font-medium whitespace-nowrap">السعر بعد الخصم</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Show discount percentage message only when discount is valid (discount price < original price) */}
          {hasDiscount && price > 0 && discountPrice! > 0 && discountPrice! < price && (
            <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-md text-sm text-yellow-700 flex items-center justify-center gap-2">
              <BadgePercent className="h-4 w-4" />
              <span className="font-semibold">نسبة الخصم: {discountPercentage}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
