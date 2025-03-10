
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
    
    // Remove leading/trailing slashes
    const cleanUrl = trimmedUrl.replace(/^\/+|\/+$/g, '');
    
    // Check if it's a full URL with protocol
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      window.open(cleanUrl, '_blank');
      return;
    }
    
    // Remove store/ prefix if it exists
    const domainName = cleanUrl.replace(/^store\/?/, '');
    
    // Create the correct URL with leading slash
    const storeRoute = `/store/${domainName}`;
    window.open(storeRoute, '_blank');
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
