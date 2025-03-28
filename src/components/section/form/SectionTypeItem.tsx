
import React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, LockIcon } from "lucide-react";
import { SectionType } from "./types";
import { motion } from "framer-motion";

interface SectionTypeItemProps {
  type: SectionType;
  isSelected: boolean;
  onClick: () => void;
  isDisabled?: boolean;
}

const SectionTypeItem: React.FC<SectionTypeItemProps> = ({
  type,
  isSelected,
  onClick,
  isDisabled = false
}) => {
  // Get dynamic color classes based on the type
  const getColorClasses = (colorName: string) => {
    const colorMap: Record<string, { bg: string, text: string, border: string, lightBg: string }> = {
      emerald: { 
        bg: "bg-emerald-500", 
        text: "text-white", 
        border: "border-emerald-300",
        lightBg: "bg-emerald-50"
      },
      blue: { 
        bg: "bg-blue-500", 
        text: "text-white", 
        border: "border-blue-300",
        lightBg: "bg-blue-50"
      },
      amber: { 
        bg: "bg-amber-500", 
        text: "text-white", 
        border: "border-amber-300",
        lightBg: "bg-amber-50"
      },
      rose: { 
        bg: "bg-rose-500", 
        text: "text-white", 
        border: "border-rose-300",
        lightBg: "bg-rose-50"
      },
      indigo: { 
        bg: "bg-indigo-500", 
        text: "text-white", 
        border: "border-indigo-300",
        lightBg: "bg-indigo-50"
      },
      gray: { 
        bg: "bg-gray-500", 
        text: "text-white", 
        border: "border-gray-300",
        lightBg: "bg-gray-50"
      }
    };
    
    return colorMap[colorName] || { bg: "bg-gray-500", text: "text-white", border: "border-gray-300", lightBg: "bg-gray-50" };
  };
  
  const colors = getColorClasses(type.color);

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      onClick={isDisabled ? undefined : onClick}
      className={cn(
        "border rounded-lg p-4 relative",
        isDisabled 
          ? "opacity-60 cursor-not-allowed border-gray-200 bg-gray-50" 
          : "cursor-pointer transition-all hover:border-gray-400 hover:shadow-sm",
        isSelected && !isDisabled
          ? `${colors.lightBg} ${colors.border} shadow-sm` 
          : ""
      )}
      dir="rtl"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`${isDisabled ? 'bg-gray-400' : colors.bg} p-1.5 rounded-full ${colors.text}`}>
          {type.icon}
        </div>
        <span className="font-medium text-base">{type.name}</span>
        {isSelected && !isDisabled && (
          <div className="absolute top-2 left-2 bg-primary text-white rounded-full p-0.5">
            <CheckIcon className="h-3.5 w-3.5" />
          </div>
        )}
        {isDisabled && (
          <div className="absolute top-2 left-2 bg-gray-400 text-white rounded-full p-0.5">
            <LockIcon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <p className="text-xs text-gray-600 mt-1">
        {isDisabled ? "تم إضافة هذا القسم مسبقاً" : type.description}
      </p>
    </motion.div>
  );
};

export default SectionTypeItem;
