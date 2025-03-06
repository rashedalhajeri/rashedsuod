
import React from "react";
import ProductSkeleton from "./ProductSkeleton";

interface ProductGridSkeletonProps {
  count?: number;
}

const ProductGridSkeleton: React.FC<ProductGridSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array(count)
        .fill(0)
        .map((_, index) => (
          <ProductSkeleton key={`product-skeleton-${index}`} index={index} />
        ))}
    </div>
  );
};

export default ProductGridSkeleton;
