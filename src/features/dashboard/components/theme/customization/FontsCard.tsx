
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ThemeSettings } from '../../../types/theme-types';

// Font options
const fontOptions = [
  { name: "تجوال", value: "Tajawal" },
  { name: "كايرو", value: "Cairo" },
  { name: "الماري", value: "Almarai" },
  { name: "شانغا", value: "Changa" },
  { name: "ريم كوفي", value: "Reem Kufi" },
];

interface FontsCardProps {
  themeSettings: ThemeSettings;
  onFontChange: (font: string) => void;
  onLayoutChange: (key: string, value: any) => void;
}

const FontsCard: React.FC<FontsCardProps> = ({
  themeSettings,
  onFontChange,
  onLayoutChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">الخطوط</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="font-family">نوع الخط</Label>
            <Select 
              value={themeSettings.font_family} 
              onValueChange={(value) => onFontChange(value)}
            >
              <SelectTrigger id="font-family" className="w-full">
                <SelectValue placeholder="اختر نوع الخط" />
              </SelectTrigger>
              <SelectContent>
                {fontOptions.map(font => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-4">
            <Label htmlFor="custom-css">CSS مخصص</Label>
            <Input 
              id="custom-css" 
              placeholder="أضف CSS مخصص هنا" 
              className="font-mono text-sm" 
              value={themeSettings.custom_css || ''}
              onChange={(e) => onLayoutChange('custom_css', e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">متاح في الباقات المدفوعة فقط</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FontsCard;
