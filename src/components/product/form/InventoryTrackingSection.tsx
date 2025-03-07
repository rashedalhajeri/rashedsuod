
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

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
        <div>
          <Label htmlFor="track_inventory" className="block mb-1">تتبع المخزون</Label>
          <p className="text-sm text-gray-500">
            {trackInventory 
              ? 'كمية محدودة - سيتم تتبع المخزون المتاح' 
              : 'كمية غير محدودة - لن يتم عرض "نفذت الكمية" أبداً'}
          </p>
        </div>
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
          
          {stockQuantity <= 0 && trackInventory && (
            <Badge variant="outline" className="w-fit mt-2 text-red-500 border-red-200 bg-red-50">
              تنبيه: المنتج غير متوفر حالياً
            </Badge>
          )}
        </div>
      )}
      
      {!trackInventory && (
        <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 mt-3">
          <p>تم تعطيل تتبع المخزون. سيكون المنتج متوفراً دائماً بغض النظر عن الكمية المباعة.</p>
        </div>
      )}
    </div>
  );
};

export default InventoryTrackingSection;
