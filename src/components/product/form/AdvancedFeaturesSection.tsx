
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Box, Tag, User, Image as ImageIcon } from "lucide-react";

interface AdvancedFeaturesSectionProps {
  hasColors: boolean;
  hasSizes: boolean;
  requireCustomerName: boolean;
  requireCustomerImage: boolean;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const AdvancedFeaturesSection: React.FC<AdvancedFeaturesSectionProps> = ({
  hasColors,
  hasSizes,
  requireCustomerName,
  requireCustomerImage,
  handleSwitchChange
}) => {
  return (
    <div className="pt-4 mt-4 border-t border-gray-200">
      <h3 className="text-md font-medium mb-3 flex items-center gap-2">
        <Tag className="h-4 w-4" />
        خصائص متقدمة
      </h3>
      
      <div className="grid gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Box className="h-4 w-4 text-blue-500" />
            <Label htmlFor="has_colors" className="cursor-pointer">الألوان</Label>
          </div>
          <Switch 
            id="has_colors"
            checked={hasColors}
            onCheckedChange={(checked) => handleSwitchChange('has_colors', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-green-500" />
            <Label htmlFor="has_sizes" className="cursor-pointer">المقاسات</Label>
          </div>
          <Switch 
            id="has_sizes"
            checked={hasSizes}
            onCheckedChange={(checked) => handleSwitchChange('has_sizes', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-purple-500" />
            <Label htmlFor="require_customer_name" className="cursor-pointer">طلب اسم العميل</Label>
          </div>
          <Switch 
            id="require_customer_name"
            checked={requireCustomerName}
            onCheckedChange={(checked) => handleSwitchChange('require_customer_name', checked)}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-red-500" />
            <Label htmlFor="require_customer_image" className="cursor-pointer">طلب صورة من العميل</Label>
          </div>
          <Switch 
            id="require_customer_image"
            checked={requireCustomerImage}
            onCheckedChange={(checked) => handleSwitchChange('require_customer_image', checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeaturesSection;
