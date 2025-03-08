
import React from "react";
import { motion } from "framer-motion";
import ProductActions from "@/components/product/ProductActions";

interface ProductPriceBarProps {
  formatCurrency: (price: number) => string;
  product: any;
  showContent: boolean;
  quantity: number;
  onQuantityChange: (type: 'increase' | 'decrease') => void;
  onAddToCart: () => void;
  isOutOfStock: boolean;
}

const ProductPriceBar: React.FC<ProductPriceBarProps> = ({
  formatCurrency,
  product,
  showContent,
  quantity,
  onQuantityChange,
  onAddToCart,
  isOutOfStock
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 20 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 flex justify-between items-center"
    >
      <div className="text-2xl font-bold text-gray-800">
        {formatCurrency(product.price)}
      </div>
      <div className="flex items-center gap-2">
        <ProductActions
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          onAddToCart={onAddToCart}
          isOutOfStock={isOutOfStock}
          trackInventory={product?.track_inventory || false}
          stockQuantity={product?.stock_quantity || 0}
        />
      </div>
    </motion.div>
  );
};

export default ProductPriceBar;
