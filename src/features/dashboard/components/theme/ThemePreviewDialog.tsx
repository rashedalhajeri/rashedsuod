
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import ThemePreview from '../ThemePreview';
import { Button } from "@/components/ui/button";
import { ThemeOption, ThemeSettings } from '../../types/theme-types';
import { ChevronLeft, ChevronRight, Monitor, Smartphone, Tablet } from 'lucide-react';
import { Toggle } from "@/components/ui/toggle";

interface ThemePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme: ThemeOption | null;
  themeSettings: ThemeSettings | null;
}

const ThemePreviewDialog: React.FC<ThemePreviewDialogProps> = ({
  open,
  onOpenChange,
  theme,
  themeSettings
}) => {
  const [previewDevice, setPreviewDevice] = React.useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [currentPage, setCurrentPage] = React.useState<'home' | 'product' | 'category'>('home');

  if (!theme) return null;
  
  const getPreviewWidth = () => {
    switch (previewDevice) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      case 'desktop': return 'max-w-[1200px]';
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${getPreviewWidth()} h-[85vh]`}>
        <DialogHeader>
          <DialogTitle>معاينة التصميم: {theme.name}</DialogTitle>
          <DialogDescription>
            نظرة مبدئية على كيفية ظهور متجرك باستخدام هذا التصميم
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-between mb-2 p-2 bg-muted rounded-md">
          <div className="flex space-x-1">
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
          
          <div>
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
        </div>
        
        <div className="h-full overflow-auto rounded-md border">
          <ThemePreview 
            theme={theme} 
            themeSettings={themeSettings} 
            page={currentPage}
            device={previewDevice}
          />
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              إغلاق
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const pages: ('home' | 'product' | 'category')[] = ['home', 'product', 'category'];
                const currentIndex = pages.indexOf(currentPage);
                const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
                setCurrentPage(pages[prevIndex]);
              }}
            >
              <ChevronRight className="h-4 w-4 ml-1" />
              السابق
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const pages: ('home' | 'product' | 'category')[] = ['home', 'product', 'category'];
                const currentIndex = pages.indexOf(currentPage);
                const nextIndex = (currentIndex + 1) % pages.length;
                setCurrentPage(pages[nextIndex]);
              }}
            >
              التالي
              <ChevronLeft className="h-4 w-4 mr-1" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ThemePreviewDialog;
