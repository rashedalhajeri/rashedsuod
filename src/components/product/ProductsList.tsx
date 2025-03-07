
import React, { useState } from "react";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { Product } from "@/utils/products/types";
import ProductListItem from "./ProductListItem";

interface ProductsListProps {
  products: Product[];
  onEdit: (id: string) => void;
  onSelectionChange: (selectedIds: string[]) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onEdit,
  onSelectionChange
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelect = (productId: string, isSelected: boolean) => {
    const updatedSelection = isSelected 
      ? [...selectedItems, productId]
      : selectedItems.filter(id => id !== productId);
    
    setSelectedItems(updatedSelection);
    onSelectionChange(updatedSelection);
  };

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
    <div>
      {products.map((product) => (
        <ProductListItem 
          key={product.id} 
          product={product} 
          onSelect={handleSelect}
          isSelected={selectedItems.includes(product.id)}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default ProductsList;
