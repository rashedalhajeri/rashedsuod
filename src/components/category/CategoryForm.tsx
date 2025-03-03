
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Category, CategoryFormData } from "@/types/category";
import { Loader2, Save } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يكون اسم القسم حرفين على الأقل" }).max(50, { message: "اسم القسم طويل جداً" }),
  description: z.string().max(500, { message: "الوصف طويل جداً" }).optional(),
  display_order: z.number().int().optional().nullable(),
});

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
      display_order: category?.display_order || null,
    },
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
        description: category.description || "",
        display_order: category.display_order || null,
      });
    }
  }, [category, form]);

  const handleSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium mb-4 text-gray-900">
        {category ? "تعديل القسم" : "إنشاء قسم جديد"}
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>اسم القسم</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسم القسم" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الوصف</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="أدخل وصف القسم (اختياري)" 
                    {...field} 
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="display_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ترتيب العرض</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="ترتيب العرض (اختياري)" 
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? null : parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end space-x-2 space-x-reverse pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  حفظ
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
