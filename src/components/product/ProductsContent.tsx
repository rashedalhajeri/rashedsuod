
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ProductBulkActions } from "@/components/product/ProductBulkActions";
import ProductsList from "@/components/product/ProductsList";
import { Product } from "@/utils/products/types";

interface ProductsContentProps {
  products: Product[];
  selectedItems: string[];
  searchTerm: string;
  onEdit: (id: string) => void;
  onSelectionChange: (items: string[]) => void;
  onSearch: (term: string) => void;
  onArchive: (id: string, isArchived: boolean) => void;
  onActivate: (id: string, isActive: boolean) => void;
  onRefresh: () => void;
}

const ProductsContent: React.FC<ProductsContentProps> = ({
  products,
  selectedItems,
  searchTerm,
  onEdit,
  onSelectionChange,
  onSearch,
  onArchive,
  onActivate,
  onRefresh
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mx-auto"
    >
      <Card className="overflow-hidden shadow-md border rounded-xl">
        {selectedItems.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 sm:p-4 border-b bg-blue-50/80"
          >
            <ProductBulkActions 
              selectedCount={selectedItems.length}
              selectedIds={selectedItems}
              onActionComplete={onRefresh}
            />
          </motion.div>
        )}
        
        <ProductsList 
          products={products} 
          onEdit={onEdit}
          onSelectionChange={onSelectionChange}
          searchTerm={searchTerm}
          onSearch={onSearch}
          onArchive={onArchive}
          onActivate={onActivate}
          onRefresh={onRefresh}
        />
      </Card>
    </motion.div>
  );
};

export default ProductsContent;
