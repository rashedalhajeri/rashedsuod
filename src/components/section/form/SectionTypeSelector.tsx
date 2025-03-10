
import React from "react";
import { Label } from "@/components/ui/label";
import SectionTypeItem from "./SectionTypeItem";
import { sectionTypes } from "./section-config";
import { motion } from "framer-motion";

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
      <Label htmlFor="section-type" className="text-base font-medium">نوع القسم</Label>
      <p className="text-sm text-gray-500 mb-2">اختر نوع القسم المناسب لعرض المنتجات</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
        {sectionTypes.map((type) => (
          <motion.div
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SectionTypeItem
              type={type}
              isSelected={selectedSectionType === type.id}
              onClick={() => onTypeChange(type.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SectionTypeSelector;
