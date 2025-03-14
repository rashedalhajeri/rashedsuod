
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, TagIcon, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import ImageUploadGrid from "@/components/ui/image-upload/ImageUploadGrid";

interface CategoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  newCategory: string;
  setNewCategory: (name: string) => void;
  categoryImage: string | null;
  setCategoryImage: (image: string | null) => void;
  handleAddCategory: () => Promise<void>; // Ensure this is async
  storeId?: string;
  showCategoryImages: boolean;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({
  isOpen,
  onClose,
  newCategory,
  setNewCategory,
  categoryImage,
  setCategoryImage,
  handleAddCategory,
  storeId,
  showCategoryImages,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Reset submitting state when dialog opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isSubmitting || !newCategory.trim()) return;
    
    try {
      setIsSubmitting(true);
      await handleAddCategory();
      onClose(); // Close the dialog after successful submission
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (images: string[]) => {
    setCategoryImage(images.length > 0 ? images[0] : null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-xl bg-background">
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
        
        <div className="py-5 space-y-4">
          <div>
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
          
          {showCategoryImages && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                صورة الفئة (اختياري)
              </label>
              {categoryImage ? (
                <div className="relative h-40 w-full border rounded-md overflow-hidden bg-gray-50">
                  <img 
                    src={categoryImage} 
                    alt="Category" 
                    className="h-full w-full object-contain" 
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6"
                    onClick={() => setCategoryImage(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <ImageUploadGrid
                  images={categoryImage ? [categoryImage] : []}
                  onImagesChange={handleImageChange}
                  maxImages={1}
                  storeId={storeId}
                />
              )}
            </div>
          )}
        </div>
        
        <DialogFooter className="pt-3 border-t flex justify-between gap-3">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            إلغاء
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!newCategory.trim() || isSubmitting}
            className="gap-2 w-full sm:w-auto bg-primary hover:bg-primary/90"
          >
            {isSubmitting ? (
              <span>جاري الإضافة...</span>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>إضافة الفئة</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
