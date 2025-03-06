
import { supabase } from '@/integrations/supabase/client';
import { ThemeSettings } from '../types/theme-types';

export const fetchThemeSettings = async (storeId: string): Promise<ThemeSettings | null> => {
  if (!storeId) return null;
  
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
};

export const saveThemeSettings = async (settings: ThemeSettings): Promise<ThemeSettings | null> => {
  if (!settings.store_id) {
    throw new Error('لم يتم العثور على معرف المتجر');
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
    // Create new settings
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
};
