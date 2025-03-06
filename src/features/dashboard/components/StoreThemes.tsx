
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Label } from '@/components/ui/label';
import { Check, Palette, PaintBucket, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import SaveButton from '@/components/ui/save-button';
import ThemePreviewCard from './ThemePreviewCard';

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
    isPremium: false, // Changed from true to false to make it available for free
    colors: {
      primary: '#2D3748',
      secondary: '#EDF2F7',
      accent: '#4299E1',
    }
  },
];

const StoreThemes: React.FC<StoreThemesProps> = ({ storeId }) => {
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = useState<string>('classic');
  const [primaryColor, setPrimaryColor] = useState<string>('#22C55E');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('themes');

  const saveThemeSettings = async () => {
    if (!storeId) {
      toast({
        title: "خطأ",
        description: "لم يتم العثور على معرف المتجر",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Here you would save the theme settings to the database
      // For now we'll just simulate a success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات التصميم بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
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
                selected={selectedTheme === theme.id}
                onSelect={() => setSelectedTheme(theme.id)}
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
                      style={{ backgroundColor: primaryColor }}
                    />
                    <Select defaultValue={primaryColor} onValueChange={setPrimaryColor}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر اللون الرئيسي" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="#22C55E">أخضر (الافتراضي)</SelectItem>
                        <SelectItem value="#3B82F6">أزرق</SelectItem>
                        <SelectItem value="#EF4444">أحمر</SelectItem>
                        <SelectItem value="#8B5CF6">بنفسجي</SelectItem>
                        <SelectItem value="#F59E0B">برتقالي</SelectItem>
                        <SelectItem value="#EC4899">وردي</SelectItem>
                        <SelectItem value="#0D0D0D">أسود</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="secondary-color">اللون الثانوي</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: '#E2E8F0' }}
                    />
                    <Select defaultValue="#E2E8F0">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر اللون الثانوي" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="#E2E8F0">رمادي فاتح (الافتراضي)</SelectItem>
                        <SelectItem value="#DBEAFE">أزرق فاتح</SelectItem>
                        <SelectItem value="#FEE2E2">أحمر فاتح</SelectItem>
                        <SelectItem value="#F3E8FF">بنفسجي فاتح</SelectItem>
                        <SelectItem value="#FEF3C7">أصفر فاتح</SelectItem>
                        <SelectItem value="#FCE7F3">وردي فاتح</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="accent-color">لون التأكيد</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-10 h-10 rounded-md border"
                      style={{ backgroundColor: '#CBD5E0' }}
                    />
                    <Select defaultValue="#CBD5E0">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="اختر لون التأكيد" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="#CBD5E0">رمادي متوسط (الافتراضي)</SelectItem>
                        <SelectItem value="#93C5FD">أزرق متوسط</SelectItem>
                        <SelectItem value="#FCA5A5">أحمر متوسط</SelectItem>
                        <SelectItem value="#D8B4FE">بنفسجي متوسط</SelectItem>
                        <SelectItem value="#FDE68A">أصفر متوسط</SelectItem>
                        <SelectItem value="#F9A8D4">وردي متوسط</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border p-4 rounded-md bg-gray-50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Sparkles className="h-4 w-4" />
                    <span>متوفر المزيد من خيارات التخصيص قريباً</span>
                  </div>
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
                  <Select defaultValue="grid">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر طريقة عرض المنتجات" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">شبكة</SelectItem>
                      <SelectItem value="list">قائمة</SelectItem>
                      <SelectItem value="compact">مدمج</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label>عدد المنتجات في الصف</Label>
                  <Select defaultValue="3">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="اختر عدد المنتجات في الصف" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 منتجات</SelectItem>
                      <SelectItem value="3">3 منتجات</SelectItem>
                      <SelectItem value="4">4 منتجات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <SaveButton onClick={saveThemeSettings} isSaving={isSaving} />
      
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
