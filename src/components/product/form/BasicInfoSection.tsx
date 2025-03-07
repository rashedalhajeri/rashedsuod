
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
  const hasDiscount = discountPrice !== null && discountPrice < price;
  const discountPercentage = hasDiscount 
    ? Math.round(((price - discountPrice!) / price) * 100) 
    : 0;

  return (
    <div className="space-y-5 bg-white rounded-lg border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">معلومات المنتج الأساسية</h3>
      </div>
      
      <div className="grid gap-3">
        <div className="grid gap-2">
          <Label htmlFor="name" className="text-sm font-medium">
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
          <Label htmlFor="description" className="text-sm font-medium">وصف المنتج</Label>
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

        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="price" className="text-sm font-medium">
              السعر <span className="text-red-500">*</span>
            </Label>
            <Button 
              type="button" 
              variant={hasDiscount ? "default" : "outline"} 
              size="sm" 
              onClick={toggleDiscount}
              className={`text-xs flex items-center gap-1 ${hasDiscount ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : ''}`}
            >
              <BadgePercent className={`h-4 w-4 ${hasDiscount ? 'text-white' : 'text-yellow-600'}`} />
              {discountPrice === null ? "إضافة خصم" : "إلغاء الخصم"}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      border-gray-200 focus-visible:ring-blue-500 pr-12
                      ${hasDiscount ? 'line-through text-gray-500 bg-gray-50' : ''}
                    `}
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">د.ك</span>
                  </div>
                </div>
                {hasDiscount && <span className="text-gray-500 text-xs whitespace-nowrap">السعر قبل الخصم</span>}
              </div>
            </div>
            
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
                      className="border-green-500 focus-visible:ring-green-500 pr-12 bg-green-50"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-green-600">د.ك</span>
                    </div>
                  </div>
                  <span className="text-green-600 text-xs font-semibold whitespace-nowrap">السعر بعد الخصم</span>
                </div>
              </div>
            )}
          </div>
          
          {hasDiscount && price > 0 && discountPrice! > 0 && (
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
