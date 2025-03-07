
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
          <Input 
            id="price" 
            name="price" 
            type="number"
            min="0"
            step="0.01"
            placeholder="أدخل سعر المنتج" 
            value={price} 
            onChange={handleInputChange} 
          />
        </div>
        
        {discountPrice !== null && (
          <div className="grid gap-2">
            <Label htmlFor="discount_price">سعر الخصم</Label>
            <Input 
              id="discount_price" 
              name="discount_price" 
              type="number"
              min="0"
              step="0.01"
              placeholder="أدخل سعر الخصم" 
              value={discountPrice} 
              onChange={handleInputChange} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BasicInfoSection;
