
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
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

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
      <DialogContent className="sm:max-w-[425px] p-6 rounded-xl">
        <DialogHeader className="pb-4 border-b">
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <div className="p-2 rounded-full bg-primary/10">
              <TagIcon className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl">إضافة فئة جديدة</DialogTitle>
          </motion.div>
          <DialogDescription className="mt-2 text-muted-foreground">
            أضف فئات جديدة لتنظيم منتجاتك وتسهيل تصفحها للعملاء.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-5">
          <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-2">
            اسم الفئة
          </label>
          <Input
            id="category-name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="اسم الفئة الجديدة..."
            className="w-full"
            autoFocus
          />
        </div>
        
        <DialogFooter className="pt-3 border-t flex justify-between gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!newCategory.trim()}
            className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة الفئة</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
