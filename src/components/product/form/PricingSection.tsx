
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

// Note: This component is kept for backward compatibility
// Price fields have been moved to BasicInfoSection
const PricingSection: React.FC<PricingSectionProps> = ({
  price,
  discountPrice,
  handleInputChange,
  toggleDiscount
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">السعر والخصومات</Label>
        <Button 
          variant="outline" 
          size="sm" 
          type="button"
          onClick={toggleDiscount}
          className="text-xs flex items-center gap-1"
        >
          <Percent className="h-3.5 w-3.5" />
          {discountPrice === null ? "إضافة خصم" : "إلغاء الخصم"}
        </Button>
      </div>
      
      <div className="grid gap-4">
        {/* Price fields have been moved to BasicInfoSection */}
      </div>
    </div>
  );
};

export default PricingSection;
