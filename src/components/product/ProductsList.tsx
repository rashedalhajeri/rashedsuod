
import React, { useState } from "react";
import { Package, SlidersHorizontal, Search, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/utils/products/types";
import ProductListItem from "./ProductListItem";
import { Pagination } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-media-query";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface ProductsListProps {
  products: Product[];
  onEdit: (id: string) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  onRefresh: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onEdit,
  onSelectionChange,
  searchTerm = "",
  onSearch,
  onRefresh
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 6 : 10;

  const handleSelect = (productId: string, isSelected: boolean) => {
    const updatedSelection = isSelected 
      ? [...selectedItems, productId]
      : selectedItems.filter(id => id !== productId);
    
    setSelectedItems(updatedSelection);
    onSelectionChange(updatedSelection);
  };
  
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = products.map(product => product.id);
      setSelectedItems(allIds);
      onSelectionChange(allIds);
    } else {
      setSelectedItems([]);
      onSelectionChange([]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(localSearchTerm);
    }
  };
  
  // Pagination logic
  const pageCount = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, products.length);
  const currentProducts = products.slice(startIndex, endIndex);

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">لا توجد منتجات</h3>
        <p className="mt-2 text-sm text-muted-foreground">قم بإضافة منتجات جديدة</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 border-b">
        <form onSubmit={handleSearchSubmit} className="flex w-full gap-2 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={localSearchTerm}
              onChange={handleSearch}
              placeholder="بحث عن منتج..."
              className="pr-3 pl-10 w-full bg-white"
            />
          </div>
          <Button type="submit" variant="default" className="shrink-0">
            بحث
          </Button>
        </form>
        
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll(selectedItems.length < products.length)}
              className="flex items-center gap-1 text-xs"
            >
              {selectedItems.length === products.length ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  إلغاء تحديد الكل
                </>
              ) : (
                <>
                  تحديد الكل
                </>
              )}
            </Button>
            
            {selectedItems.length > 0 && (
              <span className="mr-2 text-sm text-primary font-medium">
                {selectedItems.length} منتج محدد
              </span>
            )}
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                <SlidersHorizontal className="h-3.5 w-3.5 ml-1" />
                فلترة
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>خيارات الفلترة</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  جميع المنتجات
                </DropdownMenuItem>
                <DropdownMenuItem>
                  المنتجات ذات الخصم
                </DropdownMenuItem>
                <DropdownMenuItem>
                  المنتجات الأكثر مبيعاً
                </DropdownMenuItem>
                <DropdownMenuItem>
                  المنتجات قليلة المخزون
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="divide-y">
        {currentProducts.map((product, index) => (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <ProductListItem 
              product={product} 
              onSelect={handleSelect}
              isSelected={selectedItems.includes(product.id)}
              onEdit={onEdit}
              onRefresh={onRefresh}
            />
          </motion.div>
        ))}
      </div>
      
      {pageCount > 1 && (
        <div className="flex justify-center p-4">
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage} 
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ProductsList;
