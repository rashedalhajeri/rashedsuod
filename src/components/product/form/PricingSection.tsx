
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Percent } from "lucide-react";
import { useCurrencyFormatter } from "@/hooks/use-currency-formatter";

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
  const formatCurrency = useCurrencyFormatter();
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Make sure we're always working with a valid number
    const input = e.target.value.replace(/[^\d.-]/g, '');
    
    const formattedEvent = {
      ...e,
      target: {
        ...e.target,
        value: input
      }
    };
    
    handleInputChange(formattedEvent);
  };

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
              step="0.001"
              min="0"
              placeholder="0.000" 
              value={price} 
              onChange={handlePriceChange}
              className="ltr"
            />
            {price > 0 && (
              <p className="text-xs text-gray-500 mt-1 ltr">
                {formatCurrency(price)}
              </p>
            )}
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
          <Label htmlFor="discount_price">السعر بعد الخصم <span className="text-red-500">*</span></Label>
          <Input 
            id="discount_price" 
            name="discount_price" 
            type="number" 
            step="0.001"
            min="0"
            placeholder="0.000" 
            value={discountPrice} 
            onChange={handlePriceChange}
            className="ltr"
          />
          {discountPrice > 0 && (
            <div className="flex justify-between text-xs mt-1">
              <span className="text-gray-500 ltr">
                {formatCurrency(discountPrice)}
              </span>
              {price > 0 && discountPrice > 0 && (
                <span className="text-green-600">
                  خصم {Math.round((1 - discountPrice/price) * 100)}%
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PricingSection;
