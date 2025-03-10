
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const StorePreviewButton = () => {
  return (
    <Button 
      size="sm" 
      className="flex items-center gap-1 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
      variant="outline"
    >
      <Eye className="h-4 w-4" />
      معاينة المتجر
    </Button>
  );
};

export default StorePreviewButton;
