
import React, { useState, useMemo } from "react";
import { Product } from "@/utils/products/types";
import { Filter } from "lucide-react";
import ProductListItem from "@/components/product/ProductListItem";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ProductsListProps {
  products: Product[];
  onEdit: (id: string) => void;
  onSelectionChange: (items: string[]) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onActivate?: (id: string, isActive: boolean) => void;
  onRefresh?: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onEdit,
  onSelectionChange,
  searchTerm,
  onSearch,
  onArchive,
  onActivate,
  onRefresh
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState<string>("active");

  const handleToggleSelection = (id: string, isSelected: boolean) => {
    const newSelectedItems = isSelected
      ? [...selectedItems, id]
      : selectedItems.filter(itemId => itemId !== id);
    
    setSelectedItems(newSelectedItems);
    onSelectionChange(newSelectedItems);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([]);
      onSelectionChange([]);
    } else {
      const allIds = filteredProducts.map((product) => product.id);
      setSelectedItems(allIds);
      onSelectionChange(allIds);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filterActive === "active" && (!product.is_active || product.is_archived)) {
        return false;
      }
      
      if (filterActive === "inactive" && (product.is_active || product.is_archived)) {
        return false;
      }
      
      if (filterActive === "archived" && !product.is_archived) {
        return false;
      }
      
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }, [products, searchTerm, filterActive]);

  const getFilterCounts = () => {
    const active = products.filter(p => p.is_active && !p.is_archived).length;
    const inactive = products.filter(p => !p.is_active && !p.is_archived).length;
    const archived = products.filter(p => p.is_archived).length;
    
    return { active, inactive, archived };
  };
  
  const filterCounts = getFilterCounts();

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex flex-row gap-2 items-center bg-gradient-to-r from-gray-50 to-white">
          <div className="flex overflow-x-auto py-1 scrollbar-hide flex-1">
            <div className="flex gap-2">
              <Button
                variant={filterActive === "active" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterActive("active")}
                className={cn(
                  "rounded-full text-xs min-w-fit px-3 py-1 h-8",
                  filterActive === "active" ? "bg-green-500 text-white border-green-500" : "bg-white text-gray-700"
                )}
              >
                نشط
                <Badge variant="secondary" className="mr-1 text-[10px] bg-white/20 text-white h-4">
                  {filterCounts.active}
                </Badge>
              </Button>
              <Button
                variant={filterActive === "inactive" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterActive("inactive")}
                className={cn(
                  "rounded-full text-xs min-w-fit px-3 py-1 h-8",
                  filterActive === "inactive" ? "bg-gray-500 text-white border-gray-500" : "bg-white text-gray-700"
                )}
              >
                غير نشط
                <Badge variant="secondary" className="mr-1 text-[10px] bg-white/20 text-white h-4">
                  {filterCounts.inactive}
                </Badge>
              </Button>
              <Button
                variant={filterActive === "archived" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterActive("archived")}
                className={cn(
                  "rounded-full text-xs min-w-fit px-3 py-1 h-8",
                  filterActive === "archived" ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-700"
                )}
              >
                مسودة
                <Badge variant="secondary" className="mr-1 text-[10px] bg-white/20 text-white h-4">
                  {filterCounts.archived}
                </Badge>
              </Button>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-shrink-0 w-8 h-8 p-0 rounded-full"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleSelectAll}>
                {selectedItems.length === filteredProducts.length && filteredProducts.length > 0
                  ? "إلغاء تحديد الكل"
                  : "تحديد الكل"}
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={() => setFilterActive("active")}>
                عرض النشطة فقط
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterActive("inactive")}>
                عرض غير النشطة فقط
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterActive("archived")}>
                عرض المسودات فقط
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="max-h-[700px] overflow-auto">
          <ScrollArea className="h-full">
            <div className="space-y-2 p-3">
              {filteredProducts.length > 0 ? (
                <AnimatePresence initial={false}>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="group"
                    >
                      <ProductListItem
                        product={product}
                        onSelect={handleToggleSelection}
                        isSelected={selectedItems.includes(product.id)}
                        onEdit={onEdit}
                        onArchive={onArchive}
                        onActivate={onActivate}
                        onRefresh={onRefresh}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) : (
                <Card className="p-6 flex flex-col items-center">
                  <div className="text-center space-y-2">
                    <p className="text-gray-500 text-sm">لا يوجد منتجات تطابق البحث</p>
                    {searchTerm && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => onSearch("")}
                      >
                        مسح البحث
                      </Button>
                    )}
                  </div>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ProductsList;
