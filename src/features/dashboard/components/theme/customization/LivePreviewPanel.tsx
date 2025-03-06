
import React from 'react';
import { ThemeSettings } from '../../../types/theme-types';
import ThemePreview from '../../ThemePreview';
import { Card } from "@/components/ui/card";
import { Eye, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

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

  if (!selectedTheme) return null;

  return (
    <Card className="sticky top-24 border shadow-md h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
      <div className="bg-muted p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">معاينة مباشرة</span>
        </div>
        
        <div className="flex space-x-1 rtl:space-x-reverse">
          <Toggle 
            pressed={previewDevice === 'mobile'} 
            onPressedChange={() => setPreviewDevice('mobile')}
            aria-label="عرض الجوال"
            size="sm"
          >
            <Smartphone className="h-4 w-4" />
          </Toggle>
          <Toggle 
            pressed={previewDevice === 'tablet'} 
            onPressedChange={() => setPreviewDevice('tablet')}
            aria-label="عرض اللوحي"
            size="sm"
          >
            <Tablet className="h-4 w-4" />
          </Toggle>
          <Toggle 
            pressed={previewDevice === 'desktop'} 
            onPressedChange={() => setPreviewDevice('desktop')}
            aria-label="عرض سطح المكتب"
            size="sm"
          >
            <Monitor className="h-4 w-4" />
          </Toggle>
        </div>
      </div>
      
      <div className="flex justify-center border-b bg-muted p-1">
        <div className="flex border rounded-md overflow-hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentPage('home')}
            className={`${currentPage === 'home' ? 'bg-secondary' : ''}`}
          >
            الرئيسية
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentPage('product')}
            className={`${currentPage === 'product' ? 'bg-secondary' : ''}`}
          >
            المنتج
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentPage('category')}
            className={`${currentPage === 'category' ? 'bg-secondary' : ''}`}
          >
            التصنيفات
          </Button>
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
