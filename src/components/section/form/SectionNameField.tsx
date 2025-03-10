
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { sectionTypes } from "./section-config";

interface SectionNameFieldProps {
  name: string;
  onNameChange: (value: string) => void;
  sectionType: string;
}

const SectionNameField: React.FC<SectionNameFieldProps> = ({
  name,
  onNameChange,
  sectionType
}) => {
  // Find the selected section type
  const selectedType = sectionTypes.find(type => type.id === sectionType);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="section-name" className="text-base font-medium">اسم القسم</Label>
      </div>
      <p className="text-sm text-gray-500 mb-2">
        اسم القسم كما سيظهر للزوار في متجرك
      </p>
      <Input
        id="section-name"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder={selectedType ? selectedType.name : "أدخل اسم القسم"}
        className="w-full"
      />
    </div>
  );
};

export default SectionNameField;
