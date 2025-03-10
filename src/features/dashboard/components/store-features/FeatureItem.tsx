
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Trash } from "lucide-react";
import IconSelector from "./IconSelector";
import { Feature } from "./types";

interface FeatureItemProps {
  feature: Feature;
  index: number;
  onRemove: () => void;
  onChange: (field: keyof Feature, value: any) => void;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ 
  feature, 
  index, 
  onRemove, 
  onChange 
}) => {
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">الميزة {index + 1}</h3>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onRemove}
        >
          <Trash className="h-4 w-4 text-red-500" />
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">الأيقونة</Label>
          <IconSelector 
            value={feature.icon} 
            onChange={(value) => onChange('icon', value)} 
          />
        </div>
        
        <div>
          <Label htmlFor={`feature-title-${index}`} className="mb-2 block">العنوان</Label>
          <Input 
            id={`feature-title-${index}`}
            value={feature.title} 
            onChange={(e) => onChange('title', e.target.value)}
            placeholder="عنوان الميزة"
          />
        </div>
        
        <div>
          <Label htmlFor={`feature-description-${index}`} className="mb-2 block">الوصف</Label>
          <Textarea
            id={`feature-description-${index}`}
            value={feature.description}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder="وصف الميزة"
            rows={2}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Switch 
            id={`feature-active-${index}`}
            checked={feature.is_active}
            onCheckedChange={(checked) => onChange('is_active', checked)}
          />
          <Label htmlFor={`feature-active-${index}`}>تفعيل الميزة</Label>
        </div>
      </div>
    </div>
  );
};

export default FeatureItem;
