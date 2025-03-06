
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ThemeSettings } from '../../../types/theme-types';
import ThemeColorCustomizer from '../ThemeColorCustomizer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

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
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-medium">الألوان</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">تخصيص ألوان متجرك الأساسية والثانوية للحصول على المظهر المناسب لعلامتك التجارية</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <ThemeColorCustomizer 
          themeSettings={themeSettings}
          setThemeSettings={(newSettings) => {
            if (newSettings) {
              onLayoutChange('', newSettings);
            }
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ThemeColorsCard;
