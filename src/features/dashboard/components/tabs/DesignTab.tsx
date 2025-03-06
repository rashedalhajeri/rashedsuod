
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PaintBucket, Layout, Image, Palette, Type, LayoutTemplate } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StoreThemes from "@/features/dashboard/components/StoreThemes";
import LogoUploader from "@/features/dashboard/components/LogoUploader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchThemeSettings, saveThemeSettings } from "@/features/dashboard/services/theme-service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ThemePreviewDialog from "../../components/theme/ThemePreviewDialog";
import { themes } from "../../data/theme-data";
import ThemeCustomizationOptions from "../../components/theme/ThemeCustomizationOptions";

interface DesignTabProps {
  storeId?: string;
}

const DesignTab: React.FC<DesignTabProps> = ({ storeId }) => {
  const [activeTab, setActiveTab] = useState("themes");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const queryClient = useQueryClient();

  // Fetch current theme settings
  const { data: themeSettings, isLoading } = useQuery({
    queryKey: ['themeSettings', storeId],
    queryFn: () => fetchThemeSettings(storeId || ''),
    enabled: !!storeId,
  });

  const selectedTheme = themeSettings 
    ? themes.find(theme => theme.id === themeSettings.theme_id) 
    : null;

  // Handle logo update
  const handleLogoUpdate = (url: string | null) => {
    setLogoUrl(url);
    // In a real app, you would save this to your database
    toast.success('تم تحديث شعار المتجر بنجاح');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">تصميم المتجر</h2>
          <p className="text-muted-foreground">خصص مظهر متجرك ليعكس هويتك التجارية</p>
        </div>
        <Button 
          onClick={() => setShowPreview(true)} 
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          معاينة المتجر
        </Button>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 h-auto p-1">
          <TabsTrigger value="themes" className="flex flex-col items-center gap-1 py-3 px-4">
            <Palette className="h-4 w-4" />
            <span className="text-xs">التصميم</span>
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex flex-col items-center gap-1 py-3 px-4">
            <PaintBucket className="h-4 w-4" />
            <span className="text-xs">التخصيص</span>
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex flex-col items-center gap-1 py-3 px-4">
            <Image className="h-4 w-4" />
            <span className="text-xs">الشعار</span>
          </TabsTrigger>
          <TabsTrigger value="layout" className="flex flex-col items-center gap-1 py-3 px-4">
            <LayoutTemplate className="h-4 w-4" />
            <span className="text-xs">الأقسام</span>
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex flex-col items-center gap-1 py-3 px-4">
            <Type className="h-4 w-4" />
            <span className="text-xs">الخطوط</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>اختر تصميم متجرك</CardTitle>
              <CardDescription>
                اختر من بين مجموعة متنوعة من التصاميم الاحترافية لمتجرك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StoreThemes storeId={storeId} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customize" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>تخصيص التصميم</CardTitle>
              <CardDescription>
                تخصيص الألوان والتباعد والعناصر البصرية الأخرى
              </CardDescription>
            </CardHeader>
            <CardContent>
              {themeSettings && (
                <ThemeCustomizationOptions 
                  isLoading={isLoading}
                  themeSettings={themeSettings}
                  onFontChange={(font) => {}}
                  onLayoutChange={(key, value) => {}}
                  onSaveSettings={() => {}}
                  isSaving={false}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logo" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>شعار المتجر</CardTitle>
              <CardDescription>
                قم بتحميل أو تعديل شعار متجرك. يظهر الشعار في الصفحة الرئيسية والفواتير ورسائل البريد الإلكتروني.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center sm:flex-row sm:items-start gap-8">
                <div className="text-center sm:text-right">
                  <h3 className="text-lg font-medium mb-2">شعار المتجر</h3>
                  <p className="text-sm text-gray-500 mb-4 max-w-md">
                    يظهر على صفحات المتجر والفواتير ورسائل البريد الإلكتروني. يفضل استخدام صورة بخلفية شفافة بصيغة PNG.
                  </p>
                  <div className="flex justify-center sm:justify-start">
                    <LogoUploader 
                      logoUrl={logoUrl} 
                      onLogoUpdate={handleLogoUpdate} 
                      storeId={storeId} 
                    />
                  </div>
                </div>
                <div className="border-t sm:border-t-0 sm:border-r pt-6 sm:pt-0 sm:pr-6 max-w-md w-full">
                  <h3 className="text-lg font-medium mb-2">نصائح لشعار احترافي</h3>
                  <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside rtl:pr-4">
                    <li>استخدم صورة عالية الجودة (300 DPI على الأقل)</li>
                    <li>اختر صيغة PNG مع خلفية شفافة للحصول على أفضل نتيجة</li>
                    <li>الحجم المثالي للشعار هو 400×400 بكسل</li>
                    <li>تأكد من أن الشعار يبدو جيدًا على خلفيات مختلفة</li>
                    <li>استخدم ألوانًا متناسقة مع باقي تصميم متجرك</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>أقسام الصفحة</CardTitle>
              <CardDescription>
                قم بإدارة الأقسام التي تظهر في صفحة المتجر الرئيسية وترتيبها
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">البانر الرئيسي</h3>
                  <div className="border rounded-md p-4 bg-gray-50 relative">
                    <div className="aspect-[3/1] bg-gray-200 rounded flex items-center justify-center">
                      <Image className="h-12 w-12 text-gray-400" />
                    </div>
                    <div className="absolute top-2 right-2 bg-white rounded-md p-1 shadow-sm">
                      <Button size="sm" variant="ghost" className="h-7 text-xs">تعديل</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">الفئات المميزة</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">المنتجات المميزة</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="border rounded-md p-2 bg-white">
                        <div className="aspect-square bg-gray-100 rounded mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded mb-1"></div>
                        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium">معلومات المتجر</h3>
                  <div className="border rounded-md p-4 bg-gray-50">
                    <div className="h-5 bg-gray-200 rounded w-1/4 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>الخطوط والنصوص</CardTitle>
              <CardDescription>
                اختر الخطوط وأحجامها لعناصر المتجر المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">الخط الرئيسي</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {['Tajawal', 'Cairo', 'Almarai', 'Rubik', 'Poppins'].map(font => (
                      <div key={font} className="border rounded-md p-3 hover:border-primary cursor-pointer">
                        <p className="text-lg mb-1" style={{ fontFamily: font }}>{font}</p>
                        <p className="text-sm text-gray-500" style={{ fontFamily: font }}>
                          أبجد هوز حطي كلمن سعفص قرشت ثخذ ضظغ
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">حجم الخط</h3>
                  <div className="space-y-3">
                    <div className="border rounded-md p-3">
                      <p className="text-2xl font-bold mb-1">العناوين الرئيسية</p>
                      <p className="text-gray-500 text-sm">حجم كبير للعناوين البارزة</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-xl font-semibold mb-1">العناوين الفرعية</p>
                      <p className="text-gray-500 text-sm">حجم متوسط للعناوين الفرعية</p>
                    </div>
                    <div className="border rounded-md p-3">
                      <p className="text-base mb-1">النص الأساسي</p>
                      <p className="text-gray-500 text-sm">حجم قياسي للنصوص العادية</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {themeSettings && selectedTheme && (
        <ThemePreviewDialog 
          open={showPreview}
          onOpenChange={setShowPreview}
          theme={selectedTheme}
          themeSettings={themeSettings}
        />
      )}
    </div>
  );
};

export default DesignTab;
