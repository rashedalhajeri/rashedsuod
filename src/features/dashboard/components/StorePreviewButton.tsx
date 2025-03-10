
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface StorePreviewButtonProps {
  storeUrl?: string;
  className?: string;
}

const StorePreviewButton: React.FC<StorePreviewButtonProps> = ({ storeUrl, className }) => {
  const handleClick = () => {
    if (storeUrl) {
      window.open(storeUrl, '_blank');
    }
  };

  return (
    <Button 
      size="sm" 
      className={`flex items-center gap-1.5 ${className}`}
      variant="default"
      onClick={handleClick}
    >
      <Eye className="h-4 w-4" />
      معاينة المتجر
    </Button>
  );
};

export default StorePreviewButton;
