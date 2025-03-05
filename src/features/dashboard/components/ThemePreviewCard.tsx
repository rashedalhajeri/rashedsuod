
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Eye, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

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
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={cn(
        "overflow-hidden transition-all duration-200 hover:shadow-lg",
        selected && "ring-2 ring-primary ring-offset-2"
      )}>
        <div className="relative">
          {/* Theme premium badge */}
          {theme.isPremium && (
            <div className="absolute top-2 left-2 z-10">
              <Badge className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1">
                <Crown className="h-3 w-3" />
                <span>مميز</span>
              </Badge>
            </div>
          )}
          
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
              className="w-6 h-6 rounded-full border shadow-sm" 
              style={{ backgroundColor: theme.colors.primary }}
              title="اللون الرئيسي"
            />
            <div 
              className="w-6 h-6 rounded-full border shadow-sm" 
              style={{ backgroundColor: theme.colors.secondary }}
              title="اللون الثانوي"
            />
            <div 
              className="w-6 h-6 rounded-full border shadow-sm" 
              style={{ backgroundColor: theme.colors.accent }}
              title="لون التأكيد"
            />
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-0 flex justify-end">
          <Button 
            variant={selected ? "default" : "outline"} 
            onClick={onSelect}
            className={cn("w-full", 
              selected ? "bg-primary hover:bg-primary/90" : "hover:bg-primary/10 hover:text-primary"
            )}
          >
            {selected ? 'الثيم المحدد' : 'اختيار الثيم'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ThemePreviewCard;
