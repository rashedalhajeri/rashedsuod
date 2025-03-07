
import React from "react";
import { Box, Tag } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ProductOptionsSectionProps {
  hasColors: boolean;
  hasSizes: boolean;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const ProductOptionsSection: React.FC<ProductOptionsSectionProps> = ({
  hasColors,
  hasSizes,
  handleSwitchChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">خيارات المنتج</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Colors option */}
        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-blue-500" />
            <div>
              <Label htmlFor="has_colors" className="cursor-pointer">الألوان</Label>
              <p className="text-xs text-gray-500">إضافة خيارات الألوان للمنتج</p>
            </div>
          </div>
          <Switch 
            id="has_colors"
            checked={hasColors}
            onCheckedChange={(checked) => handleSwitchChange('has_colors', checked)}
          />
        </div>
        
        {/* Sizes option */}
        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-green-500" />
            <div>
              <Label htmlFor="has_sizes" className="cursor-pointer">المقاسات</Label>
              <p className="text-xs text-gray-500">إضافة خيارات المقاسات للمنتج</p>
            </div>
          </div>
          <Switch 
            id="has_sizes"
            checked={hasSizes}
            onCheckedChange={(checked) => handleSwitchChange('has_sizes', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductOptionsSection;
