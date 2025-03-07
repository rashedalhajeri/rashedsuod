
import React from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-media-query";
import { motion } from "framer-motion";

interface ProductActionsProps {
  quantity: number;
  onQuantityChange: (type: 'increase' | 'decrease') => void;
  onAddToCart: () => void;
  isOutOfStock?: boolean;
  trackInventory?: boolean;
  stockQuantity?: number; // Added this prop to receive stock quantity
}

const ProductActions: React.FC<ProductActionsProps> = ({
  quantity,
  onQuantityChange,
  onAddToCart,
  isOutOfStock = false,
  trackInventory = false,
  stockQuantity = 0 // Set default value
}) => {
  // If we're not tracking inventory, product is never out of stock
  const effectivelyOutOfStock = trackInventory && isOutOfStock;
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center justify-between">
        <span className="text-gray-700 font-medium">الكمية</span>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuantityChange('decrease')}
            disabled={quantity <= 1 || effectivelyOutOfStock}
            className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            aria-label="تقليل الكمية"
          >
            <Minus className="h-4 w-4" />
          </motion.button>
          
          <span className="w-12 text-center font-medium">{quantity}</span>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuantityChange('increase')}
            disabled={effectivelyOutOfStock}
            className="px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            aria-label="زيادة الكمية"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
      
      {/* Add to cart button */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onAddToCart}
          disabled={effectivelyOutOfStock}
          variant="default"
          size={isMobile ? "default" : "lg"}
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-12 transition-all duration-300 shadow-md"
        >
          <ShoppingCart className="h-5 w-5 ml-2" />
          {effectivelyOutOfStock ? 'نفذت الكمية' : 'إضافة إلى السلة'}
        </Button>
      </motion.div>
      
      {trackInventory && stockQuantity !== undefined && (
        <div className={`text-sm text-center ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
          {isOutOfStock 
            ? 'هذا المنتج غير متوفر حالياً' 
            : `متبقي ${stockQuantity} قطعة في المخزون`}
        </div>
      )}
    </div>
  );
};

export default ProductActions;
