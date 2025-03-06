
import React from 'react';
import { ThemeOption } from '../types/theme-types';
import ThemePreviewCard from './ThemePreviewCard';

interface ThemeGridProps {
  themes: ThemeOption[];
  selectedThemeId: string;
  onSelectTheme: (themeId: string) => void;
  onPreviewTheme: (theme: ThemeOption) => void;
}

const ThemeGrid: React.FC<ThemeGridProps> = ({
  themes,
  selectedThemeId,
  onSelectTheme,
  onPreviewTheme
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {themes.map((theme) => (
        <ThemePreviewCard
          key={theme.id}
          theme={theme}
          selected={selectedThemeId === theme.id}
          onSelect={() => onSelectTheme(theme.id)}
          onPreview={() => onPreviewTheme(theme)}
        />
      ))}
    </div>
  );
};

export default ThemeGrid;
