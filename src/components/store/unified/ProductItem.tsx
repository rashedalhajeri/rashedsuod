
import React from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface ProductItemProps {
  product: any;
  storeDomain?: string;
  index: number;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, storeDomain, index }) => {
  // Format currency with proper locale and format
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(price);
  };
  
  // Default placeholder for products without images
  const defaultPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23000000'/%3E%3C/svg%3E";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex flex-col card-float"
    >
      <Link 
        to={`/store/${storeDomain}/product/${product.id}`}
        className="relative block mb-2"
      >
        <div className="relative rounded-xl overflow-hidden shadow-sm bg-black">
          <img 
            src={product.image_url || defaultPlaceholder} 
            alt={product.name} 
            className="w-full aspect-square object-cover"
            onError={(e) => {
              // Fallback if image fails to load
              (e.target as HTMLImageElement).src = defaultPlaceholder;
            }}
          />
          
          {/* Heart button with improved styling */}
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:bg-black/60">
            <Heart className="h-4 w-4" />
          </button>
          
          {/* Price overlay with enhanced design */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-lg font-bold">
                  {formatCurrency(product.price)} <span className="text-xs font-normal">KWD</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      {/* Product name with improved typography */}
      <h3 className="text-center font-bold text-md text-gray-800 line-clamp-1">
        {product.name}
      </h3>
    </motion.div>
  );
};

export default ProductItem;
