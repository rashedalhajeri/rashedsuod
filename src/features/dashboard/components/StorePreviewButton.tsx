
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";
import { openStoreInNewTab } from "@/utils/url-helpers";

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
  const handleClick = () => {
    openStoreInNewTab(storeUrl);
  };

  return (
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
  );
};

export default StorePreviewButton;
