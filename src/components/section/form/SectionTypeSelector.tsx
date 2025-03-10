
import React from "react";
import { Label } from "@/components/ui/label";
import SectionTypeItem from "./SectionTypeItem";
import { sectionTypes } from "./section-config";

interface SectionTypeSelectorProps {
  selectedSectionType: string;
  onTypeChange: (type: string) => void;
}

const SectionTypeSelector: React.FC<SectionTypeSelectorProps> = ({
  selectedSectionType,
  onTypeChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="section-type">نوع القسم</Label>
      <div className="grid grid-cols-2 gap-3 mt-2">
        {sectionTypes.map((type) => (
          <SectionTypeItem
            key={type.id}
            type={type}
            isSelected={selectedSectionType === type.id}
            onClick={() => onTypeChange(type.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SectionTypeSelector;
