
import React from "react";
import { Trash, Copy, Tag, Check, X, Download, UploadCloud, Loader2 } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductBulkActionsProps {
  selectedProducts: string[];
  onDeleteSelected: () => Promise<void>;
  onDuplicateSelected: () => Promise<void>;
  onCategoryChange: (categoryId: string) => Promise<void>;
  onClearSelection: () => void;
  categories: { id: string; name: string }[];
  isLoading: boolean;
}

export const ProductBulkActions: React.FC<ProductBulkActionsProps> = ({
  selectedProducts,
  onDeleteSelected,
  onDuplicateSelected,
  onCategoryChange,
  onClearSelection,
  categories,
  isLoading
}) => {
  if (selectedProducts.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-3 mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <span className="font-medium text-sm ml-2">
          تم تحديد {selectedProducts.length} منتج
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearSelection}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 ml-1" />
          إلغاء التحديد
        </Button>
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isLoading}>
              <Tag className="h-4 w-4 ml-2" /> 
              تعيين التصنيف
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {categories.map(category => (
              <DropdownMenuItem 
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDuplicateSelected}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Copy className="h-4 w-4 ml-2" />
          )}
          نسخ
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={onDeleteSelected}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Trash className="h-4 w-4 ml-2" />
          )}
          حذف
        </Button>
      </div>
    </div>
  );
};
