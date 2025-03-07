import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Box, Tag, User, Image as ImageIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTitle, DialogContent, DialogDescription } from "@/components/ui/dialog";

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
  const [dialogOpen, setDialogOpen] = useState(false);

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
    <>
      <Card className="border border-gray-200">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-md font-medium">خصائص متقدمة</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1" 
            onClick={() => setDialogOpen(true)}
          >
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span>إدارة الخصائص المتقدمة</span>
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-center">
            <Button 
              variant="secondary"
              className="w-full max-w-md flex items-center justify-center gap-2 py-6"
              onClick={() => setDialogOpen(true)}
            >
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>إضافة خصائص متقدمة للمنتج</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <AdvancedFeaturesDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        features={features}
        handleSwitchChange={handleSwitchChange}
      />
    </>
  );
};

interface AdvancedFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  features: {
    id: string;
    name: string;
    description: string;
    checked: boolean;
    icon: JSX.Element;
  }[];
  handleSwitchChange: (name: string, checked: boolean) => void;
}

const AdvancedFeaturesDialog: React.FC<AdvancedFeaturesDialogProps> = ({
  open,
  onOpenChange,
  features,
  handleSwitchChange
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" />
          الخصائص المتقدمة للمنتج
        </DialogTitle>
        <DialogDescription>
          قم بتفعيل الخصائص المتقدمة التي ترغب بإضافتها لهذا المنتج
        </DialogDescription>
        
        <div className="space-y-4 mt-4">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className={`flex items-center justify-between p-4 border ${feature.checked ? 'border-primary/20 bg-primary/5' : 'border-gray-100'} rounded-lg transition-colors hover:bg-gray-50`}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full ${feature.checked ? 'bg-primary/10' : 'bg-gray-100'} p-2.5`}>
                  {feature.icon}
                </div>
                <div>
                  <Label htmlFor={`dialog-${feature.id}`} className="text-base font-medium cursor-pointer">{feature.name}</Label>
                  <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                </div>
              </div>
              <Switch 
                id={`dialog-${feature.id}`}
                checked={feature.checked}
                onCheckedChange={(checked) => handleSwitchChange(feature.id, checked)}
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end mt-4">
          <Button onClick={() => onOpenChange(false)}>تم</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedFeaturesSection;
