
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeSettings } from '../../../types/theme-types';

interface ElementStylesCardProps {
  themeSettings: ThemeSettings;
  onLayoutChange: (key: string, value: any) => void;
}

const ElementStylesCard: React.FC<ElementStylesCardProps> = ({
  themeSettings,
  onLayoutChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">أنماط العناصر</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="button-style">أزرار</Label>
              <Select 
                value={themeSettings.button_style || 'rounded'} 
                onValueChange={(value) => onLayoutChange('button_style', value)}
              >
                <SelectTrigger id="button-style">
                  <SelectValue placeholder="اختر نمط الأزرار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="squared">مربع</SelectItem>
                  <SelectItem value="rounded">حواف دائرية</SelectItem>
                  <SelectItem value="pill">كبسولة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="image-style">صور المنتجات</Label>
              <Select 
                value={themeSettings.image_style || 'rounded'} 
                onValueChange={(value) => onLayoutChange('image_style', value)}
              >
                <SelectTrigger id="image-style">
                  <SelectValue placeholder="اختر نمط الصور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="squared">مربع</SelectItem>
                  <SelectItem value="rounded">حواف دائرية</SelectItem>
                  <SelectItem value="circle">دائرية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">الرأس والتذييل</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="header-style">نمط الرأس</Label>
              <Select 
                value={themeSettings.header_style || 'standard'} 
                onValueChange={(value) => onLayoutChange('header_style', value)}
              >
                <SelectTrigger id="header-style">
                  <SelectValue placeholder="اختر نمط الرأس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">مبسط</SelectItem>
                  <SelectItem value="standard">قياسي</SelectItem>
                  <SelectItem value="centered">مركزي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="footer-style">نمط التذييل</Label>
              <Select 
                value={themeSettings.footer_style || 'standard'} 
                onValueChange={(value) => onLayoutChange('footer_style', value)}
              >
                <SelectTrigger id="footer-style">
                  <SelectValue placeholder="اختر نمط التذييل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">مبسط</SelectItem>
                  <SelectItem value="standard">قياسي</SelectItem>
                  <SelectItem value="expanded">موسع</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElementStylesCard;
