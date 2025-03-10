
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface StorePreviewButtonProps {
  storeUrl?: string;
}

const StorePreviewButton: React.FC<StorePreviewButtonProps> = ({ storeUrl }) => {
  const handleClick = () => {
    if (storeUrl) {
      window.open(storeUrl, '_blank');
    }
  };

  return (
    <Button 
      size="sm" 
      className="flex items-center gap-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
      variant="outline"
      onClick={handleClick}
    >
      <Eye className="h-4 w-4" />
      معاينة المتجر
    </Button>
  );
};

export default StorePreviewButton;
