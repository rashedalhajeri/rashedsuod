
import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import ThemePreviewCard from '../ThemePreviewCard';
import { ThemeOption } from '../../types/theme-types';

interface ThemeGridProps {
  themes: ThemeOption[];
  selectedTheme: string | null;
  isLoading: boolean;
  onThemeSelect: (themeId: string) => void;
  onPreview: (theme: ThemeOption) => void;
}

const ThemeGrid: React.FC<ThemeGridProps> = ({
  themes,
  selectedTheme,
  isLoading,
  onThemeSelect,
  onPreview
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-40 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <RadioGroup
      value={selectedTheme || ''}
      onValueChange={onThemeSelect}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {themes.map((theme) => (
        <div key={theme.id} className="relative">
          <div 
            className={`absolute top-2 right-2 z-10 ${
              selectedTheme === theme.id ? 'opacity-100' : 'opacity-0'
            } transition-opacity`}
          >
            <div className="bg-primary text-white rounded-full p-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
          
          <RadioGroupItem 
            value={theme.id} 
            id={theme.id} 
            className="peer sr-only" 
          />
          
          <Label
            htmlFor={theme.id}
            className="cursor-pointer block"
          >
            <ThemePreviewCard
              theme={theme}
              selected={selectedTheme === theme.id}
              onSelect={() => onThemeSelect(theme.id)}
              onPreview={() => onPreview(theme)}
            />
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default ThemeGrid;
