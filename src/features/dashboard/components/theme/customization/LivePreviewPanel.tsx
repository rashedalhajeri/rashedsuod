
import React from 'react';
import { ThemeSettings } from '../../../types/theme-types';
import ThemePreview from '../../ThemePreview';
import { Card } from "@/components/ui/card";
import { Eye, Smartphone, Tablet, Monitor, ExternalLink } from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import useStoreData from '@/hooks/use-store-data';

interface LivePreviewPanelProps {
  themeSettings: ThemeSettings;
  selectedTheme: any;
}

const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  themeSettings,
  selectedTheme
}) => {
  const [previewDevice, setPreviewDevice] = React.useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [currentPage, setCurrentPage] = React.useState<'home' | 'product' | 'category'>('home');
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { storeData } = useStoreData();

  if (!selectedTheme) return null;

  return (
    <Card className="sticky top-24 border shadow-md h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
      <div className="bg-muted p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">معاينة مباشرة</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <span className="sr-only">مساعدة</span>
                  <Eye className="h-3 w-3 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="max-w-xs">عرض مباشر لكيفية ظهور متجرك بعد تطبيق التغييرات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center gap-2">
          {storeData?.domain && (
            <Button 
              size="sm" 
              variant="outline" 
              className="text-xs h-7 px-2"
              onClick={() => window.open(`/store/${storeData.domain}`, '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" /> 
              فتح المتجر
            </Button>
          )}
          
          <div className="flex space-x-1 rtl:space-x-reverse">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle 
                    pressed={previewDevice === 'mobile'} 
                    onPressedChange={() => setPreviewDevice('mobile')}
                    aria-label="عرض الجوال"
                    size="sm"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>معاينة على الهاتف المحمول</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle 
                    pressed={previewDevice === 'tablet'} 
                    onPressedChange={() => setPreviewDevice('tablet')}
                    aria-label="عرض اللوحي"
                    size="sm"
                  >
                    <Tablet className="h-4 w-4" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>معاينة على الجهاز اللوحي</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Toggle 
                    pressed={previewDevice === 'desktop'} 
                    onPressedChange={() => setPreviewDevice('desktop')}
                    aria-label="عرض سطح المكتب"
                    size="sm"
                  >
                    <Monitor className="h-4 w-4" />
                  </Toggle>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>معاينة على سطح المكتب</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center border-b bg-muted p-1">
        <div className="flex border rounded-md overflow-hidden">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentPage('home')}
                  className={`${currentPage === 'home' ? 'bg-secondary' : ''}`}
                >
                  الرئيسية
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>معاينة الصفحة الرئيسية للمتجر</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentPage('product')}
                  className={`${currentPage === 'product' ? 'bg-secondary' : ''}`}
                >
                  المنتج
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>معاينة صفحة تفاصيل المنتج</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setCurrentPage('category')}
                  className={`${currentPage === 'category' ? 'bg-secondary' : ''}`}
                >
                  التصنيفات
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>معاينة صفحة تصنيفات المنتجات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-4 flex justify-center">
        <div className={`
          ${previewDevice === 'mobile' ? 'max-w-[375px]' : ''}
          ${previewDevice === 'tablet' ? 'max-w-[768px]' : ''}
          ${previewDevice === 'desktop' ? 'max-w-full' : ''}
          h-full w-full
        `}>
          <ThemePreview 
            theme={selectedTheme}
            themeSettings={themeSettings}
            page={currentPage}
            device={previewDevice}
          />
        </div>
      </div>
    </Card>
  );
};

export default LivePreviewPanel;
