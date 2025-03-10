
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Save, X, Tag } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Category } from "@/services/category-service";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";
import { toast } from "@/hooks/use-toast";

interface CategoryItemProps {
  category: Category;
  editingCategory: Category | null;
  setEditingCategory: (category: Category | null) => void;
  handleUpdateCategory: () => void;
  handleDeleteCategory: (id: string) => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  editingCategory,
  setEditingCategory,
  handleUpdateCategory,
  handleDeleteCategory
}) => {
  const hasImage = !!category.image_url;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const handleDeleteClick = async () => {
    try {
      await handleDeleteCategory(category.id);
      toast("تم الحذف بنجاح", {
        description: `تم حذف الفئة "${category.name}" بنجاح`
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast("حدث خطأ", {
        description: "لم يتم حذف الفئة، يرجى المحاولة مرة أخرى",
        style: { backgroundColor: 'red', color: 'white' }
      });
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between p-4 border rounded-xl bg-white hover:shadow-sm transition-all"
    >
      {editingCategory?.id === category.id ? (
        <div className="flex items-center gap-2 flex-1">
          <Input 
            value={editingCategory.name}
            onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
            className="flex-1"
            autoFocus
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="default"
                  onClick={handleUpdateCategory}
                  disabled={!editingCategory.name.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>حفظ التغييرات</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setEditingCategory(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>إلغاء</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      ) : (
        <>
          <div className="flex items-center">
            {hasImage ? (
              <div className="h-10 w-10 mr-3 rounded-lg overflow-hidden flex-shrink-0 border border-gray-100 shadow-sm">
                <img 
                  src={category.image_url || ''} 
                  alt={category.name} 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
            ) : (
              <div className="h-10 w-10 mr-3 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tag className="h-5 w-5 text-primary" />
              </div>
            )}
            <span className="text-lg font-medium">{category.name}</span>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-9 w-9 rounded-lg"
                    onClick={() => setEditingCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>تعديل</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-9 w-9 rounded-lg text-destructive hover:text-white hover:bg-destructive border-destructive/20"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>حذف</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      )}
      
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="تأكيد حذف الفئة"
        description={
          <div className="text-center">
            <p>هل أنت متأكد من رغبتك في حذف الفئة:</p>
            <p className="font-bold mt-1 text-black">{category.name}؟</p>
            <p className="mt-2 text-sm">سيتم حذف جميع المعلومات المرتبطة بهذه الفئة.</p>
          </div>
        }
        onDelete={() => handleDeleteClick()}
        itemName={category.name}
        itemType="فئة"
      />
    </motion.div>
  );
};

export default CategoryItem;
