
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import useStoreData from "@/hooks/use-store-data";

interface StorePreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const StorePreview: React.FC<StorePreviewProps> = ({ isOpen, onClose }) => {
  const { data: storeData } = useStoreData();
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  
  // Update URL structure
  const previewUrl = storeData?.domain_name 
    ? `/store/${storeData.domain_name}`
    : '/store/demo-store';
  
  const copyToClipboard = () => {
    const fullUrl = window.location.origin + previewUrl;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      toast({
        title: "تم نسخ الرابط",
        description: "تم نسخ رابط المعاينة إلى الحافظة",
      });
      
      setTimeout(() => setCopied(false), 3000);
    });
  };
  
  const openPreview = () => {
    window.open(previewUrl, '_blank');
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">معاينة المتجر</DialogTitle>
          <DialogDescription>
            يمكنك معاينة متجرك كما سيظهر للعملاء من خلال هذا الرابط.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* صورة معاينة للمتجر */}
          <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden relative">
            <iframe 
              src={previewUrl} 
              className="w-full h-full border-0"
              title="معاينة المتجر"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Button onClick={openPreview} className="bg-primary/90 hover:bg-primary">
                <ExternalLink className="h-5 w-5 ml-2" />
                فتح المعاينة
              </Button>
            </div>
          </div>
          
          {/* رابط المعاينة */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="flex-1 bg-muted p-3 rounded-md border">
              <code className="text-sm truncate block" dir="ltr">{window.location.origin + previewUrl}</code>
            </div>
            <Button size="icon" variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button onClick={openPreview}>
              <ExternalLink className="h-4 w-4 ml-1" />
              فتح
            </Button>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-amber-800">
            <p className="text-sm">هذه معاينة فقط. قد لا تعمل بعض الميزات حتى يتم نشر المتجر بشكل رسمي.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StorePreview;
