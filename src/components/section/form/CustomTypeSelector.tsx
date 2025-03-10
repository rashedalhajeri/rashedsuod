
import React from "react";
import { cn } from "@/lib/utils";
import { Tag, LayoutGrid, CheckIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

interface CustomTypeSelectorProps {
  customType: string;
  onCustomTypeChange: (type: string) => void;
}

const CustomTypeSelector: React.FC<CustomTypeSelectorProps> = ({
  customType,
  onCustomTypeChange
}) => {
  return (
    <div className="mt-4 space-y-4">
      <Label>نوع المحتوى المخصص</Label>
      <div className="grid grid-cols-2 gap-3">
        <div
          className={cn(
            "border rounded-md p-3 cursor-pointer flex items-center gap-2",
            customType === 'category' 
              ? "bg-purple-50 border-purple-300" 
              : "hover:border-gray-400"
          )}
          onClick={() => onCustomTypeChange('category')}
        >
          <Tag className="h-5 w-5 text-purple-500" />
          <span>فئة محددة</span>
          {customType === 'category' && (
            <CheckIcon className="h-4 w-4 text-primary ml-auto" />
          )}
        </div>
        <div
          className={cn(
            "border rounded-md p-3 cursor-pointer flex items-center gap-2",
            customType === 'products' 
              ? "bg-indigo-50 border-indigo-300" 
              : "hover:border-gray-400"
          )}
          onClick={() => onCustomTypeChange('products')}
        >
          <LayoutGrid className="h-5 w-5 text-indigo-500" />
          <span>منتجات مخصصة</span>
          {customType === 'products' && (
            <CheckIcon className="h-4 w-4 text-primary ml-auto" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomTypeSelector;
