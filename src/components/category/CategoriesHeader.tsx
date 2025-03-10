
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ImageIcon } from "lucide-react";
import CategorySearchBox from "./CategorySearchBox";

interface CategoriesHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showCategoryImages: boolean;
  onAddCategory: () => void;
  onToggleImages: () => void;
}

const CategoriesHeader: React.FC<CategoriesHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  showCategoryImages,
  onAddCategory,
  onToggleImages,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="w-full md:w-1/2">
        <CategorySearchBox 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="gap-2"
          onClick={onToggleImages}
        >
          <ImageIcon className="h-4 w-4" />
          <span>{showCategoryImages ? "إيقاف صور الفئات" : "تفعيل صور الفئات"}</span>
        </Button>
        <Button
          onClick={onAddCategory}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة فئة</span>
        </Button>
      </div>
    </div>
  );
};

export default CategoriesHeader;
