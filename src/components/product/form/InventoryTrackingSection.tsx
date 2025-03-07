
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface InventoryTrackingSectionProps {
  trackInventory: boolean;
  stockQuantity: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const InventoryTrackingSection: React.FC<InventoryTrackingSectionProps> = ({
  trackInventory,
  stockQuantity,
  handleChange,
  handleSwitchChange
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="track_inventory" className="mb-1">تتبع المخزون</Label>
        <Switch 
          id="track_inventory"
          checked={trackInventory}
          onCheckedChange={(checked) => handleSwitchChange('track_inventory', checked)}
        />
      </div>
      
      {trackInventory && (
        <div className="mt-3">
          <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
          <input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            min="0"
            step="1"
            value={stockQuantity}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      )}
    </div>
  );
};

export default InventoryTrackingSection;
