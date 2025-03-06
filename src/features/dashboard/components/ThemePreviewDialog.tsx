
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ThemeOption } from '../types/theme-types';

interface ThemePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewTheme: ThemeOption | null;
  onSelectTheme: (themeId: string) => void;
}

const ThemePreviewDialog: React.FC<ThemePreviewDialogProps> = ({
  open,
  onOpenChange,
  previewTheme,
  onSelectTheme
}) => {
  if (!previewTheme) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{previewTheme.name} - معاينة</DialogTitle>
          <DialogDescription>
            هذه معاينة للتصميم. سيتاح قريباً معاينة مباشرة للمتجر.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 border rounded-md overflow-hidden">
          <img 
            src={previewTheme.preview || '/themes/classic.jpg'} 
            alt="معاينة التصميم"
            className="w-full h-auto"
          />
        </div>
        
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            إغلاق
          </Button>
          <Button 
            onClick={() => {
              onSelectTheme(previewTheme.id);
              onOpenChange(false);
            }}
          >
            اختيار هذا التصميم
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemePreviewDialog;
