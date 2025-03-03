
import React from "react";
import { 
  Trash, Copy, Tag, X, AlertDialog, AlertDialogAction, 
  AlertDialogCancel, AlertDialogContent, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Category {
  id: string;
  name: string;
}

interface ProductsBulkActionsProps {
  selectedCount: number;
  onDelete: () => Promise<void>;
  onDuplicate: () => Promise<void>;
  onCategoryChange: (categoryId: string) => Promise<void>;
  onClearSelection: () => void;
  categories: Category[];
}

const ProductsBulkActions: React.FC<ProductsBulkActionsProps> = ({
  selectedCount,
  onDelete,
  onDuplicate,
  onCategoryChange,
  onClearSelection,
  categories
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isDuplicating, setIsDuplicating] = React.useState(false);
  const [isChangingCategory, setIsChangingCategory] = React.useState(false);
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleDuplicate = async () => {
    try {
      setIsDuplicating(true);
      await onDuplicate();
    } finally {
      setIsDuplicating(false);
    }
  };
  
  const handleCategoryChange = async (categoryId: string) => {
    try {
      setIsChangingCategory(true);
      await onCategoryChange(categoryId);
    } finally {
      setIsChangingCategory(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-muted/70 border rounded-md p-3 mb-6 flex flex-wrap justify-between items-center gap-y-2"
    >
      <div className="flex items-center">
        <span className="font-medium ml-2">
          تم تحديد {selectedCount} منتج
        </span>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearSelection}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 ml-1" />
          إلغاء التحديد
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isChangingCategory}
              className="text-muted-foreground"
            >
              <Tag className="h-4 w-4 ml-2" />
              تغيير التصنيف
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                disabled={isChangingCategory}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDuplicate}
          disabled={isDuplicating}
          className="text-muted-foreground"
        >
          <Copy className="h-4 w-4 ml-2" />
          نسخ
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-destructive hover:text-destructive"
        >
          <Trash className="h-4 w-4 ml-2" />
          حذف
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductsBulkActions;
