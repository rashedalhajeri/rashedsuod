
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ProductInventoryTabProps {
  price: number;
  stockQuantity: number;
  currency: string;
  priceError?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProductInventoryTab: React.FC<ProductInventoryTabProps> = ({
  price,
  stockQuantity,
  currency,
  priceError,
  onInputChange
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
        <div className="relative">
          <Input 
            id="price" 
            name="price" 
            type="number" 
            placeholder="0.00" 
            value={price === 0 ? "" : price} 
            onChange={onInputChange}
            className={`pl-16 text-base font-semibold dir-ltr ${priceError ? "border-red-300" : ""}`}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 border-r border-gray-200 pr-2">
            <span className="text-sm">{currency}</span>
          </div>
        </div>
        {priceError && (
          <p className="text-sm text-red-500">{priceError}</p>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
        <Input 
          id="stock_quantity" 
          name="stock_quantity" 
          type="number" 
          placeholder="0" 
          value={stockQuantity === 0 ? "" : stockQuantity} 
          onChange={onInputChange} 
        />
        <p className="text-xs text-gray-500">اترك الكمية كـ 0 إذا كان المنتج غير متوفر في المخزون</p>
      </div>
    </div>
  );
};
