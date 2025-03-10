
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SectionNameFieldProps {
  name: string;
  onNameChange: (name: string) => void;
  isCustom: boolean;
}

const SectionNameField: React.FC<SectionNameFieldProps> = ({
  name,
  onNameChange,
  isCustom
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="section-name" className="text-base font-medium">
        {isCustom && <span className="text-rose-500">*</span>} اسم القسم
      </Label>
      <Input
        id="section-name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={isCustom ? "أدخل اسم القسم المخصص..." : "أدخل اسم القسم..."}
        className="text-right border-gray-300 focus:border-primary"
        style={isCustom ? { borderColor: '#f43f5e40', background: '#f43f5e05' } : {}}
      />
      {!isCustom ? (
        <p className="text-xs text-gray-500">
          يمكنك تعديل الاسم الافتراضي للقسم حسب رغبتك.
        </p>
      ) : (
        <p className="text-xs text-gray-500">
          هذا القسم سيظهر كصفحة خاصة في متجرك. اختر اسماً واضحاً.
        </p>
      )}
    </div>
  );
};

export default SectionNameField;
