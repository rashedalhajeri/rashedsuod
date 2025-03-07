
import React from "react";
import { Product } from "@/utils/products/types";
import { motion, AnimatePresence } from "framer-motion";
import ProductListItem from "@/components/product/ProductListItem";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProductItemsProps {
  filteredProducts: Product[];
  selectedItems: string[];
  handleToggleSelection: (id: string, isSelected: boolean) => void;
  handleProductClick: (product: Product) => void;
  onEdit: (id: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onActivate?: (id: string, isActive: boolean) => void;
  onRefresh?: () => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  setCategoryFilter: (category: string | null) => void;
  categoryFilter: string | null;
}

const ProductItems: React.FC<ProductItemsProps> = ({
  filteredProducts,
  selectedItems,
  handleToggleSelection,
  handleProductClick,
  onEdit,
  onArchive,
  onActivate,
  onRefresh,
  searchTerm,
  onSearch,
  setCategoryFilter,
  categoryFilter,
}) => {
  return (
    <div className="max-h-[700px] overflow-auto">
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
                  onClick={() => handleProductClick(product)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <Card className="p-6 flex flex-col items-center">
            <div className="text-center space-y-2">
              <p className="text-gray-500 text-sm">لا يوجد منتجات تطابق البحث</p>
              {(searchTerm || categoryFilter) && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {searchTerm && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onSearch("")}
                    >
                      مسح البحث
                    </Button>
                  )}
                  {categoryFilter && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCategoryFilter(null)}
                    >
                      عرض كل الفئات
                    </Button>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProductItems;
