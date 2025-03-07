
import React from "react";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingState from "@/components/ui/loading-state";
import { Product } from "@/utils/product-helpers";
import ProductListItem from "./ProductListItem";

interface ProductsListProps {
  products: Product[] | undefined;
  isLoading: boolean;
  formatCurrency: (price: number) => string;
  onAddProductClick: () => void;
  onDeleteClick: (product: Product) => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  isLoading,
  formatCurrency,
  onAddProductClick,
  onDeleteClick
}) => {
  if (isLoading) {
    return <LoadingState message="جاري تحميل المنتجات..." />;
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">لا توجد منتجات بعد</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          ابدأ بإضافة منتجات جديدة لعرضها في متجرك
        </p>
        <Button className="mt-4 gap-2" onClick={onAddProductClick}>
          <span>إضافة أول منتج</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <ProductListItem 
          key={product.id} 
          product={product} 
          formatCurrency={formatCurrency} 
          onDeleteClick={onDeleteClick}
        />
      ))}
    </div>
  );
};

export default ProductsList;
