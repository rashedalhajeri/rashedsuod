
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeSettings } from '../../../types/theme-types';

interface LayoutCardProps {
  themeSettings: ThemeSettings;
  onLayoutChange: (key: string, value: any) => void;
}

const LayoutCard: React.FC<LayoutCardProps> = ({
  themeSettings,
  onLayoutChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">تخطيط المنتجات</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="layout-type">نوع التخطيط</Label>
            <Select 
              value={themeSettings.layout_type} 
              onValueChange={(value) => onLayoutChange('layout_type', value)}
            >
              <SelectTrigger id="layout-type">
                <SelectValue placeholder="اختر نوع التخطيط" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">شبكة</SelectItem>
                <SelectItem value="list">قائمة</SelectItem>
                <SelectItem value="masonry">متداخل</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="products-per-row">عدد المنتجات في الصف</Label>
            <Select 
              value={themeSettings.products_per_row.toString()} 
              onValueChange={(value) => onLayoutChange('products_per_row', parseInt(value))}
            >
              <SelectTrigger id="products-per-row">
                <SelectValue placeholder="اختر عدد المنتجات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 منتجات</SelectItem>
                <SelectItem value="3">3 منتجات</SelectItem>
                <SelectItem value="4">4 منتجات</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="spacing">المسافات</Label>
            <Select 
              value={themeSettings.layout_spacing || 'normal'} 
              onValueChange={(value) => onLayoutChange('layout_spacing', value)}
            >
              <SelectTrigger id="spacing">
                <SelectValue placeholder="اختر حجم المسافات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">متراص</SelectItem>
                <SelectItem value="normal">عادي</SelectItem>
                <SelectItem value="spacious">واسع</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutCard;
