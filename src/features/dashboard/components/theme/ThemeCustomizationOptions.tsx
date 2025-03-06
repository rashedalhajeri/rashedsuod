
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight } from 'lucide-react';
import { ThemeSettings } from '../../types/theme-types';
import ThemeColorsCard from './customization/ThemeColorsCard';
import FontsCard from './customization/FontsCard';
import LayoutCard from './customization/LayoutCard';
import ElementStylesCard from './customization/ElementStylesCard';
import LoadingState from './customization/LoadingState';
import LivePreviewPanel from './customization/LivePreviewPanel';
import { themes } from '../../data/theme-data';
import { useMediaQuery } from "@/hooks/use-media-query";

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
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const selectedTheme = themeSettings ? themes.find(t => t.id === themeSettings.theme_id) : null;

  if (isLoading) {
    return <LoadingState />;
  }

  if (!themeSettings) {
    return (
      <div className="text-center py-8">
        <p>يرجى اختيار تصميم أولاً من قسم "تصاميم المتجر"</p>
      </div>
    );
  }

  return (
    <div className="lg:grid lg:grid-cols-5 lg:gap-8">
      <div className="lg:col-span-3 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ThemeColorsCard 
            themeSettings={themeSettings}
            onLayoutChange={onLayoutChange}
          />
          
          <FontsCard 
            themeSettings={themeSettings}
            onFontChange={onFontChange}
            onLayoutChange={onLayoutChange}
          />
          
          <LayoutCard 
            themeSettings={themeSettings}
            onLayoutChange={onLayoutChange}
          />
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
      
      {isDesktop && (
        <div className="hidden lg:block lg:col-span-2">
          <LivePreviewPanel 
            themeSettings={themeSettings}
            selectedTheme={selectedTheme} 
          />
        </div>
      )}
    </div>
  );
};

export default ThemeCustomizationOptions;
