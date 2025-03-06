
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeSettings } from '../../../types/theme-types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Square, Circle, PanelTop, PanelBottom } from 'lucide-react';

interface ElementStylesCardProps {
  themeSettings: ThemeSettings;
  onLayoutChange: (key: string, value: any) => void;
}

const ElementStylesCard: React.FC<ElementStylesCardProps> = ({
  themeSettings,
  onLayoutChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">أنماط العناصر</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-xs">تخصيص شكل الأزرار وصور المنتجات في متجرك</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="button-style">أزرار</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs">اختر شكل الأزرار في متجرك - مربع: حواف مستقيمة، دائرية: حواف منحنية قليلاً، كبسولة: حواف منحنية بشكل كامل</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select 
                value={themeSettings.button_style || 'rounded'} 
                onValueChange={(value) => onLayoutChange('button_style', value)}
              >
                <SelectTrigger id="button-style">
                  <SelectValue placeholder="اختر نمط الأزرار" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="squared">
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      <span>مربع</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border rounded-md flex items-center justify-center">
                        <div className="w-2 h-2 bg-current rounded-sm"></div>
                      </div>
                      <span>حواف دائرية</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pill">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border rounded-full"></div>
                      <span>كبسولة</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="image-style">صور المنتجات</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs">اختر شكل صور المنتجات - مربع: بدون حواف، دائرية: حواف منحنية، دائرة: صورة دائرية بالكامل</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select 
                value={themeSettings.image_style || 'rounded'} 
                onValueChange={(value) => onLayoutChange('image_style', value)}
              >
                <SelectTrigger id="image-style">
                  <SelectValue placeholder="اختر نمط الصور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="squared">
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      <span>مربع</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="rounded">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border rounded-md"></div>
                      <span>حواف دائرية</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="circle">
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4" />
                      <span>دائرية</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">الرأس والتذييل</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="max-w-xs">تخصيص شكل رأس وتذييل متجرك</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="header-style">نمط الرأس</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs">مبسط: رأس بسيط وصغير، قياسي: رأس عادي، مركزي: شعار وعناصر التنقل في المنتصف</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select 
                value={themeSettings.header_style || 'standard'} 
                onValueChange={(value) => onLayoutChange('header_style', value)}
              >
                <SelectTrigger id="header-style">
                  <SelectValue placeholder="اختر نمط الرأس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">
                    <div className="flex items-center gap-2">
                      <PanelTop className="h-4 w-4" />
                      <span>مبسط</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="standard">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-t-2 border-current"></div>
                      <span>قياسي</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="centered">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex flex-col items-center">
                        <div className="w-2 h-2 bg-current rounded-full"></div>
                        <div className="w-4 h-0.5 bg-current mt-0.5"></div>
                      </div>
                      <span>مركزي</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Label htmlFor="footer-style">نمط التذييل</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs">مبسط: تذييل صغير وبسيط، قياسي: تذييل عادي، موسع: تذييل كبير يحتوي على معلومات إضافية</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Select 
                value={themeSettings.footer_style || 'standard'} 
                onValueChange={(value) => onLayoutChange('footer_style', value)}
              >
                <SelectTrigger id="footer-style">
                  <SelectValue placeholder="اختر نمط التذييل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-b border-current"></div>
                      <span>مبسط</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="standard">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-b-2 border-current"></div>
                      <span>قياسي</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="expanded">
                    <div className="flex items-center gap-2">
                      <PanelBottom className="h-4 w-4" />
                      <span>موسع</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ElementStylesCard;
