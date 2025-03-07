
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, TagIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryFormProps {
  newCategory: string;
  setNewCategory: (name: string) => void;
  handleAddCategory: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  newCategory,
  setNewCategory,
  handleAddCategory
}) => {
  return (
    <Card className="border-gray-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <TagIcon className="h-4 w-4" />
          إضافة فئة جديدة
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            أضف فئات جديدة لتنظيم منتجاتك وتسهيل تصفحها للعملاء.
          </p>
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="اسم الفئة الجديدة..."
              className="max-w-xs"
            />
            <Button 
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={handleAddCategory}
              disabled={!newCategory.trim()}
            >
              <Plus className="h-4 w-4" />
              <span>إضافة</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryForm;
