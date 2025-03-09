
import React from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw, Search, Filter, ArrowDownWideNarrow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile, useIsTablet } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
  const isTablet = useIsTablet();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${isMobile ? 'space-y-2' : 'space-y-3'}`}
    >
      {/* عنوان ومعلومات المنتجات */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-900 mb-0.5`}>المنتجات</h1>
          <div className="flex items-center gap-1.5">
            <p className="text-muted-foreground text-xs">
              {totalProducts} منتج
            </p>
            {inactiveCount > 0 && (
              <Badge variant="outline" className="font-normal bg-yellow-50 text-yellow-600 border-yellow-200 text-[10px] px-1.5 py-0">
                {inactiveCount} غير مفعل
              </Badge>
            )}
          </div>
        </div>
        
        {!isMobile && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="whitespace-nowrap flex items-center gap-1 h-9 text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} /> 
              تحديث
            </Button>
            
            <Button 
              onClick={onAddProduct}
              className="h-9 whitespace-nowrap text-xs"
              size="sm"
            >
              <Plus className="h-3.5 w-3.5 ml-1" /> إضافة منتج
            </Button>
          </div>
        )}
      </div>
      
      {/* حقل البحث وأزرار الإجراءات */}
      <div className={`flex items-center gap-2 w-full ${isMobile ? 'flex-col' : 'flex-row'}`}>
        <div className={`relative flex-1 ${isMobile ? 'w-full' : ''}`}>
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="text"
            placeholder="بحث في المنتجات..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pr-3 pl-9 bg-white border-gray-200 h-10 text-sm placeholder:text-gray-400 rounded-lg w-full"
            dir="rtl"
          />
        </div>
        
        {isMobile && (
          <div className="flex gap-2 w-full">
            <Button 
              onClick={onAddProduct}
              className="h-10 text-sm flex-1"
              size="sm"
            >
              <Plus className="h-4 w-4 ml-1" /> إضافة منتج
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onRefresh} disabled={isRefreshing}>
                  <RefreshCw className={`h-4 w-4 ml-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  تحديث المنتجات
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowDownWideNarrow className="h-4 w-4 ml-2" />
                  ترتيب حسب السعر
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductsHeader;
