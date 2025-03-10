
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
      <Label htmlFor="section-name">اسم القسم</Label>
      <Input
        id="section-name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={isCustom ? "أدخل اسم القسم المخصص..." : "أدخل اسم القسم..."}
        className="text-right"
      />
      {!isCustom && (
        <p className="text-xs text-gray-500">
          يمكنك تعديل الاسم الافتراضي للقسم حسب رغبتك.
        </p>
      )}
    </div>
  );
};

export default SectionNameField;
