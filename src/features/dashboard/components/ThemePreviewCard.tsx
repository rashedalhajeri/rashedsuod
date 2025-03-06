
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  preview: string;
  isPremium: boolean;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface ThemePreviewCardProps {
  theme: ThemeOption;
  selected: boolean;
  onSelect: () => void;
  onPreview?: () => void;
}

const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({ 
  theme, 
  selected, 
  onSelect,
  onPreview
}) => {
  // Placeholder image URL if the actual preview is not available
  const previewUrl = theme.preview || 'https://via.placeholder.com/400x300';
  
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200 hover:shadow-md",
      selected && "ring-2 ring-primary ring-offset-2"
    )}>
      <div className="relative">
        {/* Preview image with the theme's primary color as background if image fails to load */}
        <div 
          className="h-48 bg-cover bg-center relative cursor-pointer"
          style={{ 
            backgroundImage: `url(${previewUrl})`,
            backgroundColor: theme.colors.primary 
          }}
          onClick={onPreview}
        >
          {/* Tooltip for preview indication */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute inset-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Eye className="h-6 w-6 mr-2" />
                  <p className="font-bold text-xl">معاينة</p>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>انقر لمعاينة التصميم</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Display theme name */}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
            <p className="font-bold text-white">{theme.name}</p>
          </div>
          
          {/* Selected badge */}
          {selected && (
            <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full">
              <Check className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{theme.description}</p>
        
        {/* Color preview */}
        <div className="flex mt-3 space-x-1 rtl:space-x-reverse">
          <div 
            className="w-6 h-6 rounded-full border" 
            style={{ backgroundColor: theme.colors.primary }}
            title="اللون الرئيسي"
          />
          <div 
            className="w-6 h-6 rounded-full border" 
            style={{ backgroundColor: theme.colors.secondary }}
            title="اللون الثانوي"
          />
          <div 
            className="w-6 h-6 rounded-full border" 
            style={{ backgroundColor: theme.colors.accent }}
            title="لون التأكيد"
          />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button 
          variant={selected ? "default" : "outline"} 
          onClick={onSelect}
          className="flex-1"
        >
          {selected ? 'الثيم المحدد' : 'اختيار الثيم'}
        </Button>
        
        {onPreview && (
          <Button 
            variant="outline" 
            onClick={onPreview}
            className="flex-none"
            size="icon"
            title="معاينة الثيم"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ThemePreviewCard;
