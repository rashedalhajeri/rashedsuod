
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ThemeSettings } from '../../types/theme-types';
import { colorOptions, secondaryColorOptions, accentColorOptions } from '../../data/theme-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw } from 'lucide-react';
import ColorSchemesGrid from './ColorSchemesGrid';
import IndividualColorPicker from './IndividualColorPicker';
import ColorPreview from './ColorPreview';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

// Define the color schemes
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

interface ThemeColorCustomizerProps {
  themeSettings: ThemeSettings;
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings | null>>;
}

const ThemeColorCustomizer: React.FC<ThemeColorCustomizerProps> = ({
  themeSettings,
  setThemeSettings
}) => {
  const [colorSchemeTab, setColorSchemeTab] = React.useState('individual');
  
  const applyColorScheme = (primary: string, secondary: string, accent: string) => {
    setThemeSettings(prev => {
      if (!prev) return null;
      return {
        ...prev,
        primary_color: primary,
        secondary_color: secondary,
        accent_color: accent
      };
    });
  };
  
  const setRandomColorScheme = () => {
    const randomScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    applyColorScheme(randomScheme.primary, randomScheme.secondary, randomScheme.accent);
  };

  const handlePrimaryColorChange = (value: string) => {
    setThemeSettings(prev => {
      if (!prev) return null;
      return { ...prev, primary_color: value };
    });
  };

  const handleSecondaryColorChange = (value: string) => {
    setThemeSettings(prev => {
      if (!prev) return null;
      return { ...prev, secondary_color: value };
    });
  };

  const handleAccentColorChange = (value: string) => {
    setThemeSettings(prev => {
      if (!prev) return null;
      return { ...prev, accent_color: value };
    });
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={colorSchemeTab} value={colorSchemeTab} onValueChange={setColorSchemeTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-4">
          <TabsTrigger value="scheme" className="flex items-center gap-2">
            <span>مجموعات الألوان</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-xs">اختر مجموعة ألوان متناسقة لمتجرك من المجموعات الجاهزة</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <span>الألوان الفردية</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-xs">خصص كل لون من ألوان متجرك بشكل منفصل</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheme" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium">اختر مجموعة ألوان متناسقة</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    onClick={setRandomColorScheme}
                    className="text-xs flex items-center gap-1 text-gray-600 hover:text-primary py-1 px-2 rounded hover:bg-gray-100"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>عشوائي</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-xs">اختيار مجموعة ألوان عشوائية</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <ColorSchemesGrid 
            colorSchemes={colorSchemes}
            selectedColors={{
              primary: themeSettings.primary_color,
              secondary: themeSettings.secondary_color,
              accent: themeSettings.accent_color
            }}
            onSchemeSelect={applyColorScheme}
          />
        </TabsContent>
        
        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تخصيص الألوان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <IndividualColorPicker
                  id="primary-color"
                  label="اللون الرئيسي"
                  value={themeSettings.primary_color}
                  options={colorOptions}
                  onChange={handlePrimaryColorChange}
                  tooltip="اللون الأساسي للمتجر، يستخدم للعناوين والأزرار والعناصر البارزة"
                />
                
                <IndividualColorPicker
                  id="secondary-color"
                  label="اللون الثانوي (الخلفية)"
                  value={themeSettings.secondary_color}
                  options={secondaryColorOptions}
                  onChange={handleSecondaryColorChange}
                  tooltip="يستخدم للخلفيات والمناطق الثانوية في متجرك"
                />
                
                <IndividualColorPicker
                  id="accent-color"
                  label="لون التأكيد (العناصر البارزة)"
                  value={themeSettings.accent_color}
                  options={accentColorOptions}
                  onChange={handleAccentColorChange}
                  tooltip="يستخدم لإبراز العناصر المهمة مثل الأيقونات والشارات والتنبيهات"
                />
              </div>
              
              <ColorPreview
                primaryColor={themeSettings.primary_color}
                secondaryColor={themeSettings.secondary_color}
                accentColor={themeSettings.accent_color}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ThemeColorCustomizer;
