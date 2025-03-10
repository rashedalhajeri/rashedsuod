
import React from "react";
import { cn } from "@/lib/utils";
import { Tag, LayoutGrid, CheckIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

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
      <Label className="text-base font-medium">نوع المحتوى المخصص</Label>
      <p className="text-sm text-gray-500">اختر طريقة عرض المحتوى المخصص</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "border rounded-md p-4 cursor-pointer",
            customType === 'category' 
              ? "bg-purple-50 border-purple-300 shadow-sm" 
              : "hover:border-gray-400 hover:shadow-sm"
          )}
          onClick={() => onCustomTypeChange('category')}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-purple-100 p-1.5 rounded-full text-purple-500">
              <Tag className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <span className="font-medium">فئة محددة</span>
              <p className="text-xs text-gray-600 mt-1">عرض جميع منتجات فئة معينة</p>
            </div>
            {customType === 'category' && (
              <div className="bg-primary text-white rounded-full p-0.5">
                <CheckIcon className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "border rounded-md p-4 cursor-pointer",
            customType === 'products' 
              ? "bg-indigo-50 border-indigo-300 shadow-sm" 
              : "hover:border-gray-400 hover:shadow-sm"
          )}
          onClick={() => onCustomTypeChange('products')}
        >
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-indigo-100 p-1.5 rounded-full text-indigo-500">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <span className="font-medium">منتجات مخصصة</span>
              <p className="text-xs text-gray-600 mt-1">اختيار منتجات محددة لعرضها</p>
            </div>
            {customType === 'products' && (
              <div className="bg-primary text-white rounded-full p-0.5">
                <CheckIcon className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomTypeSelector;
