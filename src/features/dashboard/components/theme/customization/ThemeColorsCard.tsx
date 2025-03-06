
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ThemeSettings } from '../../../types/theme-types';
import ThemeColorCustomizer from '../ThemeColorCustomizer';

interface ThemeColorsCardProps {
  themeSettings: ThemeSettings;
  onLayoutChange: (key: string, value: any) => void;
}

const ThemeColorsCard: React.FC<ThemeColorsCardProps> = ({
  themeSettings,
  onLayoutChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">الألوان</h3>
        <ThemeColorCustomizer 
          themeSettings={themeSettings}
          setThemeSettings={(newSettings) => onLayoutChange('', newSettings)}
        />
      </CardContent>
    </Card>
  );
};

export default ThemeColorsCard;
