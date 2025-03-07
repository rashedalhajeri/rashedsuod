
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, TagIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newCategory: string;
  setNewCategory: (name: string) => void;
  handleAddCategory: () => void;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen,
  onClose,
  newCategory,
  setNewCategory,
  handleAddCategory
}) => {
  const handleSubmit = () => {
    handleAddCategory();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TagIcon className="h-4 w-4 text-primary" />
            إضافة فئة جديدة
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            أضف فئات جديدة لتنظيم منتجاتك وتسهيل تصفحها للعملاء.
          </p>
          <Input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="اسم الفئة الجديدة..."
            className="w-full"
            autoFocus
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!newCategory.trim()}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
