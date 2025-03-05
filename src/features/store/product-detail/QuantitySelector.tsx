
import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (value: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  maxQuantity, 
  onQuantityChange 
}) => {
  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(maxQuantity, value));
    onQuantityChange(newQuantity);
  };

  return (
    <div className="flex items-center">
      <span className="text-sm font-medium ml-2">الكمية:</span>
      <div className="flex items-center border rounded-md">
        <button
          onClick={() => handleQuantityChange(quantity - 1)}
          className="px-3 py-1 border-l text-gray-500 hover:bg-gray-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-4 py-1">{quantity}</span>
        <button
          onClick={() => handleQuantityChange(quantity + 1)}
          className="px-3 py-1 border-r text-gray-500 hover:bg-gray-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <span className="text-sm text-gray-500 mr-2">
        {maxQuantity} قطعة متوفرة
      </span>
    </div>
  );
};

export default QuantitySelector;
