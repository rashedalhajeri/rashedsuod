
import React from "react";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

interface CategoryItemProps {
  category: any;
  onEdit: () => void;
  onDelete: () => void;
  showImage?: boolean;
}

const CategoryItem: React.FC<CategoryItemProps> = ({
  category,
  onEdit,
  onDelete,
  showImage = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-all bg-white"
    >
      <div className="flex items-center space-x-3 space-x-reverse">
        {showImage && (
          <div className="w-10 h-10 overflow-hidden rounded-md">
            <img
              src={category.image_url || '/placeholder.svg'}
              alt={category.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          </div>
        )}
        <h3 className="font-medium">{category.name}</h3>
      </div>
      
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>تعديل الفئة</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
              >
                <Trash className="h-4 w-4 text-red-500" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>حذف الفئة</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};

export default CategoryItem;
