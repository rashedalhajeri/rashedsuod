
import React from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";

interface ProductsHeaderProps {
  inactiveCount: number;
  totalProducts: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onAddProduct: () => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
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
          {inactiveCount > 0 && (
            <Badge variant="outline" className="font-normal bg-yellow-50 text-yellow-600 border-yellow-200 text-xs">
              {inactiveCount} غير مفعل
            </Badge>
          )}
        </div>
      </div>
      
      {/* حقل البحث وأزرار الإجراءات - في صف واحد */}
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="text"
            placeholder="بحث..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pr-3 pl-9 bg-white border-gray-200 h-10 text-sm placeholder:text-gray-400 rounded-lg w-full"
            dir="rtl"
          />
        </div>
        
        {isMobile ? (
          <Button 
            onClick={onAddProduct}
            className="h-10 whitespace-nowrap px-3 text-sm min-w-[90px]"
            size="sm"
          >
            <Plus className="h-4 w-4 ml-1" /> إضافة
          </Button>
        ) : (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="whitespace-nowrap flex items-center gap-1 h-10 text-xs px-3"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
              تحديث
            </Button>
            
            <Button 
              onClick={onAddProduct}
              className="h-10 whitespace-nowrap px-3 text-sm"
              size="sm"
            >
              <Plus className="h-4 w-4 ml-1" /> إضافة
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default ProductsHeader;
