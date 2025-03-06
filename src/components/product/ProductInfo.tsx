
import React from "react";
import { Separator } from "@/components/ui/separator";

interface ProductInfoProps {
  product: {
    name: string;
    price: number;
    original_price?: number;
    description?: string;
    stock_quantity?: number | null;
    highlights?: string[];
  };
  formatCurrency: (price: number) => string;
  storeData?: {
    currency?: string;
  };
}

const ProductInfo: React.FC<ProductInfoProps> = ({ product, formatCurrency, storeData }) => {
  return (
    <div className="p-4">
      {/* Product title and description */}
      <div className="space-y-2 mb-6">
        <h1 className="text-xl font-bold text-right leading-tight">{product.name}</h1>
        {product.description && (
          <p className="text-gray-600 text-sm line-clamp-2 text-right">
            {product.description}
          </p>
        )}
      </div>
      
      {/* Price section */}
      <div className="mt-4 text-right">
        <div className="flex justify-end items-baseline">
          <span className="text-4xl font-bold">{formatCurrency(product.price)}</span>
          <span className="ml-1 text-gray-500">{storeData?.currency || 'KWD'}</span>
        </div>
        
        {product.original_price && product.original_price > product.price && (
          <span className="text-gray-400 line-through block text-sm mt-1">
            {formatCurrency(product.original_price)} {storeData?.currency || 'KWD'}
          </span>
        )}
      </div>
      
      {/* Product features/highlights in bullet form */}
      <div className="mt-6 space-y-2">
        {product.highlights && product.highlights.length > 0 ? (
          product.highlights.map((highlight, index) => (
            <p key={index} className="text-gray-700 text-right">{highlight}</p>
          ))
        ) : (
          <>
            {product.description && (
              <p className="text-gray-700 text-right">{product.description}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
