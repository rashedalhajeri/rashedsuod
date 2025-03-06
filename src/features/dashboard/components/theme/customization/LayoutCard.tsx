
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeSettings } from '../../../types/theme-types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info, Layout, Grid3X3, Grid } from 'lucide-react';

interface LayoutCardProps {
  themeSettings: ThemeSettings;
  onLayoutChange: (key: string, value: any) => void;
}

const LayoutCard: React.FC<LayoutCardProps> = ({
  themeSettings,
  onLayoutChange
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-lg font-medium">تخطيط المنتجات</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">تحكم في كيفية عرض منتجاتك وترتيبها في متجرك</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="layout-type">نوع التخطيط</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="max-w-xs">شبكة: عرض المنتجات في شبكة، قائمة: عرض المنتجات في قائمة، متداخل: عرض المنتجات بأحجام مختلفة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select 
              value={themeSettings.layout_type} 
              onValueChange={(value) => onLayoutChange('layout_type', value)}
            >
              <SelectTrigger id="layout-type">
                <SelectValue placeholder="اختر نوع التخطيط" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">
                  <div className="flex items-center gap-2">
                    <Grid className="h-4 w-4" />
                    <span>شبكة</span>
                  </div>
                </SelectItem>
                <SelectItem value="list">
                  <div className="flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    <span>قائمة</span>
                  </div>
                </SelectItem>
                <SelectItem value="masonry">
                  <div className="flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4" />
                    <span>متداخل</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="products-per-row">عدد المنتجات في الصف</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="max-w-xs">حدد عدد المنتجات التي تظهر في كل صف من صفحة المنتجات</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select 
              value={themeSettings.products_per_row.toString()} 
              onValueChange={(value) => onLayoutChange('products_per_row', parseInt(value))}
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
            <div className="flex items-center gap-2 mb-1">
              <Label htmlFor="spacing">المسافات</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="max-w-xs">تحكم في المسافات بين المنتجات - متراص: مسافات صغيرة، عادي: مسافات متوسطة، واسع: مسافات كبيرة</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Select 
              value={themeSettings.layout_spacing || 'normal'} 
              onValueChange={(value) => onLayoutChange('layout_spacing', value)}
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
  );
};

export default LayoutCard;
