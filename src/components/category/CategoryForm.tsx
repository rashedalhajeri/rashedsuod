
import React, { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CategoryFormProps {
  onSubmit: (categoryData: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<CategoryFormData>;
  isSubmitting: boolean;
  isEdit?: boolean;
}

export interface CategoryFormData {
  name: string;
  description: string | null;
  display_order: number | null;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isSubmitting,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    display_order: initialData?.display_order || 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value === "" ? null : Number(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.name.trim() !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">اسم القسم <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          placeholder="أدخل اسم القسم"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">وصف القسم</Label>
        <Textarea
          id="description"
          placeholder="أدخل وصف القسم"
          rows={3}
          value={formData.description || ""}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="display_order">ترتيب العرض</Label>
        <Input
          id="display_order"
          placeholder="أدخل ترتيب العرض"
          type="number"
          min="0"
          value={formData.display_order || ""}
          onChange={handleNumberChange}
        />
        <p className="text-xs text-gray-500">الترتيب الذي سيظهر به القسم في المتجر (الأرقام الأصغر تظهر أولاً)</p>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 ml-2" />
          إلغاء
        </Button>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !isFormValid}
          className="bg-primary-600 hover:bg-primary-700"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              {isEdit ? "جاري التحديث..." : "جاري الإضافة..."}
            </>
          ) : (
            <>
              <Check className="h-4 w-4 ml-2" />
              {isEdit ? "تحديث القسم" : "إضافة القسم"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
