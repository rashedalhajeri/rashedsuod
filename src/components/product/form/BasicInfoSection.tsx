
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface BasicInfoSectionProps {
  name: string;
  description: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({
  name,
  description,
  handleInputChange
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">اسم المنتج <span className="text-red-500">*</span></Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="أدخل اسم المنتج" 
          value={name} 
          onChange={handleInputChange} 
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">وصف المنتج</Label>
        <Textarea 
          id="description" 
          name="description" 
          placeholder="أدخل وصف المنتج"
          value={description} 
          onChange={handleInputChange} 
          rows={4}
        />
      </div>
    </div>
  );
};

export default BasicInfoSection;
