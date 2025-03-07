
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
      className="mb-5 sm:mb-6 space-y-4"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">المنتجات</h1>
            {archivedCount > 0 && (
              <Badge variant="outline" className="mr-2 font-normal">
                <ArchiveIcon className="h-3 w-3 ml-1" />
                {archivedCount} مؤرشف
              </Badge>
            )}
            {inactiveCount > 0 && (
              <Badge variant="outline" className="mr-2 font-normal bg-yellow-50 text-yellow-600 border-yellow-200">
                {inactiveCount} غير نشط
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            إدارة منتجات متجرك ({totalProducts} منتج)
          </p>
        </div>
      </div>
      
      <div className="flex flex-row items-center gap-2 w-full">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="text"
            placeholder="بحث في المنتجات..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pr-3 pl-10 bg-white border-gray-200 h-10 text-sm placeholder:text-gray-400 rounded-lg"
            dir="rtl"
          />
        </div>
        
        {!isMobile && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="whitespace-nowrap flex items-center gap-1 h-10"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
            تحديث
          </Button>
        )}
        
        <Button 
          onClick={onAddProduct}
          className="h-10 whitespace-nowrap"
          size="default"
        >
          <Plus className="h-4 w-4 ml-1" /> إضافة منتج
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductsHeader;
