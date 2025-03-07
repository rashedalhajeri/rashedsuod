
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface InventorySectionProps {
  trackInventory: boolean;
  stockQuantity: number;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const InventorySection: React.FC<InventorySectionProps> = ({
  trackInventory,
  stockQuantity,
  handleInputChange,
  handleSwitchChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Label htmlFor="track_inventory" className="mb-1">تتبع المخزون</Label>
          <span className="text-sm text-gray-500">
            {trackInventory 
              ? 'كمية محدودة - سيتم تتبع المخزون المتاح' 
              : 'كمية غير محدودة - لن يتم عرض "نفذت الكمية" أبداً'}
          </span>
        </div>
        <Switch 
          id="track_inventory"
          checked={trackInventory}
          onCheckedChange={(checked) => handleSwitchChange('track_inventory', checked)}
        />
      </div>
      
      {trackInventory && (
        <div className="grid gap-2">
          <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
          <Input 
            id="stock_quantity" 
            name="stock_quantity" 
            type="number" 
            placeholder="0" 
            value={stockQuantity} 
            onChange={handleInputChange} 
          />
          {stockQuantity <= 0 && (
            <Badge variant="outline" className="w-fit mt-1 text-red-500 border-red-200 bg-red-50">
              تنبيه: المنتج غير متوفر حالياً
            </Badge>
          )}
        </div>
      )}
      
      {!trackInventory && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
          <p>تم تعطيل تتبع المخزون. سيكون المنتج متوفراً دائماً بغض النظر عن الكمية المباعة.</p>
        </div>
      )}
    </div>
  );
};

export default InventorySection;
