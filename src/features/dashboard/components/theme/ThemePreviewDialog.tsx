
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ThemePreview from '../ThemePreview';
import { ThemeOption, ThemeSettings } from '../../types/theme-types';

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
  if (!theme) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>معاينة التصميم: {theme.name}</DialogTitle>
          <DialogDescription>
            نظرة مبدئية على كيفية ظهور متجرك باستخدام هذا التصميم
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-hidden">
          <ThemePreview theme={theme} themeSettings={themeSettings} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemePreviewDialog;
