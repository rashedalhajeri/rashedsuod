
import React from 'react';
import { CheckIcon, Info } from 'lucide-react';
import { ColorScheme } from '@/features/dashboard/types/theme-types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ColorSchemesGridProps {
  colorSchemes: ColorScheme[];
  selectedColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  onSchemeSelect: (primary: string, secondary: string, accent: string) => void;
}

const ColorSchemesGrid: React.FC<ColorSchemesGridProps> = ({
  colorSchemes,
  selectedColors,
  onSchemeSelect,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {colorSchemes.map((scheme, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className="border rounded-lg p-3 cursor-pointer hover:border-primary transition-colors relative"
                onClick={() => onSchemeSelect(scheme.primary, scheme.secondary, scheme.accent)}
              >
                {scheme.primary === selectedColors.primary && 
                  scheme.secondary === selectedColors.secondary && 
                  scheme.accent === selectedColors.accent && (
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
            </TooltipTrigger>
            <TooltipContent side="top">
              <div className="space-y-1">
                <p className="font-medium">{scheme.name}</p>
                <p className="text-xs">اللون الرئيسي: {scheme.primary}</p>
                <p className="text-xs">اللون الثانوي: {scheme.secondary}</p>
                <p className="text-xs">لون التأكيد: {scheme.accent}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default ColorSchemesGrid;
