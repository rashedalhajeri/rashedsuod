
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, PaintBucket } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import SaveButton from '@/components/ui/save-button';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThemeSettings } from '../types/theme-types';
import { themes } from '../data/theme-data';
import { fetchThemeSettings, saveThemeSettings } from '../services/theme-service';
import ThemeGrid from './ThemeGrid';
import ThemePreviewDialog from './ThemePreviewDialog';
import ThemeColorCustomizer from './ThemeColorCustomizer';
import ThemeLayoutCustomizer from './ThemeLayoutCustomizer';
import ComingSoonBanner from './ComingSoonBanner';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StoreThemesProps {
  storeId?: string;
}

const StoreThemes: React.FC<StoreThemesProps> = ({ storeId }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('themes');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState(null);
  
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    store_id: storeId || '',
    theme_id: 'classic',
    primary_color: '#22C55E',
    secondary_color: '#E2E8F0',
    accent_color: '#CBD5E0',
    layout_type: 'grid',
    products_per_row: 3,
    font_family: 'default',
  });
  
  const { data: existingSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['themeSettings', storeId],
    queryFn: async () => storeId ? fetchThemeSettings(storeId) : null,
    enabled: !!storeId,
  });
  
  useEffect(() => {
    if (existingSettings) {
      setThemeSettings({
        id: existingSettings.id,
        store_id: existingSettings.store_id,
        theme_id: existingSettings.theme_id,
        primary_color: existingSettings.primary_color,
        secondary_color: existingSettings.secondary_color,
        accent_color: existingSettings.accent_color,
        layout_type: existingSettings.layout_type,
        products_per_row: existingSettings.products_per_row,
        font_family: existingSettings.font_family,
        custom_css: existingSettings.custom_css,
      });
    }
  }, [existingSettings]);
  
  const { mutate: saveThemeSettingsMutation, isPending: isSaving } = useMutation({
    mutationFn: saveThemeSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themeSettings', storeId] });
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات التصميم بنجاح",
      });
    },
    onError: (error) => {
      console.error('Error saving theme settings:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    }
  });
  
  const handleSelectTheme = (themeId: string) => {
    const selectedTheme = themes.find(t => t.id === themeId);
    if (selectedTheme) {
      setThemeSettings(prev => ({
        ...prev,
        theme_id: themeId,
        primary_color: selectedTheme.colors.primary,
        secondary_color: selectedTheme.colors.secondary,
        accent_color: selectedTheme.colors.accent,
      }));
    }
  };
  
  const handlePreviewTheme = (theme) => {
    setPreviewTheme(theme);
    setPreviewDialogOpen(true);
  };
  
  const handleSaveSettings = async (): Promise<void> => {
    return saveThemeSettingsMutation(themeSettings);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>الثيمات</span>
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center gap-2">
            <PaintBucket className="h-4 w-4" />
            <span>التخصيص</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="themes" className="pt-4">
          <ThemeGrid 
            themes={themes}
            selectedThemeId={themeSettings.theme_id}
            onSelectTheme={handleSelectTheme}
            onPreviewTheme={handlePreviewTheme}
          />
        </TabsContent>
        
        <TabsContent value="customize" className="pt-4">
          <ThemeColorCustomizer 
            themeSettings={themeSettings}
            setThemeSettings={setThemeSettings}
          />
          
          <ThemeLayoutCustomizer 
            themeSettings={themeSettings}
            setThemeSettings={setThemeSettings}
          />
        </TabsContent>
      </Tabs>
      
      <SaveButton onClick={handleSaveSettings} isSaving={isSaving} />
      
      <ThemePreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        previewTheme={previewTheme}
        onSelectTheme={handleSelectTheme}
      />
      
      <ComingSoonBanner
        title="قريباً - معاينة مباشرة للمتجر"
        description="سيتم إضافة ميزة المعاينة المباشرة لمشاهدة تأثير التغييرات على متجرك بشكل فوري"
      />
    </div>
  );
};

export default StoreThemes;
