
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
  } else if (sectionType === 'all_products') {
    placeholder = "جميع المنتجات";
  } else if (isCustom) {
    placeholder = "أدخل اسم القسم المخصص...";
  }

  // Determine if name field is required
  const isRequired = isCustom || sectionType === 'category';
  
  // Add subtle highlight for required fields
  const fieldStyle = isRequired ? 
    { borderColor: '#f43f5e40', background: '#f43f5e05' } : 
    {};

  return (
    <div className="space-y-2">
      <Label htmlFor="section-name" className="text-base font-medium">
        {isRequired && <span className="text-rose-500 ml-1">*</span>} اسم القسم
      </Label>
      <Input
        id="section-name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={placeholder}
        className="text-right border-gray-300 focus:border-primary"
        style={fieldStyle}
      />
      {sectionType === 'category' ? (
        <p className="text-xs text-gray-500">
          يمكنك تخصيص اسم القسم أو استخدام الاسم التلقائي للفئة المختارة
        </p>
      ) : sectionType === 'all_products' ? (
        <p className="text-xs text-gray-500">
          يعرض جميع المنتجات المتوفرة في متجرك بترتيب مخصص
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
