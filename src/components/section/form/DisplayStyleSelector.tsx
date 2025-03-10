
import React from "react";
import { Label } from "@/components/ui/label";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <Label className="text-base font-medium">طريقة العرض</Label>
      <p className="text-sm text-gray-500 mb-2">اختر طريقة عرض المنتجات في هذا القسم</p>
      
      <div className="flex gap-3">
        <div
          onClick={() => setDisplayStyle('grid')}
          className={cn(
            "flex-1 border rounded-md p-3 cursor-pointer transition-all duration-200",
            displayStyle === 'grid'
              ? "bg-primary/5 border-primary text-primary"
              : "bg-white hover:bg-gray-50 text-gray-600"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <LayoutGrid className={cn(
              "h-6 w-6",
              displayStyle === 'grid' ? "text-primary" : "text-gray-500"
            )} />
            <span className="text-sm font-medium">شبكة</span>
          </div>
        </div>
        
        <div
          onClick={() => setDisplayStyle('list')}
          className={cn(
            "flex-1 border rounded-md p-3 cursor-pointer transition-all duration-200",
            displayStyle === 'list'
              ? "bg-primary/5 border-primary text-primary"
              : "bg-white hover:bg-gray-50 text-gray-600"
          )}
        >
          <div className="flex flex-col items-center gap-2">
            <List className={cn(
              "h-6 w-6",
              displayStyle === 'list' ? "text-primary" : "text-gray-500"
            )} />
            <span className="text-sm font-medium">قائمة</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayStyleSelector;
