
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeSettings } from '../types/theme-types';
import { fontOptions } from '../data/theme-data';

interface ThemeLayoutCustomizerProps {
  themeSettings: ThemeSettings;
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
}

const ThemeLayoutCustomizer: React.FC<ThemeLayoutCustomizerProps> = ({
  themeSettings,
  setThemeSettings
}) => {
  return (
    <>
      <div className="grid gap-2 mb-4">
        <Label htmlFor="font-family">الخط</Label>
        <Select 
          value={themeSettings.font_family} 
          onValueChange={(value) => setThemeSettings(prev => ({ ...prev, font_family: value }))}
        >
          <SelectTrigger className="w-full">
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

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-lg">التخطيط</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label>عرض المنتجات</Label>
              <Select 
                value={themeSettings.layout_type} 
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, layout_type: value }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر طريقة عرض المنتجات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">شبكة</SelectItem>
                  <SelectItem value="list">قائمة</SelectItem>
                  <SelectItem value="compact">مدمج</SelectItem>
                  <SelectItem value="cards">بطاقات</SelectItem>
                  <SelectItem value="magazine">مجلة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label>عدد المنتجات في الصف</Label>
              <Select 
                value={themeSettings.products_per_row.toString()} 
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, products_per_row: parseInt(value) }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="اختر عدد المنتجات في الصف" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 منتجات</SelectItem>
                  <SelectItem value="3">3 منتجات</SelectItem>
                  <SelectItem value="4">4 منتجات</SelectItem>
                  <SelectItem value="5">5 منتجات</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ThemeLayoutCustomizer;
