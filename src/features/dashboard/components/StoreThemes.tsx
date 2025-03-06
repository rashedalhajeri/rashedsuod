import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Label } from '@/components/ui/label';
import { Check, Palette, PaintBucket, Sparkles, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import SaveButton from '@/components/ui/save-button';
import ThemePreviewCard from './ThemePreviewCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';

interface StoreThemesProps {
  storeId?: string;
}

interface ThemeOption {
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
}

interface ThemeSettings {
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

const themes: ThemeOption[] = [
  {
    id: 'classic',
    name: 'كلاسيكي أنيق',
    description: 'تصميم أنيق وبسيط مع تركيز على عرض المنتجات بشكل جذاب',
    preview: '/themes/classic.jpg',
    isPremium: false,
    colors: {
      primary: '#2B6CB0',
      secondary: '#E2E8F0',
      accent: '#CBD5E0',
    }
  },
  {
    id: 'modern',
    name: 'عصري حديث',
    description: 'تصميم عصري مع ألوان زاهية وتأثيرات حركية بسيطة',
    preview: '/themes/modern.jpg',
    isPremium: false,
    colors: {
      primary: '#805AD5',
      secondary: '#E9D8FD',
      accent: '#D6BCFA',
    }
  },
  {
    id: 'minimal',
    name: 'مينمال بسيط',
    description: 'تصميم بسيط وأنيق مع مساحات بيضاء ومحتوى مركز',
    preview: '/themes/minimal.jpg',
    isPremium: false,
    colors: {
      primary: '#1A202C',
      secondary: '#EDF2F7',
      accent: '#E2E8F0',
    }
  },
  {
    id: 'business',
    name: 'تجاري احترافي',
    description: 'تصميم احترافي يناسب المتاجر الكبيرة والشركات التجارية',
    preview: '/themes/business.jpg',
    isPremium: false,
    colors: {
      primary: '#2D3748',
      secondary: '#EDF2F7',
      accent: '#4299E1',
    }
  },
  {
    id: 'colorful',
    name: 'ملون وحيوي',
    description: 'تصميم نابض بالحياة مع ألوان متعددة تجذب انتباه العملاء',
    preview: 'https://via.placeholder.com/400x300/FF9671/FFFFFF?text=Colorful+Theme',
    isPremium: false,
    colors: {
      primary: '#FF9671',
      secondary: '#FFC75F',
      accent: '#F9F871',
    }
  },
  {
    id: 'elegant',
    name: 'راقي وفاخر',
    description: 'تصميم فاخر يناسب المنتجات الراقية والعلامات التجارية المميزة',
    preview: 'https://via.placeholder.com/400x300/845EC2/FFFFFF?text=Elegant+Theme',
    isPremium: false,
    colors: {
      primary: '#845EC2',
      secondary: '#B39CD0',
      accent: '#FBEAFF',
    }
  },
];

const colorOptions = [
  { name: 'أخضر', value: '#22C55E' },
  { name: 'أزرق', value: '#3B82F6' },
  { name: 'أحمر', value: '#EF4444' },
  { name: 'بنفسجي', value: '#8B5CF6' },
  { name: 'برتقالي', value: '#F59E0B' },
  { name: 'وردي', value: '#EC4899' },
  { name: 'أسود', value: '#0D0D0D' },
  { name: 'رمادي', value: '#71717A' },
  { name: 'أزرق داكن', value: '#1E40AF' },
  { name: 'أحمر داكن', value: '#B91C1C' },
  { name: 'أخضر داكن', value: '#15803D' },
];

const secondaryColorOptions = [
  { name: 'رمادي فاتح', value: '#E2E8F0' },
  { name: 'أزرق فاتح', value: '#DBEAFE' },
  { name: 'أحمر فاتح', value: '#FEE2E2' },
  { name: 'بنفسجي فاتح', value: '#F3E8FF' },
  { name: 'أصفر فاتح', value: '#FEF3C7' },
  { name: 'وردي فاتح', value: '#FCE7F3' },
  { name: 'أخضر فاتح', value: '#DCFCE7' },
  { name: 'برتقالي فاتح', value: '#FFEDD5' },
  { name: 'أبيض', value: '#FFFFFF' },
];

const accentColorOptions = [
  { name: 'رمادي متوسط', value: '#CBD5E0' },
  { name: 'أزرق متوسط', value: '#93C5FD' },
  { name: 'أحمر متوسط', value: '#FCA5A5' },
  { name: 'بنفسجي متوسط', value: '#D8B4FE' },
  { name: 'أصفر متوسط', value: '#FDE68A' },
  { name: 'وردي متوسط', value: '#F9A8D4' },
  { name: 'أخضر متوسط', value: '#86EFAC' },
  { name: 'برتقالي متوسط', value: '#FDBA74' },
];

const fontOptions = [
  { name: 'افتراضي', value: 'default' },
  { name: 'عصري', value: 'modern' },
  { name: 'كلاسيكي', value: 'classic' },
  { name: 'خفيف', value: 'light' },
  { name: 'ثقيل', value: 'bold' },
];

const StoreThemes: React.FC<StoreThemesProps> = ({ storeId }) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('themes');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewTheme, setPreviewTheme] = useState<ThemeOption | null>(null);
  
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
    queryFn: async () => {
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
    },
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
  
  const { mutate: saveThemeSettings, isPending: isSaving } = useMutation({
    mutationFn: async (settings: ThemeSettings) => {
      if (!storeId) {
        throw new Error('لم يتم العثور على معرف المتجر');
      }
      
      if (settings.id) {
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
        return data;
      } else {
        const { data, error } = await supabase
          .from('store_theme_settings')
          .insert([{
            store_id: storeId,
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
        return data;
      }
    },
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
  
  const handlePreviewTheme = (theme: ThemeOption) => {
    setPreviewTheme(theme);
    setPreviewDialogOpen(true);
  };
  
  const handleSaveSettings = async (): Promise<void> => {
    return saveThemeSettings(themeSettings);
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <ThemePreviewCard
                key={theme.id}
                theme={theme}
                selected={themeSettings.theme_id === theme.id}
                onSelect={() => handleSelectTheme(theme.id)}
                onPreview={() => handlePreviewTheme(theme)}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="customize" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تخصيص الألوان</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="primary-color">اللون الرئيسي</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: themeSettings.primary_color }}
                    />
                    <Select 
                      value={themeSettings.primary_color} 
                      onValueChange={(value) => setThemeSettings(prev => ({ ...prev, primary_color: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر اللون الرئيسي" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="secondary-color">اللون الثانوي</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: themeSettings.secondary_color }}
                    />
                    <Select 
                      value={themeSettings.secondary_color} 
                      onValueChange={(value) => setThemeSettings(prev => ({ ...prev, secondary_color: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر اللون الثانوي" />
                      </SelectTrigger>
                      <SelectContent>
                        {secondaryColorOptions.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="accent-color">لون التأكيد</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: themeSettings.accent_color }}
                    />
                    <Select 
                      value={themeSettings.accent_color} 
                      onValueChange={(value) => setThemeSettings(prev => ({ ...prev, accent_color: value }))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر لون التأكيد" />
                      </SelectTrigger>
                      <SelectContent>
                        {accentColorOptions.map(color => (
                          <SelectItem key={color.value} value={color.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full border" 
                                style={{ backgroundColor: color.value }}
                              />
                              <span>{color.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="font-family">الخط</Label>
                  <Select 
                    value={themeSettings.font_family} 
                    onValueChange={(value) => setThemeSettings(prev => ({ ...prev, font_family: value }))}
                  >
                    <SelectTrigger className="w-full">
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
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">التخطيط</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label>عرض المنتجات</Label>
                  <Select 
                    value={themeSettings.layout_type} 
                    onValueChange={(value) => setThemeSettings(prev => ({ ...prev, layout_type: value }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر طريقة عرض المنتجات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">شبكة</SelectItem>
                      <SelectItem value="list">قائمة</SelectItem>
                      <SelectItem value="compact">مدمج</SelectItem>
                      <SelectItem value="cards">بطاقات</SelectItem>
                      <SelectItem value="magazine">مجلة</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>عدد المنتجات في الصف</Label>
                  <Select 
                    value={themeSettings.products_per_row.toString()} 
                    onValueChange={(value) => setThemeSettings(prev => ({ ...prev, products_per_row: parseInt(value) }))}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر عدد المنتجات في الصف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 منتجات</SelectItem>
                      <SelectItem value="3">3 منتجات</SelectItem>
                      <SelectItem value="4">4 منتجات</SelectItem>
                      <SelectItem value="5">5 منتجات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <SaveButton onClick={handleSaveSettings} isSaving={isSaving} />
      
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{previewTheme?.name} - معاينة</DialogTitle>
            <DialogDescription>
              هذه معاينة للتصميم. سيتاح قريباً معاينة مباشرة للمتجر.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 border rounded-md overflow-hidden">
            <img 
              src={previewTheme?.preview || '/themes/classic.jpg'} 
              alt="معاينة التصميم"
              className="w-full h-auto"
            />
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              إغلاق
            </Button>
            <Button 
              onClick={() => {
                if (previewTheme) {
                  handleSelectTheme(previewTheme.id);
                  setPreviewDialogOpen(false);
                }
              }}
            >
              اختيار هذا التصميم
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Card className="mt-4 border-dashed border-primary/30 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <Sparkles className="h-8 w-8 text-primary mb-2" />
            <h3 className="font-semibold text-lg">قريباً - معاينة مباشرة للمتجر</h3>
            <p className="text-muted-foreground text-sm">
              سيتم إضافة ميزة المعاينة المباشرة لمشاهدة تأثير التغييرات على متجرك بشكل فوري
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreThemes;
