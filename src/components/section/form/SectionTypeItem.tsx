
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
  return (
    <div
      onClick={onClick}
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all hover:border-gray-400 relative",
        isSelected 
          ? `bg-${type.color}-50 border-${type.color}-300 shadow-sm` 
          : "hover:shadow-sm"
      )}
      dir="rtl"
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={`bg-${type.color}-100 p-1.5 rounded-full text-${type.color}-500`}>
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
