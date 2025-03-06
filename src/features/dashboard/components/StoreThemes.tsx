
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, PaintBucket, Layout, TextIcon, Grid, Sliders } from 'lucide-react';
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
import ThemeTypography from './ThemeTypography';
import ThemePreview from './ThemePreview';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
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
  const [previewMode, setPreviewMode] = useState(false);
  
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    store_id: storeId || '',
    theme_id: 'classic',
    primary_color: '#22C55E',
    secondary_color: '#E2E8F0',
    accent_color: '#CBD5E0',
    layout_type: 'grid',
    products_per_row: 3,
    font_family: 'default',
    layout_spacing: 'comfortable',
    button_style: 'rounded',
    image_style: 'rounded',
    header_style: 'centered',
    footer_style: 'simple',
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
        layout_spacing: existingSettings.layout_spacing || 'comfortable',
        button_style: existingSettings.button_style || 'rounded',
        image_style: existingSettings.image_style || 'rounded',
        header_style: existingSettings.header_style || 'centered',
        footer_style: existingSettings.footer_style || 'simple',
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
        layout_type: selectedTheme.layout?.type || prev.layout_type,
        button_style: selectedTheme.styles?.button || prev.button_style,
        image_style: selectedTheme.styles?.image || prev.image_style,
        header_style: selectedTheme.styles?.header || prev.header_style,
        footer_style: selectedTheme.styles?.footer || prev.footer_style,
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

  const togglePreviewMode = () => {
    setPreviewMode(!previewMode);
  };
  
  if (isLoadingSettings) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {previewMode ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">معاينة المتجر</h2>
            <button 
              onClick={togglePreviewMode}
              className="bg-primary text-white px-4 py-2 rounded-md text-sm"
            >
              العودة للتحرير
            </button>
          </div>
          <ThemePreview settings={themeSettings} />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h2 className="text-xl font-bold">تخصيص تصميم المتجر</h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePreviewMode}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                <span>معاينة التصميم</span>
              </button>
              <SaveButton onClick={handleSaveSettings} isSaving={isSaving} />
            </div>
          </div>

          <Alert className="bg-amber-50 border border-amber-200 text-amber-800">
            <AlertDescription className="flex items-center gap-2">
              <span>قم باختيار تصميم متجرك ثم خصص الألوان والتنسيقات حسب احتياجاتك</span>
            </AlertDescription>
          </Alert>

          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="themes" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>القوالب</span>
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <PaintBucket className="h-4 w-4" />
                <span>الألوان</span>
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                <span>التنسيق</span>
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <TextIcon className="h-4 w-4" />
                <span>الخطوط</span>
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
            
            <TabsContent value="colors" className="pt-4">
              <ThemeColorCustomizer 
                themeSettings={themeSettings}
                setThemeSettings={setThemeSettings}
              />
            </TabsContent>
            
            <TabsContent value="layout" className="pt-4">
              <ThemeLayoutCustomizer 
                themeSettings={themeSettings}
                setThemeSettings={setThemeSettings}
              />
            </TabsContent>

            <TabsContent value="typography" className="pt-4">
              <ThemeTypography 
                themeSettings={themeSettings}
                setThemeSettings={setThemeSettings}
              />
            </TabsContent>
          </Tabs>
          
          <ThemePreviewDialog
            open={previewDialogOpen}
            onOpenChange={setPreviewDialogOpen}
            previewTheme={previewTheme}
            onSelectTheme={handleSelectTheme}
          />
        </>
      )}
    </div>
  );
};

export default StoreThemes;
