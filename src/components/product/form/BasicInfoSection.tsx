
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BadgePercent } from "lucide-react";

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
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">اسم المنتج <span className="text-red-500">*</span></Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="أدخل اسم المنتج" 
          value={name} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">وصف المنتج</Label>
        <Textarea 
          id="description" 
          name="description" 
          placeholder="أدخل وصف المنتج"
          value={description} 
          onChange={handleInputChange} 
          rows={4}
        />
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={toggleDiscount}
            className="text-xs flex items-center gap-1"
          >
            <BadgePercent className="h-4 w-4 text-yellow-600" />
            {discountPrice === null ? "إضافة خصم" : "إلغاء الخصم"}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Input 
                id="price" 
                name="price" 
                type="number"
                min="0"
                step="0.01"
                placeholder="أدخل سعر المنتج" 
                value={price} 
                onChange={handleInputChange}
                className={discountPrice !== null ? "line-through text-gray-500" : ""}
              />
              {discountPrice !== null && <span className="text-gray-500 text-xs">السعر قبل الخصم</span>}
            </div>
          </div>
          
          {discountPrice !== null && (
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Input 
                  id="discount_price" 
                  name="discount_price" 
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="أدخل سعر الخصم" 
                  value={discountPrice} 
                  onChange={handleInputChange}
                  className="border-green-500 focus-visible:ring-green-500"
                />
                <span className="text-green-600 text-xs font-semibold">السعر بعد الخصم</span>
              </div>
            </div>
          )}
        </div>
        
        {discountPrice !== null && price > 0 && discountPrice > 0 && (
          <div className="bg-yellow-50 border border-yellow-100 p-2 rounded-md text-sm text-yellow-700 flex items-center gap-2">
            <BadgePercent className="h-4 w-4" />
            <span>نسبة الخصم: {Math.round(((price - discountPrice) / price) * 100)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoSection;
