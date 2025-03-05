
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProductBasicInfoProps {
  name: string;
  description: string;
  nameError?: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  name,
  description,
  nameError,
  onInputChange
}) => {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="name">اسم المنتج <span className="text-red-500">*</span></Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="أدخل اسم المنتج" 
          value={name} 
          onChange={onInputChange}
          className={nameError ? "border-red-300" : ""}
        />
        {nameError && (
          <p className="text-sm text-red-500">{nameError}</p>
        )}
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="description">الوصف</Label>
        <Textarea 
          id="description" 
          name="description" 
          placeholder="أدخل وصف المنتج"
          value={description} 
          onChange={onInputChange} 
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );
};
