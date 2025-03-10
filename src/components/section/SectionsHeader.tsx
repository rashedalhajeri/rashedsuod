
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategorySearchBox from "../category/CategorySearchBox";

interface SectionsHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddSection: () => void;
}

const SectionsHeader: React.FC<SectionsHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onAddSection,
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="w-full md:w-1/2">
        <CategorySearchBox 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="ابحث عن قسم..."
        />
      </div>
      <Button
        onClick={onAddSection}
        className="gap-2 bg-primary hover:bg-primary/90"
      >
        <Plus className="h-4 w-4" />
        <span>إضافة قسم</span>
      </Button>
    </div>
  );
};

export default SectionsHeader;
