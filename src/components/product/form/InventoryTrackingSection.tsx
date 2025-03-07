
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-media-query";

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
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'flex-col' : 'items-center justify-between'} gap-3`}>
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
          className={isMobile ? 'self-start mt-1' : ''}
        />
      </div>
      
      {trackInventory && (
        <div className="mt-3">
          <Label htmlFor="stock_quantity">الكمية المتوفرة</Label>
          <Input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            min="0"
            step="1"
            value={stockQuantity}
            onChange={handleChange}
            className="mt-1 bg-white"
          />
          
          {stockQuantity <= 0 && trackInventory && (
            <Badge variant="outline" className="w-fit mt-2 text-red-500 border-red-200 bg-red-50">
              تنبيه: المنتج غير متوفر حالياً
            </Badge>
          )}
          
          {stockQuantity > 0 && stockQuantity <= 5 && trackInventory && (
            <Badge variant="outline" className="w-fit mt-2 text-yellow-600 border-yellow-200 bg-yellow-50">
              تنبيه: كمية المنتج منخفضة
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
