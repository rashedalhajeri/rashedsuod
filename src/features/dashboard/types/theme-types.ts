
export interface ThemeOption {
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
  layout?: {
    type: string;
    productsPerRow: number;
    spacing: string;
  };
  styles?: {
    button: string;
    image: string;
    header: string;
    footer: string;
  };
}

export interface ThemeSettings {
  id?: string;
  store_id: string;
  theme_id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  layout_type: string;
  products_per_row: number;
  font_family: string;
  custom_css?: string;
  layout_spacing?: string;
  button_style?: string;
  image_style?: string;
  header_style?: string;
  footer_style?: string;
}

export interface ColorOption {
  name: string;
  value: string;
}

export interface FontOption {
  name: string;
  value: string;
}
