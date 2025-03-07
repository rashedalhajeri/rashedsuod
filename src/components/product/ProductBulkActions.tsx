
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Upload, Tag } from "lucide-react";

export interface ProductBulkActionsProps {
  selectedCount: number;
  onActionComplete: () => void;
}

export const ProductBulkActions: React.FC<ProductBulkActionsProps> = ({ 
  selectedCount, 
  onActionComplete 
}) => {
  return (
    <div className="flex items-center space-x-2 rtl:space-x-reverse">
      <span className="text-sm text-gray-700 ml-2">
        تم تحديد {selectedCount} منتج
      </span>
      
      <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
        <Trash2 className="h-4 w-4 ml-1" />
        حذف
      </Button>
      
      <Button variant="outline" size="sm">
        <Tag className="h-4 w-4 ml-1" />
        تعديل الفئة
      </Button>
      
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 ml-1" />
        تصدير
      </Button>
    </div>
  );
};
