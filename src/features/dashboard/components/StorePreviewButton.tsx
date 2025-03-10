
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import { openStoreInNewTab, getFullStoreUrl } from "@/utils/url-helpers";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StorePreviewButtonProps {
  storeUrl?: string;
  className?: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  showExternalIcon?: boolean;
}

const StorePreviewButton: React.FC<StorePreviewButtonProps> = ({ 
  storeUrl, 
  className, 
  variant = "default", 
  size = "sm",
  showExternalIcon = false 
}) => {
  const [showLink, setShowLink] = useState(false);
  
  const handleClick = () => {
    setShowLink(true);
    setTimeout(() => setShowLink(false), 3000);
    openStoreInNewTab(storeUrl);
  };

  const displayUrl = storeUrl ? getFullStoreUrl(storeUrl) : 'رابط المتجر غير متوفر';

  return (
    <div className="inline-block">
      <TooltipProvider>
        <Tooltip open={showLink}>
          <TooltipTrigger asChild>
            <Button 
              size={size} 
              className={`flex items-center gap-1.5 ${className || ''}`}
              variant={variant}
              onClick={handleClick}
              disabled={!storeUrl}
            >
              {showExternalIcon ? (
                <ExternalLink className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              معاينة المتجر
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-black/80 text-white px-3 py-2 border-none rounded-md text-xs">
            <p dir="ltr" className="max-w-[200px] break-words">{displayUrl}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {showLink && (
        <div className="mt-1.5 bg-muted/40 text-muted-foreground text-[10px] py-1 px-2 rounded-sm overflow-hidden text-ellipsis dir-ltr max-w-[180px] whitespace-nowrap">
          {displayUrl}
        </div>
      )}
    </div>
  );
};

export default StorePreviewButton;
