
import React from "react";
import { User, Image as ImageIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface AdditionalOptionsSectionProps {
  requireCustomerName: boolean;
  requireCustomerImage: boolean;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const AdditionalOptionsSection: React.FC<AdditionalOptionsSectionProps> = ({
  requireCustomerName,
  requireCustomerImage,
  handleSwitchChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">خيارات إضافية</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Require customer name */}
        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-purple-500" />
            <div>
              <Label htmlFor="require_customer_name" className="cursor-pointer">طلب اسم العميل</Label>
              <p className="text-xs text-gray-500">سيطلب من العميل إدخال اسمه عند إضافة المنتج للسلة</p>
            </div>
          </div>
          <Switch 
            id="require_customer_name"
            checked={requireCustomerName}
            onCheckedChange={(checked) => handleSwitchChange('require_customer_name', checked)}
          />
        </div>
        
        {/* Require customer image */}
        <div className="flex items-center justify-between p-3 border border-gray-100 rounded-md">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-red-500" />
            <div>
              <Label htmlFor="require_customer_image" className="cursor-pointer">طلب صورة من العميل</Label>
              <p className="text-xs text-gray-500">سيطلب من العميل رفع صورة عند إضافة المنتج للسلة</p>
            </div>
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

export default AdditionalOptionsSection;
