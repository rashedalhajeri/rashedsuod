
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Paintbrush, Settings } from "lucide-react";
import { fetchThemeSettings, saveThemeSettings } from "@/features/dashboard/services/theme-service";
import { ThemeOption, ThemeSettings } from "@/features/dashboard/types/theme-types";
import { toast } from "sonner";
import { themes } from "@/features/dashboard/data/theme-data";
import ThemeGrid from "./theme/ThemeGrid";
import ThemePreviewDialog from "./theme/ThemePreviewDialog";
import ThemeCustomizationOptions from "./theme/ThemeCustomizationOptions";

interface StoreThemesProps {
  storeId?: string;
}

const StoreThemes: React.FC<StoreThemesProps> = ({ storeId }) => {
  const [activeTab, setActiveTab] = useState("themes");
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [previewTheme, setPreviewTheme] = useState<ThemeOption | null>(null);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [fontFamily, setFontFamily] = useState("Tajawal");
  
  const queryClient = useQueryClient();
  
  // Fetch current theme settings
  const { data: currentThemeSettings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ['themeSettings', storeId],
    queryFn: () => fetchThemeSettings(storeId || ''),
    enabled: !!storeId,
  });
  
  // Save theme settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: saveThemeSettings,
    onSuccess: () => {
      toast.success('تم حفظ إعدادات التصميم بنجاح');
      queryClient.invalidateQueries({ queryKey: ['themeSettings', storeId] });
    },
    onError: (error) => {
      console.error('Error saving theme settings:', error);
      toast.error('حدث خطأ أثناء حفظ إعدادات التصميم');
    },
  });
  
  useEffect(() => {
    if (currentThemeSettings) {
      setThemeSettings(currentThemeSettings);
      setSelectedTheme(currentThemeSettings.theme_id);
      setFontFamily(currentThemeSettings.font_family);
    }
  }, [currentThemeSettings]);
  
  useEffect(() => {
    if (selectedTheme) {
      const theme = themes.find(t => t.id === selectedTheme);
      if (theme) setPreviewTheme(theme);
    }
  }, [selectedTheme]);
  
  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setThemeSettings(prev => {
        if (!prev) return {
          store_id: storeId || '',
          theme_id: themeId,
          primary_color: theme.colors.primary,
          secondary_color: theme.colors.secondary,
          accent_color: theme.colors.accent,
          layout_type: theme.layout?.type || 'grid',
          products_per_row: theme.layout?.productsPerRow || 3,
          font_family: fontFamily,
          layout_spacing: theme.layout?.spacing || 'normal',
          button_style: theme.styles?.button || 'rounded',
          image_style: theme.styles?.image || 'rounded',
          header_style: theme.styles?.header || 'standard',
          footer_style: theme.styles?.footer || 'standard',
        };
        
        return {
          ...prev,
          theme_id: themeId,
          primary_color: theme.colors.primary,
          secondary_color: theme.colors.secondary,
          accent_color: theme.colors.accent,
          layout_type: theme.layout?.type || 'grid',
          products_per_row: theme.layout?.productsPerRow || 3,
          layout_spacing: theme.layout?.spacing || 'normal',
          button_style: theme.styles?.button || 'rounded',
          image_style: theme.styles?.image || 'rounded',
          header_style: theme.styles?.header || 'standard',
          footer_style: theme.styles?.footer || 'standard',
        };
      });
    }
  };
  
  const handleFontChange = (font: string) => {
    setFontFamily(font);
    setThemeSettings(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        font_family: font,
      };
    });
  };
  
  const handleLayoutChange = (key: string, value: any) => {
    if (key === '') {
      // This is a special case for ThemeColorCustomizer which sets the entire themeSettings
      setThemeSettings(value);
      return;
    }
    
    setThemeSettings(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        [key]: value,
      };
    });
  };
  
  const handleSaveSettings = () => {
    if (!themeSettings || !storeId) {
      toast.error('بيانات التصميم غير متوفرة');
      return;
    }
    
    // Add store_id if not present
    if (!themeSettings.store_id) {
      themeSettings.store_id = storeId;
    }
    
    saveSettingsMutation.mutate(themeSettings);
  };
  
  const openPreview = (theme: ThemeOption) => {
    setPreviewTheme(theme);
    setShowPreview(true);
  };
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="themes" className="flex-1">
            <Paintbrush className="h-4 w-4 mr-2" />
            تصاميم المتجر
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex-1">
            <Settings className="h-4 w-4 mr-2" />
            تخصيص التصميم
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="themes" className="pt-4">
          <ThemeGrid 
            themes={themes}
            selectedTheme={selectedTheme}
            isLoading={isSettingsLoading}
            onThemeSelect={handleThemeSelect}
            onPreview={openPreview}
          />
        </TabsContent>
        
        <TabsContent value="customize" className="pt-4">
          <ThemeCustomizationOptions 
            isLoading={isSettingsLoading}
            themeSettings={themeSettings}
            onFontChange={handleFontChange}
            onLayoutChange={handleLayoutChange}
            onSaveSettings={handleSaveSettings}
            isSaving={saveSettingsMutation.isPending}
          />
        </TabsContent>
      </Tabs>
      
      <ThemePreviewDialog 
        open={showPreview}
        onOpenChange={setShowPreview}
        theme={previewTheme}
        themeSettings={themeSettings}
      />
    </div>
  );
};

export default StoreThemes;
