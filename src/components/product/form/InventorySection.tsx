
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

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
            {trackInventory ? 'كمية محدودة' : 'كمية غير محدودة'}
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
        </div>
      )}
    </div>
  );
};

export default InventorySection;
