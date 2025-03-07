
import React from "react";
import { Product } from "@/utils/products/types";
import ProductsList from "./ProductsList";

interface ProductsContentProps {
  products: Product[];
  selectedItems: string[];
  searchTerm: string;
  onEdit: (id: string) => void;
  onSelectionChange: (items: string[]) => void;
  onSearch: (term: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onActivate?: (id: string, isActive: boolean) => void;
  onRefresh?: () => void;
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
    <div className="bg-gray-50 rounded-xl p-1">
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
    </div>
  );
};

export default ProductsContent;
