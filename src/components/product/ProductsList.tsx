
import React, { useState, useEffect } from "react";
import { Package, SlidersHorizontal, Search, Check, Archive, RefreshCw, ArrowUpDown, ChevronDown } from "lucide-react";
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
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface ProductsListProps {
  products: Product[];
  onEdit: (id: string) => void;
  onSelectionChange: (selectedIds: string[]) => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onRefresh?: () => void;
}

type FilterStatus = "all" | "active" | "archived" | "discount" | "low-stock";
type SortOption = "newest" | "oldest" | "price-high" | "price-low" | "name-asc" | "name-desc";

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onEdit,
  onSelectionChange,
  searchTerm = "",
  onSearch,
  onArchive,
  onRefresh
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 6 : 10;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, sortOption, searchTerm]);

  const handleSelect = (productId: string, isSelected: boolean) => {
    const updatedSelection = isSelected 
      ? [...selectedItems, productId]
      : selectedItems.filter(id => id !== productId);
    
    setSelectedItems(updatedSelection);
    onSelectionChange(updatedSelection);
  };
  
  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      const allIds = filteredProducts.map(product => product.id);
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
  
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleArchive = (id: string, isArchived: boolean) => {
    if (onArchive) {
      onArchive(id, isArchived);
    }
  };

  // Filter products based on status
  const getFilteredProducts = () => {
    return products.filter(product => {
      // First apply search term
      const matchesSearch = product.name.toLowerCase().includes(localSearchTerm.toLowerCase());
      if (!matchesSearch) return false;

      // Then apply status filter
      switch (filterStatus) {
        case "active":
          return !product.is_archived;
        case "archived":
          return product.is_archived;
        case "discount":
          return product.discount_price !== null && !product.is_archived;
        case "low-stock":
          return product.track_inventory && product.stock_quantity !== null && 
                 product.stock_quantity <= 5 && !product.is_archived;
        default:
          return true;
      }
    });
  };

  // Sort products
  const sortProducts = (products: Product[]) => {
    return [...products].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  };

  // Apply filtering and sorting
  const filteredProducts = sortProducts(getFilteredProducts());
  
  // Pagination logic
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const getFilterStatusLabel = () => {
    switch (filterStatus) {
      case "active": return "المنتجات النشطة";
      case "archived": return "المنتجات المؤرشفة";
      case "discount": return "العروض والخصومات";
      case "low-stock": return "منتجات قليلة المخزون";
      default: return "جميع المنتجات";
    }
  };

  const getSortOptionLabel = () => {
    switch (sortOption) {
      case "newest": return "الأحدث";
      case "oldest": return "الأقدم"; 
      case "price-high": return "السعر: من الأعلى";
      case "price-low": return "السعر: من الأقل";
      case "name-asc": return "الاسم: أ-ي";
      case "name-desc": return "الاسم: ي-أ";
      default: return "الأحدث";
    }
  };

  // Count of archived products
  const archivedCount = products.filter(p => p.is_archived).length;
  const activeCount = products.filter(p => !p.is_archived).length;

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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectAll(selectedItems.length < filteredProducts.length)}
              className="flex items-center gap-1 text-xs"
            >
              {selectedItems.length === filteredProducts.length ? (
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
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="flex items-center gap-1 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              تحديث
            </Button>
            
            {selectedItems.length > 0 && (
              <span className="mr-2 text-sm text-primary font-medium">
                {selectedItems.length} منتج محدد
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                  <SlidersHorizontal className="h-3.5 w-3.5 ml-1" />
                  {getFilterStatusLabel()}
                  {filterStatus !== "all" && 
                    <Badge variant="secondary" className="ml-1 h-5">{filteredProducts.length}</Badge>
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>حالة المنتج</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={filterStatus} onValueChange={(value) => setFilterStatus(value as FilterStatus)}>
                  <DropdownMenuRadioItem value="all">
                    جميع المنتجات <Badge variant="outline" className="mr-2">{products.length}</Badge>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="active">
                    المنتجات النشطة <Badge variant="outline" className="mr-2">{activeCount}</Badge>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="archived">
                    المنتجات المؤرشفة <Badge variant="outline" className="mr-2">{archivedCount}</Badge>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="discount">
                    العروض والخصومات <Badge variant="outline" className="mr-2">{products.filter(p => p.discount_price !== null).length}</Badge>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="low-stock">
                    منتجات قليلة المخزون <Badge variant="outline" className="mr-2">{products.filter(p => p.track_inventory && p.stock_quantity !== null && p.stock_quantity <= 5).length}</Badge>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                  <ArrowUpDown className="h-3.5 w-3.5 ml-1" />
                  {getSortOptionLabel()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>ترتيب حسب</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                  <DropdownMenuRadioItem value="newest">الأحدث</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="oldest">الأقدم</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-high">السعر: من الأعلى</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="price-low">السعر: من الأقل</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-asc">الاسم: أ-ي</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="name-desc">الاسم: ي-أ</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {currentProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">لا توجد منتجات تطابق البحث</h3>
            <p className="mt-2 text-sm text-muted-foreground">جرب تغيير المعايير أو إعادة ضبط الفلتر</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => {
                setFilterStatus("all");
                setSortOption("newest");
                setLocalSearchTerm("");
                if (onSearch) onSearch("");
              }}
            >
              إعادة ضبط الفلتر
            </Button>
          </div>
        ) : (
          currentProducts.map((product, index) => (
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
                onArchive={handleArchive}
                onRefresh={onRefresh}
              />
            </motion.div>
          ))
        )}
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
