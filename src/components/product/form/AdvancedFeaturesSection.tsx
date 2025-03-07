
import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Box, Tag, User, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const features = [
    {
      id: "has_colors",
      name: "الألوان",
      description: "إضافة خيارات الألوان للمنتج",
      checked: hasColors,
      icon: <Box className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "has_sizes",
      name: "المقاسات",
      description: "إضافة خيارات المقاسات للمنتج",
      checked: hasSizes,
      icon: <Tag className="h-4 w-4 text-green-500" />,
    },
    {
      id: "require_customer_name",
      name: "طلب اسم العميل",
      description: "سيطلب من العميل إدخال اسمه عند إضافة المنتج للسلة",
      checked: requireCustomerName,
      icon: <User className="h-4 w-4 text-purple-500" />,
    },
    {
      id: "require_customer_image",
      name: "طلب صورة من العميل",
      description: "سيطلب من العميل رفع صورة عند إضافة المنتج للسلة",
      checked: requireCustomerImage,
      icon: <ImageIcon className="h-4 w-4 text-red-500" />,
    }
  ];

  return (
    <Card className="border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-md font-medium">خصائص متقدمة</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid gap-4">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="flex items-center justify-between p-3 border border-gray-100 rounded-md transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gray-100 p-2">
                  {feature.icon}
                </div>
                <div>
                  <Label htmlFor={feature.id} className="font-medium cursor-pointer">{feature.name}</Label>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
              <Switch 
                id={feature.id}
                checked={feature.checked}
                onCheckedChange={(checked) => handleSwitchChange(feature.id, checked)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFeaturesSection;
