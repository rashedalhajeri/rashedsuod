
import React from 'react';
import { X, ExternalLink, Smartphone, Tablet, Monitor } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaintBucket } from 'lucide-react';

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeUrl: string;
  storeName?: string;
  onExternalLinkClick: () => void;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onOpenChange,
  storeUrl,
  storeName,
  onExternalLinkClick
}) => {
  const [activeTab, setActiveTab] = React.useState("desktop");
  
  const getScreenSize = () => {
    switch(activeTab) {
      case "mobile":
        return "w-[375px] h-[667px]";
      case "tablet":
        return "w-[768px] h-[1024px]";
      case "desktop":
      default:
        return "w-full h-full";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[80vh] p-0">
        <DialogHeader className="p-4 bg-gray-50 border-b">
          <div className="flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-4 w-4" /> مشاهدة متجري
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="w-full grid grid-cols-3 max-w-xs mx-auto">
              <TabsTrigger value="mobile" className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" /> جوال
              </TabsTrigger>
              <TabsTrigger value="tablet" className="flex items-center gap-1">
                <Tablet className="h-3 w-3" /> لوحي
              </TabsTrigger>
              <TabsTrigger value="desktop" className="flex items-center gap-1">
                <Monitor className="h-3 w-3" /> سطح المكتب
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>
        
        <div className="w-full h-full overflow-auto flex justify-center p-4 bg-gray-100">
          <div className={`bg-white overflow-hidden ${getScreenSize()} transition-all duration-300 shadow-lg rounded border`}>
            <iframe 
              src={storeUrl} 
              title="مشاهدة متجري"
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </div>
        
        <DialogFooter className="p-4 border-t bg-gray-50 flex flex-row justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <PaintBucket className="h-3 w-3" /> تخصيص المظهر
            </Badge>
            <span className="text-xs text-muted-foreground">لتغيير مظهر متجرك، انتقل إلى قسم "المظهر" في لوحة التحكم</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              إغلاق
            </Button>
            <Button size="sm" onClick={onExternalLinkClick} className="gap-2">
              <ExternalLink className="h-4 w-4" /> فتح في نافذة جديدة
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Update the Eye component to accept className prop
export const Eye: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props} // This will allow passing className and other SVG props
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export default PreviewDialog;
