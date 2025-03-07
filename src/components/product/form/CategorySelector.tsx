
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategorySelectorProps {
  categoryId: string | null;
  storeId?: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categoryId,
  storeId,
  onCategoryChange
}) => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', storeId],
    queryFn: async () => {
      if (!storeId) return [];
      
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeId)
        .order('name', { ascending: true });
        
      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!storeId,
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="category">الفئة</Label>
      <Select 
        value={categoryId || "none"} 
        onValueChange={onCategoryChange}
      >
        <SelectTrigger id="category">
          <SelectValue placeholder="اختر الفئة" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">بدون فئة</SelectItem>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
