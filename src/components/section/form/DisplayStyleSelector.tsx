
import React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { LayoutGrid, List, CheckIcon } from "lucide-react";

interface DisplayStyleSelectorProps {
  displayStyle: 'grid' | 'list';
  setDisplayStyle: (style: 'grid' | 'list') => void;
}

const DisplayStyleSelector: React.FC<DisplayStyleSelectorProps> = ({
  displayStyle,
  setDisplayStyle
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-base font-medium">طريقة عرض المنتجات</Label>
      <p className="text-sm text-gray-500 mb-2">اختر كيفية ظهور المنتجات في هذا القسم</p>
      
      <div className="grid grid-cols-2 gap-3">
        <div
          className={cn(
            "border rounded-md p-4 cursor-pointer flex flex-col items-center transition-all hover:border-primary/40",
            displayStyle === 'grid' 
              ? "bg-primary/5 border-primary shadow-sm" 
              : "hover:shadow-sm"
          )}
          onClick={() => setDisplayStyle('grid')}
        >
          <div className="relative mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <LayoutGrid className="h-7 w-7 text-primary/80" />
            </div>
            {displayStyle === 'grid' && (
              <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5">
                <CheckIcon className="h-3 w-3" />
              </div>
            )}
          </div>
          <span className="font-medium text-sm">عرض شبكي</span>
          <p className="text-xs text-gray-500 text-center mt-1">مناسب لمعظم المنتجات</p>
        </div>
        
        <div
          className={cn(
            "border rounded-md p-4 cursor-pointer flex flex-col items-center transition-all hover:border-primary/40",
            displayStyle === 'list' 
              ? "bg-primary/5 border-primary shadow-sm" 
              : "hover:shadow-sm"
          )}
          onClick={() => setDisplayStyle('list')}
        >
          <div className="relative mb-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <List className="h-7 w-7 text-primary/80" />
            </div>
            {displayStyle === 'list' && (
              <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-0.5">
                <CheckIcon className="h-3 w-3" />
              </div>
            )}
          </div>
          <span className="font-medium text-sm">عرض قائمة</span>
          <p className="text-xs text-gray-500 text-center mt-1">مناسب للمقارنة بين المنتجات</p>
        </div>
      </div>
    </div>
  );
};

export default DisplayStyleSelector;
