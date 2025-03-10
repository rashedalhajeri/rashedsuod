
import React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";
import { SectionType } from "./types";

interface SectionTypeItemProps {
  type: SectionType;
  isSelected: boolean;
  onClick: () => void;
}

const SectionTypeItem: React.FC<SectionTypeItemProps> = ({
  type,
  isSelected,
  onClick
}) => {
  // Get dynamic color classes based on the type
  const getColorClasses = (colorName: string) => {
    const colorMap: Record<string, { bg: string, text: string, border: string }> = {
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600", border: "border-emerald-300" },
      blue: { bg: "bg-blue-100", text: "text-blue-600", border: "border-blue-300" },
      amber: { bg: "bg-amber-100", text: "text-amber-600", border: "border-amber-300" },
      rose: { bg: "bg-rose-100", text: "text-rose-600", border: "border-rose-300" },
      purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-300" },
      indigo: { bg: "bg-indigo-100", text: "text-indigo-600", border: "border-indigo-300" }
    };
    
    return colorMap[colorName] || { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-300" };
  };
  
  const colors = getColorClasses(type.color);

  return (
    <div
      onClick={onClick}
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all hover:border-gray-400 relative",
        isSelected 
          ? `${colors.bg} ${colors.border} shadow-sm` 
          : "hover:shadow-sm"
      )}
      dir="rtl"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`${colors.bg} p-1.5 rounded-full ${colors.text}`}>
          {type.icon}
        </div>
        <span className="font-medium text-base">{type.name}</span>
        {isSelected && (
          <div className="absolute top-2 left-2 bg-primary text-white rounded-full p-0.5">
            <CheckIcon className="h-3.5 w-3.5" />
          </div>
        )}
      </div>
      <p className="text-xs text-gray-600 mt-1">
        {type.description}
      </p>
    </div>
  );
};

export default SectionTypeItem;
