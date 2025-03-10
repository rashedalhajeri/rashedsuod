
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SectionNameFieldProps {
  name: string;
  onNameChange: (name: string) => void;
  isCustom: boolean;
  selectedCategoryName?: string;
  sectionType?: string;
}

const SectionNameField: React.FC<SectionNameFieldProps> = ({
  name,
  onNameChange,
  isCustom,
  selectedCategoryName,
  sectionType
}) => {
  let placeholder = "أدخل اسم القسم...";
  
  if (sectionType === 'category' && selectedCategoryName) {
    placeholder = `منتجات ${selectedCategoryName}`;
  } else if (isCustom) {
    placeholder = "أدخل اسم القسم المخصص...";
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="section-name" className="text-base font-medium">
        {(isCustom || sectionType === 'category') && <span className="text-rose-500">*</span>} اسم القسم
      </Label>
      <Input
        id="section-name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={placeholder}
        className="text-right border-gray-300 focus:border-primary"
        style={(isCustom || sectionType === 'category') ? { borderColor: '#f43f5e40', background: '#f43f5e05' } : {}}
      />
      {sectionType === 'category' ? (
        <p className="text-xs text-gray-500">
          يمكنك تخصيص اسم القسم أو استخدام الاسم التلقائي للفئة المختارة
        </p>
      ) : isCustom ? (
        <p className="text-xs text-gray-500">
          هذا القسم مخصص لعرض المنتجات التي تختارها. اختر اسماً واضحاً ومعبراً.
        </p>
      ) : (
        <p className="text-xs text-gray-500">
          يمكنك تعديل الاسم الافتراضي للقسم حسب رغبتك.
        </p>
      )}
    </div>
  );
};

export default SectionNameField;
