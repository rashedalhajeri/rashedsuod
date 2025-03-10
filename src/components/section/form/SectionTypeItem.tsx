
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
        "border rounded-lg p-3 cursor-pointer transition-all hover:border-gray-400",
        isSelected ? `bg-${type.color}-50 border-${type.color}-300` : ""
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {type.icon}
        <span className="font-medium">{type.name}</span>
        {isSelected && (
          <CheckIcon className="h-4 w-4 text-primary ml-auto" />
        )}
      </div>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
        {type.description}
      </p>
    </div>
  );
};

export default SectionTypeItem;
