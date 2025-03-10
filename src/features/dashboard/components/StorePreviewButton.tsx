
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, ExternalLink } from "lucide-react";

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
    if (!storeUrl) return;
    
    // Clean and standardize the URL - always convert to lowercase
    const trimmedUrl = storeUrl.trim().toLowerCase();
    
    // Check if it's a direct URL with /store/ prefix
    if (trimmedUrl.startsWith('/store/')) {
      window.open(trimmedUrl, '_blank');
      console.log("فتح رابط المتجر:", trimmedUrl);
      return;
    }
    
    // Remove 'store/' prefix if it exists in the domain name to prevent double prefixing
    const domainName = trimmedUrl.startsWith('store/') 
      ? trimmedUrl.substring(6) // Remove 'store/' from the beginning
      : trimmedUrl;
    
    // Now create the correct URL
    const storeRoute = `/store/${domainName}`;
    window.open(storeRoute, '_blank');
    
    // Log the URL for debugging
    console.log("فتح رابط المتجر:", storeRoute);
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
