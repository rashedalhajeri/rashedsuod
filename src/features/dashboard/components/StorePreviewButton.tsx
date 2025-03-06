
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink, Copy, CheckCheck } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import useStoreData from '@/hooks/use-store-data';

const StorePreviewButton = () => {
  const { data: storeData } = useStoreData();
  const [copied, setCopied] = useState(false);
  
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
      window.open(storeUrl, '_blank');
    } else {
      toast.error("عذراً، لا يمكن معاينة المتجر حالياً");
    }
  };
  
  if (!storeData || !storeUrl) {
    return null;
  }
  
  return (
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
              <span>معاينة المتجر</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>معاينة المتجر في نافذة جديدة</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default StorePreviewButton;
