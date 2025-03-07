
import React, { useState } from "react";
import { Package, SlidersHorizontal } from "lucide-react";
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

interface ProductsListProps {
  products: Product[];
  onEdit: (id: string) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onEdit,
  onSelectionChange,
  searchTerm = "",
  onSearch
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 5 : 10;

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
      <div className="flex flex-col sm:flex-row justify-between p-4 bg-gray-50 border-b items-start sm:items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
          <Input
            value={localSearchTerm}
            onChange={handleSearch}
            placeholder="بحث عن منتج..."
            className="w-full rounded-r-none rounded-l-md sm:w-64"
          />
          <Button type="submit" variant="default" className="rounded-l-none rounded-r-md">
            بحث
          </Button>
        </form>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <SlidersHorizontal className="h-4 w-4 ml-2" />
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
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSelectAll(selectedItems.length < products.length)}
            className="w-full sm:w-auto"
          >
            {selectedItems.length === products.length ? "إلغاء تحديد الكل" : "تحديد الكل"}
          </Button>
        </div>
      </div>

      <div className="divide-y">
        {currentProducts.map((product) => (
          <ProductListItem 
            key={product.id} 
            product={product} 
            onSelect={handleSelect}
            isSelected={selectedItems.includes(product.id)}
            onEdit={onEdit}
          />
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
