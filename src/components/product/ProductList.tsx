
import React from "react";
import ProductCard from "@/components/product/ProductCard";
import EmptyProductState from "@/components/product/EmptyProductState";
import LoadingState from "@/components/ui/loading-state";
import { toast } from "sonner";

interface ProductListProps {
  products: any[] | null;
  isLoading: boolean;
  storeData: any;
  onDelete: (product: any) => void;
  onAddProduct: () => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  storeData,
  onDelete,
  onAddProduct
}) => {
  if (isLoading) {
    return <LoadingState message="جاري تحميل المنتجات..." />;
  }

  if (!products || products.length === 0) {
    return <EmptyProductState onAddProduct={onAddProduct} />;
  }

  return (
    <div className="grid gap-4">
      {products.map((product) => (
        <ProductCard 
          key={product.id}
          product={product}
          currency={storeData?.currency}
          onDelete={() => onDelete(product)}
          onEdit={() => {
            // Edit functionality will be implemented later
            toast.info("وظيفة التعديل ستكون متاحة قريباً");
          }}
        />
      ))}
    </div>
  );
};

export default ProductList;
