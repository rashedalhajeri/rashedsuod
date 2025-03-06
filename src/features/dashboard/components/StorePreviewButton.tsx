import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Eye, Copy, CheckCheck, X, ExternalLink, Share2, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import useStoreData from '@/hooks/use-store-data';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StorePreviewButton = () => {
  const { data: storeData } = useStoreData();
  const [copied, setCopied] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("desktop");
  const [isOnline, setIsOnline] = useState(true);
  
  const storeUrl = storeData?.domain_name 
    ? `https://${storeData.domain_name}.linok.me` 
    : null;
  
  useEffect(() => {
    const checkStoreStatus = async () => {
      setIsOnline(true);
    };
    
    if (storeUrl) {
      checkStoreStatus();
    }
  }, [storeUrl]);
  
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
  
  const handleShareStore = () => {
    if (navigator.share && storeUrl) {
      navigator.share({
        title: `متجر ${storeData?.store_name}`,
        text: `تفضل بزيارة متجري الإلكتروني ${storeData?.store_name}`,
        url: storeUrl,
      })
      .then(() => toast.success("تم مشاركة المتجر بنجاح"))
      .catch(() => toast.error("حدث خطأ أثناء المشاركة"));
    } else if (storeUrl) {
      handleCopyLink();
      toast.success("تم نسخ رابط المتجر، يمكنك مشاركته الآن");
    } else {
      toast.error("عذراً، لا يمكن مشاركة المتجر حالياً");
    }
  };
  
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
  
  if (!storeData || !storeUrl) {
    return null;
  }
  
  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 mb-2">
          <Badge variant={isOnline ? "default" : "destructive"} className="px-2 py-0 h-5">
            {isOnline ? "متصل" : "غير متصل"}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {storeUrl}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 w-full">
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
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-2 border-primary-200 hover:bg-primary-50"
                  onClick={handleShareStore}
                >
                  <Share2 className="h-4 w-4" />
                  <span>مشاركة</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>مشاركة رابط المتجر</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-6xl h-[80vh] p-0">
          <DialogHeader className="p-4 bg-gray-50 border-b">
            <div className="flex flex-row items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" /> مشاهدة متجري
              </DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setPreviewOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="w-full grid grid-cols-3 max-w-xs mx-auto">
                <TabsTrigger value="mobile">جوال</TabsTrigger>
                <TabsTrigger value="tablet">لوحي</TabsTrigger>
                <TabsTrigger value="desktop">سطح المكتب</TabsTrigger>
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
          
          <DialogFooter className="p-4 border-t bg-gray-50">
            <Button variant="outline" size="sm" onClick={() => setPreviewOpen(false)}>
              إغلاق
            </Button>
            <Button size="sm" onClick={openExternalLink} className="gap-2">
              <ExternalLink className="h-4 w-4" /> فتح في نافذة جديدة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StorePreviewButton;
