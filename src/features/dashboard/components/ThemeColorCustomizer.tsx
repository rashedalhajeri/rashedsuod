
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeSettings } from '../types/theme-types';
import { colorOptions, secondaryColorOptions, accentColorOptions } from '../data/theme-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckIcon, RefreshCw } from 'lucide-react';

interface ThemeColorCustomizerProps {
  themeSettings: ThemeSettings;
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
}

const ThemeColorCustomizer: React.FC<ThemeColorCustomizerProps> = ({
  themeSettings,
  setThemeSettings
}) => {
  const [colorSchemeTab, setColorSchemeTab] = React.useState('individual');
  
  const colorSchemes = [
    { 
      name: 'الأزرق الكلاسيكي',
      primary: '#2B6CB0',
      secondary: '#EBF8FF',
      accent: '#63B3ED'
    },
    { 
      name: 'الأخضر الطبيعي',
      primary: '#2F855A',
      secondary: '#F0FFF4',
      accent: '#68D391'
    },
    { 
      name: 'البنفسجي الفاخر',
      primary: '#6B46C1',
      secondary: '#FAF5FF',
      accent: '#D6BCFA'
    },
    { 
      name: 'الذهبي الراقي',
      primary: '#D4AF37',
      secondary: '#FFFCEB',
      accent: '#F6E05E'
    },
    { 
      name: 'الأحمر الجذاب',
      primary: '#C53030',
      secondary: '#FFF5F5',
      accent: '#FC8181'
    },
    { 
      name: 'المونوكروم',
      primary: '#1A202C',
      secondary: '#F7FAFC',
      accent: '#A0AEC0'
    },
    { 
      name: 'التركواز المنعش',
      primary: '#2C7A7B',
      secondary: '#E6FFFA',
      accent: '#4FD1C5'
    },
    { 
      name: 'البرتقالي النابض',
      primary: '#C05621',
      secondary: '#FFFAF0',
      accent: '#F6AD55'
    },
  ];
  
  const applyColorScheme = (primary: string, secondary: string, accent: string) => {
    setThemeSettings(prev => ({
      ...prev,
      primary_color: primary,
      secondary_color: secondary,
      accent_color: accent
    }));
  };
  
  const setRandomColorScheme = () => {
    const randomScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    applyColorScheme(randomScheme.primary, randomScheme.secondary, randomScheme.accent);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={colorSchemeTab} value={colorSchemeTab} onValueChange={setColorSchemeTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="scheme" className="flex items-center gap-2">
            <span>مجموعات الألوان</span>
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <span>الألوان الفردية</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheme" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium">اختر مجموعة ألوان متناسقة</h3>
            <button 
              onClick={setRandomColorScheme}
              className="text-xs flex items-center gap-1 text-gray-600 hover:text-primary py-1 px-2 rounded hover:bg-gray-100"
            >
              <RefreshCw className="h-3 w-3" />
              <span>عشوائي</span>
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {colorSchemes.map((scheme, index) => (
              <div 
                key={index}
                className="border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors relative"
                onClick={() => applyColorScheme(scheme.primary, scheme.secondary, scheme.accent)}
              >
                {scheme.primary === themeSettings.primary_color && 
                 scheme.secondary === themeSettings.secondary_color && 
                 scheme.accent === themeSettings.accent_color && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <CheckIcon className="h-3 w-3 text-white" />
                  </div>
                )}
                <h4 className="text-sm font-medium mb-2">{scheme.name}</h4>
                <div className="flex gap-1 mb-2">
                  <div 
                    className="w-full h-8 rounded" 
                    style={{ backgroundColor: scheme.primary }}
                  />
                </div>
                <div className="flex gap-1">
                  <div 
                    className="w-full h-4 rounded" 
                    style={{ backgroundColor: scheme.secondary }}
                  />
                  <div 
                    className="w-full h-4 rounded" 
                    style={{ backgroundColor: scheme.accent }}
                  />
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تخصيص الألوان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="primary-color">اللون الرئيسي</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: themeSettings.primary_color }}
                    />
                    <Select 
                      value={themeSettings.primary_color} 
                      onValueChange={(value) => setThemeSettings(prev => ({ ...prev, primary_color: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر اللون الرئيسي" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="secondary-color">اللون الثانوي (الخلفية)</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: themeSettings.secondary_color }}
                    />
                    <Select 
                      value={themeSettings.secondary_color} 
                      onValueChange={(value) => setThemeSettings(prev => ({ ...prev, secondary_color: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر اللون الثانوي" />
                      </SelectTrigger>
                      <SelectContent>
                        {secondaryColorOptions.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="accent-color">لون التأكيد (العناصر البارزة)</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: themeSettings.accent_color }}
                    />
                    <Select 
                      value={themeSettings.accent_color} 
                      onValueChange={(value) => setThemeSettings(prev => ({ ...prev, accent_color: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر لون التأكيد" />
                      </SelectTrigger>
                      <SelectContent>
                        {accentColorOptions.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="text-base font-semibold mb-3">معاينة الألوان</h3>
                
                <div className="flex flex-col gap-4">
                  <div 
                    className="p-4 rounded-lg flex items-center justify-between"
                    style={{ backgroundColor: themeSettings.primary_color }}
                  >
                    <span className="text-white font-medium">اللون الرئيسي</span>
                    <span className="text-white text-sm">{themeSettings.primary_color}</span>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg flex items-center justify-between border"
                    style={{ backgroundColor: themeSettings.secondary_color }}
                  >
                    <span className="font-medium">اللون الثانوي</span>
                    <span className="text-sm">{themeSettings.secondary_color}</span>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg flex items-center justify-between"
                    style={{ backgroundColor: themeSettings.accent_color }}
                  >
                    <span className="font-medium">لون التأكيد</span>
                    <span className="text-sm">{themeSettings.accent_color}</span>
                  </div>
                  
                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: themeSettings.secondary_color }}
                  >
                    <div className="mb-3 font-medium">مثال على واجهة المستخدم</div>
                    <div className="flex gap-2">
                      <button 
                        className="px-3 py-1 rounded text-white text-sm"
                        style={{ backgroundColor: themeSettings.primary_color }}
                      >
                        زر رئيسي
                      </button>
                      <button 
                        className="px-3 py-1 rounded text-sm"
                        style={{ 
                          backgroundColor: themeSettings.accent_color,
                          color: themeSettings.primary_color 
                        }}
                      >
                        زر ثانوي
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeColorCustomizer;
