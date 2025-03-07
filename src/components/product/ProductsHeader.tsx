
import React from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw, ArchiveIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";

interface ProductsHeaderProps {
  archivedCount: number;
  inactiveCount: number;
  totalProducts: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onAddProduct: () => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  archivedCount,
  inactiveCount,
  totalProducts,
  isRefreshing,
  onRefresh,
  onAddProduct,
  searchTerm,
  onSearch
}) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-4 sm:mb-5 space-y-3"
    >
      {/* عنوان ومعلومات المنتجات */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">المنتجات</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {totalProducts} منتج
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {archivedCount > 0 && (
            <Badge variant="outline" className="font-normal text-xs">
              <ArchiveIcon className="h-3 w-3 ml-1" />
              {archivedCount}
            </Badge>
          )}
          {inactiveCount > 0 && (
            <Badge variant="outline" className="font-normal bg-yellow-50 text-yellow-600 border-yellow-200 text-xs">
              {inactiveCount}
            </Badge>
          )}
        </div>
      </div>
      
      {/* حقل البحث وأزرار الإجراءات */}
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-3.5 w-3.5" />
          </div>
          <Input
            type="text"
            placeholder="بحث..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pr-2.5 pl-8 bg-white border-gray-200 h-9 text-xs placeholder:text-gray-400 rounded-lg w-full"
            dir="rtl"
          />
        </div>
        
        {!isMobile && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="whitespace-nowrap flex items-center gap-1 h-9 text-xs px-2.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> 
            تحديث
          </Button>
        )}
        
        <Button 
          onClick={onAddProduct}
          className="h-9 whitespace-nowrap px-2.5 text-xs"
          size="sm"
        >
          <Plus className="h-3.5 w-3.5 ml-1" /> إضافة
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductsHeader;
