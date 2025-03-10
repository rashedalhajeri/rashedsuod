
import React from "react";
import { Label } from "@/components/ui/label";
import SectionTypeItem from "./SectionTypeItem";
import { sectionTypes } from "./section-config";
import { motion } from "framer-motion";
import { Section } from "@/services/section-service";

interface SectionTypeSelectorProps {
  selectedSectionType: string;
  onTypeChange: (type: string) => void;
  existingSections?: Section[]; // Add this prop to check for existing sections
}

const SectionTypeSelector: React.FC<SectionTypeSelectorProps> = ({
  selectedSectionType,
  onTypeChange,
  existingSections = []
}) => {
  // Get list of section types that have already been added
  const existingSectionTypes = existingSections.map(section => section.section_type);

  return (
    <div className="space-y-2">
      <Label htmlFor="section-type" className="text-base font-medium">نوع القسم</Label>
      <p className="text-sm text-gray-500 mb-2">اختر نوع القسم المناسب لعرض المنتجات</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {sectionTypes.map((type) => {
          // Check if this section type already exists
          const isAlreadyAdded = existingSectionTypes.includes(type.id);
          
          return (
            <motion.div
              key={type.id}
              whileHover={{ scale: isAlreadyAdded ? 1 : 1.02 }}
              whileTap={{ scale: isAlreadyAdded ? 1 : 0.98 }}
            >
              <SectionTypeItem
                type={type}
                isSelected={selectedSectionType === type.id}
                onClick={() => !isAlreadyAdded && onTypeChange(type.id)}
                isDisabled={isAlreadyAdded}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionTypeSelector;
