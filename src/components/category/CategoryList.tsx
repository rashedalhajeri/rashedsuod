
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Trash2, ChevronRight, ShoppingBag } from "lucide-react";
import { Category } from "@/types/category";

interface CategoryListProps {
  categories: Category[];
  currencyCode: string;
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onViewProducts: (category: Category) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  currencyCode,
  onEdit,
  onDelete,
  onViewProducts
}) => {
  return (
    <div className="space-y-4">
      {categories.map((category) => (
        <Card key={category.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                {category.description && (
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(category)}
                  className="text-gray-500 hover:text-primary-600"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(category.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div
              className="p-4 bg-gray-50 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
              onClick={() => onViewProducts(category)}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">
                  {category.product_count || 0} منتج في القسم
                </span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CategoryList;
