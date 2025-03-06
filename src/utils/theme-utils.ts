
import { supabase } from '@/integrations/supabase/client';

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
}

/**
 * Fetches theme settings for a store
 * @param storeId - The ID of the store
 * @returns The theme settings for the store
 */
export const getThemeSettings = async (storeId: string): Promise<ThemeSettings | null> => {
  try {
    const { data, error } = await supabase
      .from('store_theme_settings')
      .select('*')
      .eq('store_id', storeId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching theme settings:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getThemeSettings:', error);
    return null;
  }
};

/**
 * Saves theme settings for a store
 * @param settings - The theme settings to save
 * @returns The saved theme settings
 */
export const saveThemeSettings = async (settings: ThemeSettings): Promise<ThemeSettings | null> => {
  try {
    if (!settings.store_id) {
      throw new Error('Store ID is required');
    }
    
    if (settings.id) {
      // Update existing settings
      const { data, error } = await supabase
        .from('store_theme_settings')
        .update({
          theme_id: settings.theme_id,
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          accent_color: settings.accent_color,
          layout_type: settings.layout_type,
          products_per_row: settings.products_per_row,
          font_family: settings.font_family,
          custom_css: settings.custom_css,
        })
        .eq('id', settings.id)
        .select();
        
      if (error) throw error;
      return data[0] || null;
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('store_theme_settings')
        .insert([{
          store_id: settings.store_id,
          theme_id: settings.theme_id,
          primary_color: settings.primary_color,
          secondary_color: settings.secondary_color,
          accent_color: settings.accent_color,
          layout_type: settings.layout_type,
          products_per_row: settings.products_per_row,
          font_family: settings.font_family,
          custom_css: settings.custom_css,
        }])
        .select();
        
      if (error) throw error;
      return data[0] || null;
    }
  } catch (error) {
    console.error('Error in saveThemeSettings:', error);
    return null;
  }
};

/**
 * Applies theme settings to the current page
 * @param settings - The theme settings to apply
 */
export const applyThemeSettings = (settings: ThemeSettings): void => {
  // Create or get the theme style element
  let styleEl = document.getElementById('dynamic-theme-styles');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'dynamic-theme-styles';
    document.head.appendChild(styleEl);
  }
  
  // Generate CSS based on theme settings
  const css = `
    :root {
      --theme-primary: ${settings.primary_color};
      --theme-secondary: ${settings.secondary_color};
      --theme-accent: ${settings.accent_color};
      --products-per-row: ${settings.products_per_row};
    }
    
    .theme-font-${settings.font_family} {
      font-family: var(--theme-font-${settings.font_family}, inherit);
    }
    
    ${settings.custom_css || ''}
  `;
  
  // Apply the CSS
  styleEl.textContent = css;
  
  // Apply the font family class to the body
  document.body.classList.forEach(cls => {
    if (cls.startsWith('theme-font-')) {
      document.body.classList.remove(cls);
    }
  });
  
  document.body.classList.add(`theme-font-${settings.font_family}`);
};
