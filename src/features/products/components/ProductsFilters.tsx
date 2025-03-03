
import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface ProductsFiltersProps {
  categories: Category[];
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  categoryFilter: string;
  setCategoryFilter: (categoryId: string) => void;
}

const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  categories,
  priceRange,
  setPriceRange,
  categoryFilter,
  setCategoryFilter
}) => {
  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };
  
  const handleCategoryChange = (categoryId: string) => {
    setCategoryFilter(categoryId);
  };
  
  const handleResetFilters = () => {
    setPriceRange([0, 1000]);
    setCategoryFilter("all");
  };
  
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">التصنيفات</Label>
        </div>
        <div className="space-y-2 pt-1">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox 
              id="category-all" 
              checked={categoryFilter === "all"}
              onCheckedChange={() => handleCategoryChange("all")}
            />
            <Label 
              htmlFor="category-all" 
              className="text-sm cursor-pointer"
            >
              جميع التصنيفات
            </Label>
          </div>
          
          {categories.map((category) => (
            <div 
              key={category.id} 
              className="flex items-center space-x-2 space-x-reverse"
            >
              <Checkbox 
                id={`category-${category.id}`} 
                checked={categoryFilter === category.id}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <Label 
                htmlFor={`category-${category.id}`} 
                className="text-sm cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">نطاق السعر</Label>
        <Slider
          defaultValue={[priceRange[0], priceRange[1]]}
          max={1000}
          step={10}
          value={[priceRange[0], priceRange[1]]}
          onValueChange={handlePriceChange}
          className="py-4"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {priceRange[0]} ر.س
          </span>
          <span className="text-sm text-muted-foreground">
            {priceRange[1]} ر.س
          </span>
        </div>
      </div>
      
      {/* Stock Status */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">حالة المخزون</Label>
        <div className="space-y-2 pt-1">
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox id="stock-all" />
            <Label 
              htmlFor="stock-all" 
              className="text-sm cursor-pointer"
            >
              الكل
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox id="stock-instock" />
            <Label 
              htmlFor="stock-instock" 
              className="text-sm cursor-pointer"
            >
              متوفر
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox id="stock-lowstock" />
            <Label 
              htmlFor="stock-lowstock" 
              className="text-sm cursor-pointer"
            >
              منخفض
            </Label>
          </div>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox id="stock-outofstock" />
            <Label 
              htmlFor="stock-outofstock" 
              className="text-sm cursor-pointer"
            >
              نفذ
            </Label>
          </div>
        </div>
      </div>
      
      {/* Reset Filters */}
      <Button 
        variant="outline" 
        className="w-full"
        onClick={handleResetFilters}
      >
        <X className="h-4 w-4 ml-2" />
        إعادة ضبط الفلاتر
      </Button>
    </div>
  );
};

export default ProductsFilters;
