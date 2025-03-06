
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeSettings } from '../types/theme-types';
import { fontOptions } from '../data/theme-data';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";

interface ThemeTypographyProps {
  themeSettings: ThemeSettings;
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
}

const ThemeTypography: React.FC<ThemeTypographyProps> = ({
  themeSettings,
  setThemeSettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">إعدادات الخط</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="font-family">نوع الخط</Label>
            <RadioGroup 
              value={themeSettings.font_family} 
              onValueChange={(value) => setThemeSettings(prev => ({ ...prev, font_family: value }))}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="default" id="font-default" className="ml-2" />
                <div className="flex flex-col">
                  <Label htmlFor="font-default" className="cursor-pointer">الافتراضي</Label>
                  <p className="mt-2 text-sm font-normal text-muted-foreground">أهلاً بك في المتجر</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="cairo" id="font-cairo" className="ml-2" />
                <div className="flex flex-col">
                  <Label htmlFor="font-cairo" className="cursor-pointer">القاهرة</Label>
                  <p className="mt-2 text-sm font-normal text-muted-foreground" style={{ fontFamily: "'Cairo', sans-serif" }}>أهلاً بك في المتجر</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="tajawal" id="font-tajawal" className="ml-2" />
                <div className="flex flex-col">
                  <Label htmlFor="font-tajawal" className="cursor-pointer">تجول</Label>
                  <p className="mt-2 text-sm font-normal text-muted-foreground" style={{ fontFamily: "'Tajawal', sans-serif" }}>أهلاً بك في المتجر</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="almarai" id="font-almarai" className="ml-2" />
                <div className="flex flex-col">
                  <Label htmlFor="font-almarai" className="cursor-pointer">المراعي</Label>
                  <p className="mt-2 text-sm font-normal text-muted-foreground" style={{ fontFamily: "'Almarai', sans-serif" }}>أهلاً بك في المتجر</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="changa" id="font-changa" className="ml-2" />
                <div className="flex flex-col">
                  <Label htmlFor="font-changa" className="cursor-pointer">تشانجا</Label>
                  <p className="mt-2 text-sm font-normal text-muted-foreground" style={{ fontFamily: "'Changa', sans-serif" }}>أهلاً بك في المتجر</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 space-x-reverse border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <RadioGroupItem value="reem-kufi" id="font-reem-kufi" className="ml-2" />
                <div className="flex flex-col">
                  <Label htmlFor="font-reem-kufi" className="cursor-pointer">ريم كوفي</Label>
                  <p className="mt-2 text-sm font-normal text-muted-foreground" style={{ fontFamily: "'Reem Kufi', sans-serif" }}>أهلاً بك في المتجر</p>
                </div>
              </div>
            </RadioGroup>
          </div>
          
          <div className="border rounded-lg p-4 mt-4">
            <h3 className="font-bold text-base mb-4">معاينة النصوص</h3>
            
            <div className="space-y-4">
              <div className="py-2">
                <h1 className={`text-2xl font-bold`} style={{ fontFamily: themeSettings.font_family !== 'default' ? `'${themeSettings.font_family}', sans-serif` : 'inherit' }}>
                  عنوان رئيسي للمتجر
                </h1>
              </div>
              
              <div className="py-2">
                <h2 className={`text-xl font-semibold`} style={{ fontFamily: themeSettings.font_family !== 'default' ? `'${themeSettings.font_family}', sans-serif` : 'inherit' }}>
                  عنوان فرعي لقسم المنتجات
                </h2>
              </div>
              
              <div className="py-2">
                <p className={`text-base`} style={{ fontFamily: themeSettings.font_family !== 'default' ? `'${themeSettings.font_family}', sans-serif` : 'inherit' }}>
                  هذا نص تجريبي لمعاينة شكل الخط المختار. يمكنك من خلال هذا النص معرفة كيف سيظهر المحتوى النصي في متجرك.
                </p>
              </div>
              
              <div className="py-2">
                <p className={`text-sm text-gray-600`} style={{ fontFamily: themeSettings.font_family !== 'default' ? `'${themeSettings.font_family}', sans-serif` : 'inherit' }}>
                  نص ثانوي أصغر للمعلومات الإضافية والتفاصيل.
                </p>
              </div>
              
              <div className="py-2">
                <button 
                  className={`bg-primary text-white px-4 py-2 rounded`}
                  style={{ fontFamily: themeSettings.font_family !== 'default' ? `'${themeSettings.font_family}', sans-serif` : 'inherit' }}
                >
                  زر بنفس الخط
                </button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeTypography;
