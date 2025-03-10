
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
    
    // Clean and standardize the URL
    const lowerCaseUrl = storeUrl.trim().toLowerCase();
    
    // Build the full URL, ensuring it starts with "/" for relative paths
    let fullUrl = lowerCaseUrl;
    
    // If it's a relative path not starting with "/"
    if (!lowerCaseUrl.startsWith('http') && !lowerCaseUrl.startsWith('/')) {
      fullUrl = `/${lowerCaseUrl}`;
    }
    
    // Open in a new tab
    window.open(fullUrl, '_blank');
    
    // Log the URL for debugging
    console.log("فتح رابط المتجر:", fullUrl);
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
