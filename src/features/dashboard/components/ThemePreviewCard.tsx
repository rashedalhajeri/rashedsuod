
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
}

const ThemePreviewCard: React.FC<ThemePreviewCardProps> = ({ 
  theme, 
  selected, 
  onSelect 
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
          className="h-48 bg-cover bg-center relative"
          style={{ 
            backgroundImage: `url(${previewUrl})`,
            backgroundColor: theme.colors.primary 
          }}
        >
          {/* Fallback content in case the image doesn't load */}
          <div className="absolute inset-0 flex items-center justify-center text-white bg-black/30">
            <p className="font-bold text-xl">{theme.name}</p>
          </div>
          
          {/* Premium badge */}
          {theme.isPremium && (
            <Badge 
              variant="outline" 
              className="absolute top-2 right-2 bg-amber-500 text-white border-0"
            >
              <Crown className="h-3 w-3 mr-1" />
              <span>Premium</span>
            </Badge>
          )}
          
          {/* Selected badge */}
          {selected && (
            <div className="absolute bottom-2 right-2 bg-primary text-white p-1 rounded-full">
              <Check className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold mb-1">{theme.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{theme.description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-end">
        <Button 
          variant={selected ? "default" : "outline"} 
          onClick={onSelect}
          disabled={theme.isPremium}
          className="w-full"
        >
          {selected ? 'الثيم المحدد' : theme.isPremium ? 'متوفر في الباقة المدفوعة' : 'اختيار الثيم'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThemePreviewCard;
