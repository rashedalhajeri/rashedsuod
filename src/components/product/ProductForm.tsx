
import React, { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ProductFormProps {
  categories: string[];
  onSubmit: (productData: ProductFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ProductFormData>;
  isSubmitting: boolean;
  isEdit?: boolean;
}

export interface ProductFormData {
  name: string;
  description: string | null;
  price: number;
  stock_quantity: number | null;
  image_url: string | null;
  category: string | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  onSubmit,
  onCancel,
  initialData,
  isSubmitting,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    stock_quantity: initialData?.stock_quantity || null,
    image_url: initialData?.image_url || "",
    category: initialData?.category || categories[0]
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

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.name.trim() !== "" && formData.price > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">اسم المنتج <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          placeholder="أدخل اسم المنتج"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="category">التصنيف</Label>
        <Select value={formData.category || ""} onValueChange={handleCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="اختر تصنيف" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">وصف المنتج</Label>
        <Textarea
          id="description"
          placeholder="أدخل وصف المنتج"
          rows={3}
          value={formData.description || ""}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">السعر <span className="text-red-500">*</span></Label>
        <Input
          id="price"
          placeholder="أدخل سعر المنتج"
          type="number"
          step="0.01"
          min="0"
          value={formData.price || ""}
          onChange={handleNumberChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="stock_quantity">المخزون</Label>
        <Input
          id="stock_quantity"
          placeholder="أدخل كمية المخزون"
          type="number"
          min="0"
          value={formData.stock_quantity || ""}
          onChange={handleNumberChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="image_url">رابط الصورة</Label>
        <Input
          id="image_url"
          placeholder="أدخل رابط صورة المنتج"
          value={formData.image_url || ""}
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500">ادخل رابط صورة المنتج الخاص بك. يفضل صور بحجم 300×300 بكسل.</p>
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
              {isEdit ? "تحديث المنتج" : "إضافة المنتج"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
