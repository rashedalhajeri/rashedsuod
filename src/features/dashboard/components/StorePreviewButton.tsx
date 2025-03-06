
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Copy, CheckCheck, X, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import useStoreData from '@/hooks/use-store-data';

const StorePreviewButton = () => {
  const { data: storeData } = useStoreData();
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  // Create store URL based on domain
  const storeUrl = storeData?.domain_name 
    ? `https://${storeData.domain_name}.linok.me` 
    : null;
  
  const handleCopyLink = () => {
    if (storeUrl) {
      navigator.clipboard.writeText(storeUrl);
      toast.success("تم نسخ رابط المتجر");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("عذراً، لا يمكن نسخ الرابط حالياً");
    }
  };
  
  const openStorePreview = () => {
    if (storeUrl) {
      setPreviewOpen(true);
    } else {
      toast.error("عذراً، لا يمكن مشاهدة المتجر حالياً");
    }
  };
  
  const openExternalLink = () => {
    if (storeUrl) {
      window.open(storeUrl, '_blank');
    } else {
      toast.error("عذراً، لا يمكن فتح المتجر حالياً");
    }
  };
  
  if (!storeData || !storeUrl) {
    return null;
  }
  
  return (
    <>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary-200 hover:bg-primary-50"
                onClick={handleCopyLink}
              >
                {copied ? <CheckCheck className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                <span>نسخ الرابط</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>نسخ رابط المتجر</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary-200 hover:bg-primary-50"
                onClick={openStorePreview}
              >
                <Eye className="h-4 w-4" />
                <span>مشاهدة متجري</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>مشاهدة المتجر داخل لوحة التحكم</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-2 border-primary-200 hover:bg-primary-50"
                onClick={openExternalLink}
              >
                <ExternalLink className="h-4 w-4" />
                <span>فتح المتجر</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>فتح المتجر في نافذة جديدة</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl h-[80vh] p-0">
          <DialogHeader className="p-4 bg-gray-50 border-b flex flex-row items-center justify-between">
            <DialogTitle>مشاهدة متجري</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setPreviewOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="w-full h-full overflow-hidden">
            <iframe 
              src={storeUrl} 
              title="مشاهدة متجري"
              className="w-full h-full border-0"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StorePreviewButton;
