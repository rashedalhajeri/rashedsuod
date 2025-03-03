
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, Tag, X } from 'lucide-react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface Category {
  id: string;
  name: string;
}

interface ProductsBulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onDuplicate: () => void;
  onCategoryChange: (categoryId: string) => void;
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  return (
    <div className="bg-muted/30 border rounded-md p-3 mb-4 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-1 rounded-full">
          {selectedCount} عنصر محدد
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClearSelection}
        >
          <X className="h-4 w-4 ml-1" />
          إلغاء التحديد
        </Button>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <Select onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="تغيير التصنيف" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDuplicate}
        >
          <Copy className="h-4 w-4 ml-1" />
          نسخ
        </Button>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm"
            >
              <Trash2 className="h-4 w-4 ml-1" />
              حذف
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>حذف المنتجات المحددة</AlertDialogTitle>
              <AlertDialogDescription>
                هل أنت متأكد من رغبتك في حذف {selectedCount} منتج؟ لا يمكن التراجع عن هذا الإجراء.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>إلغاء</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                onDelete();
                setIsDeleteDialogOpen(false);
              }}>
                حذف
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ProductsBulkActions;
