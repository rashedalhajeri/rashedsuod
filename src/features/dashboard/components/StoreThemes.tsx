import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Paintbrush, Settings, EyeIcon, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import ThemePreview from "./ThemePreview";
import ThemePreviewCard from "./ThemePreviewCard";
import ThemeColorCustomizer from "./ThemeColorCustomizer";
import { fetchThemeSettings, saveThemeSettings } from "@/features/dashboard/services/theme-service";
import { ThemeOption, ThemeSettings } from "@/features/dashboard/types/theme-types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { themes } from "@/features/dashboard/data/theme-data";

interface StoreThemesProps {
  storeId?: string;
}

// Font options
const fontOptions = [
  { name: "تجوال", value: "Tajawal" },
  { name: "كايرو", value: "Cairo" },
  { name: "الماري", value: "Almarai" },
  { name: "شانغا", value: "Changa" },
  { name: "ريم كوفي", value: "Reem Kufi" },
];

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
  
  const handleColorChange = (colorType: 'primary' | 'secondary' | 'accent', color: string) => {
    setThemeSettings(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        [`${colorType}_color`]: color,
      };
    });
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
  
  const isLoading = isSettingsLoading;
  
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
          {isLoading ? (
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
          ) : (
            <RadioGroup
              value={selectedTheme || ''}
              onValueChange={handleThemeSelect}
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
                      onSelect={() => handleThemeSelect(theme.id)}
                      onPreview={() => openPreview(theme)}
                    />
                    
                    <div className="flex items-center justify-between mt-2 px-2">
                      <div>
                        <h3 className="font-medium">{theme.name}</h3>
                        <p className="text-sm text-muted-foreground">{theme.description}</p>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          openPreview(theme);
                        }}
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        معاينة
                      </Button>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {previewTheme && (
            <Dialog open={showPreview} onOpenChange={setShowPreview}>
              <DialogContent className="max-w-5xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>معاينة التصميم: {previewTheme.name}</DialogTitle>
                  <DialogDescription>
                    نظرة مبدئية على كيفية ظهور متجرك باستخدام هذا التصميم
                  </DialogDescription>
                </DialogHeader>
                <div className="h-full overflow-hidden">
                  <ThemePreview theme={previewTheme} themeSettings={themeSettings} />
                </div>
              </DialogContent>
            </Dialog>
          )}
          
        </TabsContent>
        
        <TabsContent value="customize" className="pt-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : themeSettings ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">الألوان</h3>
                    <ThemeColorCustomizer 
                      themeSettings={themeSettings}
                      setThemeSettings={setThemeSettings}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">الخطوط</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="font-family">نوع الخط</Label>
                        <Select 
                          value={themeSettings.font_family} 
                          onValueChange={(value) => handleFontChange(value)}
                        >
                          <SelectTrigger id="font-family" className="w-full">
                            <SelectValue placeholder="اختر نوع الخط" />
                          </SelectTrigger>
                          <SelectContent>
                            {fontOptions.map(font => (
                              <SelectItem key={font.value} value={font.value}>
                                {font.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="pt-4">
                        <Label htmlFor="custom-css">CSS مخصص</Label>
                        <Input 
                          id="custom-css" 
                          placeholder="أضف CSS مخصص هنا" 
                          className="font-mono text-sm" 
                          value={themeSettings.custom_css || ''}
                          onChange={(e) => handleLayoutChange('custom_css', e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">متاح في الباقات المدفوعة فقط</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">تخطيط المنتجات</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="layout-type">نوع التخطيط</Label>
                        <Select 
                          value={themeSettings.layout_type} 
                          onValueChange={(value) => handleLayoutChange('layout_type', value)}
                        >
                          <SelectTrigger id="layout-type">
                            <SelectValue placeholder="اختر نوع التخطيط" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">شبكة</SelectItem>
                            <SelectItem value="list">قائمة</SelectItem>
                            <SelectItem value="masonry">متداخل</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="products-per-row">عدد المنتجات في الصف</Label>
                        <Select 
                          value={themeSettings.products_per_row.toString()} 
                          onValueChange={(value) => handleLayoutChange('products_per_row', parseInt(value))}
                        >
                          <SelectTrigger id="products-per-row">
                            <SelectValue placeholder="اختر عدد المنتجات" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 منتجات</SelectItem>
                            <SelectItem value="3">3 منتجات</SelectItem>
                            <SelectItem value="4">4 منتجات</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="spacing">المسافات</Label>
                        <Select 
                          value={themeSettings.layout_spacing || 'normal'} 
                          onValueChange={(value) => handleLayoutChange('layout_spacing', value)}
                        >
                          <SelectTrigger id="spacing">
                            <SelectValue placeholder="اختر حجم المسافات" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="compact">متراص</SelectItem>
                            <SelectItem value="normal">عادي</SelectItem>
                            <SelectItem value="spacious">واسع</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">أنماط العناصر</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="button-style">أزرار</Label>
                        <Select 
                          value={themeSettings.button_style || 'rounded'} 
                          onValueChange={(value) => handleLayoutChange('button_style', value)}
                        >
                          <SelectTrigger id="button-style">
                            <SelectValue placeholder="اختر نمط الأزرار" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="squared">مربع</SelectItem>
                            <SelectItem value="rounded">حواف دائرية</SelectItem>
                            <SelectItem value="pill">كبسولة</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="image-style">صور المنتجات</Label>
                        <Select 
                          value={themeSettings.image_style || 'rounded'} 
                          onValueChange={(value) => handleLayoutChange('image_style', value)}
                        >
                          <SelectTrigger id="image-style">
                            <SelectValue placeholder="اختر نمط الصور" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="squared">مربع</SelectItem>
                            <SelectItem value="rounded">حواف دائرية</SelectItem>
                            <SelectItem value="circle">دائرية</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">الرأس والتذييل</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="header-style">نمط الرأس</Label>
                        <Select 
                          value={themeSettings.header_style || 'standard'} 
                          onValueChange={(value) => handleLayoutChange('header_style', value)}
                        >
                          <SelectTrigger id="header-style">
                            <SelectValue placeholder="اختر نمط الرأس" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minimal">مبسط</SelectItem>
                            <SelectItem value="standard">قياسي</SelectItem>
                            <SelectItem value="centered">مركزي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="footer-style">نمط التذييل</Label>
                        <Select 
                          value={themeSettings.footer_style || 'standard'} 
                          onValueChange={(value) => handleLayoutChange('footer_style', value)}
                        >
                          <SelectTrigger id="footer-style">
                            <SelectValue placeholder="اختر نمط التذييل" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minimal">مبسط</SelectItem>
                            <SelectItem value="standard">قياسي</SelectItem>
                            <SelectItem value="expanded">موسع</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings} 
                  disabled={saveSettingsMutation.isPending} 
                  className="flex items-center gap-2"
                >
                  {saveSettingsMutation.isPending ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                  {saveSettingsMutation.isPending ? null : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p>يرجى اختيار تصميم أولاً من قسم "تصاميم المتجر"</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreThemes;
