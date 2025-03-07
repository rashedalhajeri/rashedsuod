
import React from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw, ArchiveIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-media-query";

interface ProductsHeaderProps {
  archivedCount: number;
  inactiveCount: number;
  totalProducts: number;
  isRefreshing: boolean;
  onRefresh: () => void;
  onAddProduct: () => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  archivedCount,
  inactiveCount,
  totalProducts,
  isRefreshing,
  onRefresh,
  onAddProduct
}) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 sm:mb-6 space-y-4 md:space-y-0"
    >
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
      <div className="flex gap-2 w-full md:w-auto action-buttons-container">
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
          className="w-full md:w-auto h-10"
          size={isMobile ? "default" : "default"}
        >
          <Plus className="h-4 w-4 ml-2" /> إضافة منتج
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductsHeader;
