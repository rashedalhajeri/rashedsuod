
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import { ThemeSettings } from '../../types/theme-types';
import ThemeColorCustomizer from './ThemeColorCustomizer';
import { Skeleton } from '@/components/ui/skeleton';

// Font options
const fontOptions = [
  { name: "تجوال", value: "Tajawal" },
  { name: "كايرو", value: "Cairo" },
  { name: "الماري", value: "Almarai" },
  { name: "شانغا", value: "Changa" },
  { name: "ريم كوفي", value: "Reem Kufi" },
];

interface ThemeCustomizationOptionsProps {
  isLoading: boolean;
  themeSettings: ThemeSettings | null;
  onFontChange: (font: string) => void;
  onLayoutChange: (key: string, value: any) => void;
  onSaveSettings: () => void;
  isSaving: boolean;
}

const ThemeCustomizationOptions: React.FC<ThemeCustomizationOptionsProps> = ({
  isLoading,
  themeSettings,
  onFontChange,
  onLayoutChange,
  onSaveSettings,
  isSaving
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!themeSettings) {
    return (
      <div className="text-center py-8">
        <p>يرجى اختيار تصميم أولاً من قسم "تصاميم المتجر"</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">الألوان</h3>
            <ThemeColorCustomizer 
              themeSettings={themeSettings}
              setThemeSettings={(newSettings) => onLayoutChange('', newSettings)}
            />
          </CardContent>
        </Card>
        
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
      </div>
      
      <ElementStylesCard 
        themeSettings={themeSettings} 
        onLayoutChange={onLayoutChange} 
      />
      
      <div className="flex justify-end">
        <Button 
          onClick={onSaveSettings} 
          disabled={isSaving} 
          className="flex items-center gap-2"
        >
          {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          {isSaving ? null : <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

// Additional subcomponent for element styles
const ElementStylesCard: React.FC<{
  themeSettings: ThemeSettings;
  onLayoutChange: (key: string, value: any) => void;
}> = ({ themeSettings, onLayoutChange }) => {
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

export default ThemeCustomizationOptions;
