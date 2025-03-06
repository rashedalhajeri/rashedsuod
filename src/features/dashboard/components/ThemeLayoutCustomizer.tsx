
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSettings } from '../types/theme-types';
import { Grid, Rows, Columns, Coffee, AlignJustify, Layout, Monitor } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ThemeLayoutCustomizerProps {
  themeSettings: ThemeSettings;
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
}

const ThemeLayoutCustomizer: React.FC<ThemeLayoutCustomizerProps> = ({
  themeSettings,
  setThemeSettings
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Grid className="h-5 w-5 text-primary" />
            <span>طريقة عرض المنتجات</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label className="mb-2">نوع العرض</Label>
              <RadioGroup 
                value={themeSettings.layout_type} 
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, layout_type: value }))}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
              >
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="grid" id="grid" className="ml-2" />
                  <div className="flex flex-col flex-1">
                    <Label htmlFor="grid" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Grid className="h-4 w-4 text-primary" />
                        <span>شبكة</span>
                      </div>
                    </Label>
                    <div className="mt-2 h-16 border rounded bg-gray-50 flex items-center justify-center">
                      <div className="grid grid-cols-3 gap-1 p-1">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-gray-300 rounded" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="list" id="list" className="ml-2" />
                  <div className="flex flex-col flex-1">
                    <Label htmlFor="list" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Rows className="h-4 w-4 text-primary" />
                        <span>قائمة</span>
                      </div>
                    </Label>
                    <div className="mt-2 h-16 border rounded bg-gray-50 flex flex-col justify-center p-1 gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-full h-4 bg-gray-300 rounded flex rtl">
                          <div className="w-8 h-full bg-gray-400 rounded" />
                          <div className="flex-1 mx-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="cards" id="cards" className="ml-2" />
                  <div className="flex flex-col flex-1">
                    <Label htmlFor="cards" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Layout className="h-4 w-4 text-primary" />
                        <span>بطاقات</span>
                      </div>
                    </Label>
                    <div className="mt-2 h-16 border rounded bg-gray-50 flex items-center justify-center p-1">
                      <div className="grid grid-cols-2 gap-1">
                        {[...Array(2)].map((_, i) => (
                          <div key={i} className="w-8 h-12 bg-gray-300 rounded-lg shadow-sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="magazine" id="magazine" className="ml-2" />
                  <div className="flex flex-col flex-1">
                    <Label htmlFor="magazine" className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-primary" />
                        <span>مجلة</span>
                      </div>
                    </Label>
                    <div className="mt-2 h-16 border rounded bg-gray-50 flex p-1">
                      <div className="w-1/3 h-full bg-gray-400 rounded" />
                      <div className="w-2/3 h-full p-1">
                        <div className="grid grid-cols-2 gap-1 h-full">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-gray-300 rounded" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
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
            
            <div className="grid gap-2">
              <Label>المسافات بين العناصر</Label>
              <RadioGroup 
                value={themeSettings.layout_spacing} 
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, layout_spacing: value }))}
                className="grid grid-cols-3 gap-3"
              >
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="compact" id="compact" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="compact" className="cursor-pointer">مدمج</Label>
                    <div className="flex mt-2 gap-1">
                      <div className="w-3 h-3 bg-gray-300 rounded" />
                      <div className="w-3 h-3 bg-gray-300 rounded" />
                      <div className="w-3 h-3 bg-gray-300 rounded" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="comfortable" id="comfortable" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="comfortable" className="cursor-pointer">مريح</Label>
                    <div className="flex mt-2 gap-2">
                      <div className="w-3 h-3 bg-gray-300 rounded" />
                      <div className="w-3 h-3 bg-gray-300 rounded" />
                      <div className="w-3 h-3 bg-gray-300 rounded" />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="spacious" id="spacious" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="spacious" className="cursor-pointer">واسع</Label>
                    <div className="flex mt-2 gap-3">
                      <div className="w-3 h-3 bg-gray-300 rounded" />
                      <div className="w-3 h-3 bg-gray-300 rounded" />
                      <div className="w-3 h-3 bg-gray-300 rounded" />
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">عناصر الواجهة</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-2">
              <Label>نمط الأزرار</Label>
              <RadioGroup 
                value={themeSettings.button_style} 
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, button_style: value }))}
                className="grid grid-cols-3 gap-3"
              >
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="rounded" id="btn-rounded" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="btn-rounded" className="cursor-pointer">دائري</Label>
                    <div className="mt-2 h-8 w-16 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-white">زر</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="square" id="btn-square" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="btn-square" className="cursor-pointer">مربع</Label>
                    <div className="mt-2 h-8 w-16 bg-primary flex items-center justify-center">
                      <span className="text-xs text-white">زر</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="soft" id="btn-soft" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="btn-soft" className="cursor-pointer">ناعم</Label>
                    <div className="mt-2 h-8 w-16 bg-primary rounded-md flex items-center justify-center">
                      <span className="text-xs text-white">زر</span>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label>أسلوب الصور</Label>
              <RadioGroup 
                value={themeSettings.image_style} 
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, image_style: value }))}
                className="grid grid-cols-3 gap-3"
              >
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="rounded" id="img-rounded" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="img-rounded" className="cursor-pointer">دائري</Label>
                    <div className="mt-2 h-12 w-16 bg-gray-300 rounded-lg"></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="square" id="img-square" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="img-square" className="cursor-pointer">مربع</Label>
                    <div className="mt-2 h-12 w-16 bg-gray-300"></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="circle" id="img-circle" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="img-circle" className="cursor-pointer">دائري كامل</Label>
                    <div className="mt-2 h-12 w-12 bg-gray-300 rounded-full mx-auto"></div>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label>نمط رأس الصفحة</Label>
              <RadioGroup 
                value={themeSettings.header_style} 
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, header_style: value }))}
                className="grid grid-cols-3 gap-3"
              >
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="centered" id="header-centered" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="header-centered" className="cursor-pointer">مركزي</Label>
                    <div className="mt-2 h-8 w-full bg-gray-200 flex justify-center items-center">
                      <div className="h-2 w-8 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="logo-left" id="header-logo-left" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="header-logo-left" className="cursor-pointer">شعار يسار</Label>
                    <div className="mt-2 h-8 w-full bg-gray-200 flex items-center justify-end pl-2">
                      <div className="h-4 w-4 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="logo-right" id="header-logo-right" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="header-logo-right" className="cursor-pointer">شعار يمين</Label>
                    <div className="mt-2 h-8 w-full bg-gray-200 flex items-center pr-2">
                      <div className="h-4 w-4 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
            
            <div className="grid gap-2">
              <Label>نمط تذييل الصفحة</Label>
              <RadioGroup 
                value={themeSettings.footer_style} 
                onValueChange={(value) => setThemeSettings(prev => ({ ...prev, footer_style: value }))}
                className="grid grid-cols-3 gap-3"
              >
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="simple" id="footer-simple" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="footer-simple" className="cursor-pointer">بسيط</Label>
                    <div className="mt-2 h-6 w-full bg-gray-200 flex justify-center items-center">
                      <div className="h-1 w-12 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="detailed" id="footer-detailed" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="footer-detailed" className="cursor-pointer">مفصل</Label>
                    <div className="mt-2 h-6 w-full bg-gray-200 flex justify-center">
                      <div className="grid grid-cols-3 gap-1 w-full p-1">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="h-1 bg-gray-400 rounded"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                  <RadioGroupItem value="minimal" id="footer-minimal" className="ml-2" />
                  <div className="flex flex-col">
                    <Label htmlFor="footer-minimal" className="cursor-pointer">مختصر</Label>
                    <div className="mt-2 h-6 w-full bg-gray-200 flex justify-center items-center">
                      <div className="h-1 w-6 bg-gray-400 rounded"></div>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeLayoutCustomizer;
