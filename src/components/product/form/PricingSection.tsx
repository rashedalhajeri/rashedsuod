
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";

interface PricingSectionProps {
  price: number;
  discountPrice: number | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleDiscount: () => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  price,
  discountPrice,
  handleInputChange,
  toggleDiscount
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Input 
              id="price" 
              name="price" 
              type="number" 
              placeholder="0.000" 
              value={price} 
              onChange={handleInputChange} 
            />
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={toggleDiscount}
          >
            <Percent className="h-4 w-4" />
            <span>خصم</span>
          </Button>
        </div>
      </div>
      
      {discountPrice !== null && (
        <div className="grid gap-2">
          <Label htmlFor="discount_price">السعر قبل الخصم <span className="text-red-500">*</span></Label>
          <Input 
            id="discount_price" 
            name="discount_price" 
            type="number" 
            placeholder="0.000" 
            value={discountPrice} 
            onChange={handleInputChange} 
          />
        </div>
      )}
    </div>
  );
};

export default PricingSection;
