
import React, { useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import useStoreData from "@/hooks/use-store-data";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const StorePreviewButton: React.FC = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { data: storeData } = useStoreData();
  
  const storeDomain = storeData?.domain_name || "demo";
  const storeUrl = `/store/${storeDomain}`;
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1 bg-white shadow-sm hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200"
              onClick={() => setIsPreviewOpen(true)}
            >
              <ExternalLink className="h-4 w-4" />
              معاينة المتجر
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>معاينة متجرك في نافذة جديدة</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[900px] h-[80vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-4 py-2 border-b flex flex-row items-center justify-between">
            <DialogTitle className="text-base">معاينة المتجر</DialogTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsPreviewOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden">
            <iframe 
              src={storeUrl} 
              className="w-full h-full border-0"
              title="Store Preview"
            />
          </div>
          
          <DialogFooter className="px-4 py-2 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => window.open(storeUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              فتح في نافذة جديدة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StorePreviewButton;
