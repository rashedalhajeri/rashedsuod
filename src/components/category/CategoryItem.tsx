
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash, Save, X, Tag, ArrowRight, Image } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Category } from "@/services/category-service";

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
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between p-3 border rounded-lg bg-white hover:shadow-sm transition-all"
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
              <div className="h-8 w-8 mr-2 rounded-md overflow-hidden flex-shrink-0 border border-gray-100">
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
              <Tag className="h-4 w-4 mr-2 text-primary" />
            )}
            <span className="text-lg">{category.name}</span>
          </div>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    className="h-8 w-8"
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
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-white hover:bg-destructive"
                    onClick={() => handleDeleteCategory(category.id)}
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
    </motion.div>
  );
};

export default CategoryItem;
