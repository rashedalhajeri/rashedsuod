
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeSettings } from '../types/theme-types';
import { colorOptions, secondaryColorOptions, accentColorOptions } from '../data/theme-data';

interface ThemeColorCustomizerProps {
  themeSettings: ThemeSettings;
  setThemeSettings: React.Dispatch<React.SetStateAction<ThemeSettings>>;
}

const ThemeColorCustomizer: React.FC<ThemeColorCustomizerProps> = ({
  themeSettings,
  setThemeSettings
}) => {
  return (
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
            <Label htmlFor="secondary-color">اللون الثانوي</Label>
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
            <Label htmlFor="accent-color">لون التأكيد</Label>
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
      </CardContent>
    </Card>
  );
};

export default ThemeColorCustomizer;
