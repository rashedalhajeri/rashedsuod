
export type ThemeType = 'classic' | 'modern' | 'minimal' | 'business';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface StoreTheme {
  id: string;
  storeId: string;
  themeType: ThemeType;
  colors: ThemeColors;
  customLogo: boolean;
  customFonts: boolean;
  customCss: string | null;
  createdAt: string;
  updatedAt: string;
}
