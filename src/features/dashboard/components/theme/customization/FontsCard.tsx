
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ThemeSettings } from '../../../types/theme-types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

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
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-medium">الخطوط</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">اختر نوع الخط المناسب لمتجرك لتحسين قابلية القراءة ومطابقة هوية علامتك التجارية</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="font-family">نوع الخط</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="max-w-xs">هذا الخط سيُطبق على جميع النصوص في متجرك</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="custom-css">CSS مخصص</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="max-w-xs">أضف أكواد CSS مخصصة لتعديل مظهر متجرك بشكل متقدم - متاح فقط في الباقات المدفوعة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
