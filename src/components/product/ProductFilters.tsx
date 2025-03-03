
import React, { useState } from "react";
import { Filter, Tag, X, ChevronUp, ChevronDown, Check, Search, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface FilterOptions {
  categoryId: string | null;
  priceRange: [number, number];
  inStock: boolean | null;
  sortBy: string;
}

interface ProductFiltersProps {
  categories: Category[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice: number;
  isMobile?: boolean;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  searchQuery,
  onSearchChange,
  filters,
  onFilterChange,
  maxPrice,
  isMobile = false
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);
  
  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categoryId) count++;
    if (filters.inStock !== null) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
    return count;
  };
  
  const activeFiltersCount = getActiveFiltersCount();
  
  const handleReset = () => {
    const resetFilters = {
      categoryId: null,
      priceRange: [0, maxPrice],
      inStock: null,
      sortBy: 'newest'
    };
    setTempFilters(resetFilters);
    onFilterChange(resetFilters);
    setIsSheetOpen(false);
  };
  
  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setIsSheetOpen(false);
  };
  
  const selectedCategory = categories.find(c => c.id === filters.categoryId);
  
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pr-10 py-2"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-7 w-7" 
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between items-center">
              <div className="flex items-center">
                <Sliders className="h-4 w-4 ml-2" />
                <span>تصفية المنتجات</span>
              </div>
              {activeFiltersCount > 0 && (
                <span className="bg-primary-100 text-primary-800 text-xs rounded-full px-2 py-0.5 ml-2">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] max-h-[85vh]">
            <SheetHeader className="mb-4">
              <SheetTitle>خيارات التصفية</SheetTitle>
            </SheetHeader>
            
            <div className="overflow-y-auto flex-1" style={{ maxHeight: 'calc(85vh - 180px)' }}>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="category">
                  <AccordionTrigger>التصنيف</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div 
                        className={cn(
                          "flex items-center space-x-2 space-x-reverse rounded-md px-2 py-1.5 cursor-pointer",
                          tempFilters.categoryId === null ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100"
                        )}
                        onClick={() => setTempFilters({...tempFilters, categoryId: null})}
                      >
                        <div className="h-4 w-4 flex items-center justify-center">
                          {tempFilters.categoryId === null && <Check className="h-3 w-3" />}
                        </div>
                        <span>جميع التصنيفات</span>
                      </div>
                      
                      {categories.map(category => (
                        <div 
                          key={category.id} 
                          className={cn(
                            "flex items-center space-x-2 space-x-reverse rounded-md px-2 py-1.5 cursor-pointer",
                            tempFilters.categoryId === category.id ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100"
                          )}
                          onClick={() => setTempFilters({...tempFilters, categoryId: category.id})}
                        >
                          <div className="h-4 w-4 flex items-center justify-center">
                            {tempFilters.categoryId === category.id && <Check className="h-3 w-3" />}
                          </div>
                          <span>{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="price">
                  <AccordionTrigger>السعر</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-6 px-2">
                      <Slider
                        value={tempFilters.priceRange}
                        min={0}
                        max={maxPrice}
                        step={1}
                        onValueChange={(value) => setTempFilters({...tempFilters, priceRange: value as [number, number]})}
                      />
                      
                      <div className="flex justify-between">
                        <div className="text-sm">
                          <span className="text-gray-500">من:</span> {tempFilters.priceRange[0]}
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-500">إلى:</span> {tempFilters.priceRange[1]}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="stock">
                  <AccordionTrigger>المخزون</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <div 
                        className={cn(
                          "flex items-center space-x-2 space-x-reverse rounded-md px-2 py-1.5 cursor-pointer",
                          tempFilters.inStock === null ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100"
                        )}
                        onClick={() => setTempFilters({...tempFilters, inStock: null})}
                      >
                        <div className="h-4 w-4 flex items-center justify-center">
                          {tempFilters.inStock === null && <Check className="h-3 w-3" />}
                        </div>
                        <span>الكل</span>
                      </div>
                      
                      <div 
                        className={cn(
                          "flex items-center space-x-2 space-x-reverse rounded-md px-2 py-1.5 cursor-pointer",
                          tempFilters.inStock === true ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100"
                        )}
                        onClick={() => setTempFilters({...tempFilters, inStock: true})}
                      >
                        <div className="h-4 w-4 flex items-center justify-center">
                          {tempFilters.inStock === true && <Check className="h-3 w-3" />}
                        </div>
                        <span>متوفر في المخزون</span>
                      </div>
                      
                      <div 
                        className={cn(
                          "flex items-center space-x-2 space-x-reverse rounded-md px-2 py-1.5 cursor-pointer",
                          tempFilters.inStock === false ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100"
                        )}
                        onClick={() => setTempFilters({...tempFilters, inStock: false})}
                      >
                        <div className="h-4 w-4 flex items-center justify-center">
                          {tempFilters.inStock === false && <Check className="h-3 w-3" />}
                        </div>
                        <span>غير متوفر</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="sort">
                  <AccordionTrigger>الترتيب</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {[
                        { value: 'newest', label: 'الأحدث أولاً' },
                        { value: 'oldest', label: 'الأقدم أولاً' },
                        { value: 'price_asc', label: 'السعر: من الأقل إلى الأعلى' },
                        { value: 'price_desc', label: 'السعر: من الأعلى إلى الأقل' },
                        { value: 'name_asc', label: 'الاسم: أ-ي' },
                        { value: 'name_desc', label: 'الاسم: ي-أ' }
                      ].map(sort => (
                        <div 
                          key={sort.value} 
                          className={cn(
                            "flex items-center space-x-2 space-x-reverse rounded-md px-2 py-1.5 cursor-pointer",
                            tempFilters.sortBy === sort.value ? "bg-primary-50 text-primary-700" : "hover:bg-gray-100"
                          )}
                          onClick={() => setTempFilters({...tempFilters, sortBy: sort.value})}
                        >
                          <div className="h-4 w-4 flex items-center justify-center">
                            {tempFilters.sortBy === sort.value && <Check className="h-3 w-3" />}
                          </div>
                          <span>{sort.label}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <SheetFooter className="mt-4 sm:justify-between flex flex-row-reverse gap-2">
              <Button onClick={handleApplyFilters}>تطبيق</Button>
              <Button variant="outline" onClick={handleReset}>إعادة تعيين</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        {(activeFiltersCount > 0 || searchQuery) && (
          <div className="flex gap-2 overflow-x-auto py-2 pb-0 -mx-4 px-4">
            {searchQuery && (
              <div className="flex-shrink-0 inline-flex items-center bg-gray-100 text-gray-800 text-xs rounded-full px-3 py-1.5">
                <span className="mr-1">بحث:</span>
                <span className="truncate max-w-[100px]">{searchQuery}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 mr-1 hover:bg-gray-200" 
                  onClick={() => onSearchChange("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {selectedCategory && (
              <div className="flex-shrink-0 inline-flex items-center bg-primary-50 text-primary-700 text-xs rounded-full px-3 py-1.5">
                <Tag className="h-3 w-3 ml-1" />
                {selectedCategory.name}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 mr-1 hover:bg-primary-100" 
                  onClick={() => onFilterChange({...filters, categoryId: null})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {filters.inStock !== null && (
              <div className="flex-shrink-0 inline-flex items-center bg-primary-50 text-primary-700 text-xs rounded-full px-3 py-1.5">
                {filters.inStock ? 'متوفر في المخزون' : 'غير متوفر'}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 mr-1 hover:bg-primary-100" 
                  onClick={() => onFilterChange({...filters, inStock: null})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            
            {(filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) && (
              <div className="flex-shrink-0 inline-flex items-center bg-primary-50 text-primary-700 text-xs rounded-full px-3 py-1.5">
                السعر: {filters.priceRange[0]} - {filters.priceRange[1]}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 mr-1 hover:bg-primary-100" 
                  onClick={() => onFilterChange({...filters, priceRange: [0, maxPrice]})}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 space-y-4">
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            className="pl-10 pr-12 py-2"
            placeholder="ابحث عن منتج..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-6 w-6" 
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Select 
            value={filters.categoryId || ""}
            onValueChange={(value) => onFilterChange({...filters, categoryId: value || null})}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{selectedCategory?.name || "جميع التصنيفات"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">جميع التصنيفات</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={filters.sortBy}
            onValueChange={(value) => onFilterChange({...filters, sortBy: value})}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                {filters.sortBy.includes('_asc') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : filters.sortBy.includes('_desc') ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <Sliders className="h-4 w-4" />
                )}
                <span>
                  {
                    filters.sortBy === 'newest' ? 'الأحدث أولاً' :
                    filters.sortBy === 'oldest' ? 'الأقدم أولاً' :
                    filters.sortBy === 'price_asc' ? 'السعر: من الأقل إلى الأعلى' :
                    filters.sortBy === 'price_desc' ? 'السعر: من الأعلى إلى الأقل' :
                    filters.sortBy === 'name_asc' ? 'الاسم: أ-ي' :
                    filters.sortBy === 'name_desc' ? 'الاسم: ي-أ' :
                    'ترتيب'
                  }
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">الأحدث أولاً</SelectItem>
              <SelectItem value="oldest">الأقدم أولاً</SelectItem>
              <SelectItem value="price_asc">السعر: من الأقل إلى الأعلى</SelectItem>
              <SelectItem value="price_desc">السعر: من الأعلى إلى الأقل</SelectItem>
              <SelectItem value="name_asc">الاسم: أ-ي</SelectItem>
              <SelectItem value="name_desc">الاسم: ي-أ</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2",
              filters.inStock !== null && "bg-primary-50 text-primary-700 border-primary-200"
            )}
            onClick={() => {
              // Toggle between true, false, null
              const nextInStock = filters.inStock === null ? true : filters.inStock === true ? false : null;
              onFilterChange({...filters, inStock: nextInStock});
            }}
          >
            <Check className="h-4 w-4" />
            {filters.inStock === null ? 'المخزون: الكل' : 
             filters.inStock ? 'المخزون: متوفر فقط' : 'المخزون: غير متوفر'}
          </Button>
          
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              className="text-gray-500"
              onClick={handleReset}
            >
              <X className="h-4 w-4 ml-2" />
              مسح التصفية
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
