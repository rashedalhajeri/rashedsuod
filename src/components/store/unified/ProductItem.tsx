
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { formatCurrency, handleImageError } from "@/utils/product-helpers";

interface ProductItemProps {
  product: any;
  storeDomain?: string;
  index: number;
  displayStyle?: 'grid' | 'list';
}

const ProductItem: React.FC<ProductItemProps> = ({ 
  product, 
  storeDomain, 
  index,
  displayStyle = 'grid'
}) => {
  const [imageError, setImageError] = useState(false);
  
  // Default placeholder for products without images
  const defaultPlaceholder = "/placeholder.svg";
  
  // Determine which image URL to use
  const displayImageUrl = imageError || !product.image_url ? defaultPlaceholder : product.image_url;
  
  const handleLocalImageError = () => {
    console.log("Product image failed to load:", product.image_url);
    setImageError(true);
  };
  
  // If in list mode, use a different layout
  if (displayStyle === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="flex bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 card-float"
      >
        <Link 
          to={`/store/${storeDomain}/product/${product.id}`}
          className="relative block"
          style={{ width: '120px' }}
        >
          <div className="relative overflow-hidden bg-gray-100 h-full">
            <img 
              src={displayImageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={handleLocalImageError}
            />
          </div>
        </Link>
        
        <div className="flex flex-col justify-between p-3 flex-grow">
          <div>
            <h3 className="font-bold text-md text-gray-800 line-clamp-1">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                {product.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-primary font-bold">
              {formatCurrency(product.price)} <span className="text-xs font-normal">KWD</span>
            </p>
            
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition-all hover:bg-gray-200">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Default grid layout
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
        <div className="relative rounded-xl overflow-hidden shadow-sm bg-gray-100">
          <img 
            src={displayImageUrl} 
            alt={product.name} 
            className="w-full aspect-square object-cover"
            onError={handleLocalImageError}
            key={product.id} // Add key to force re-render when product changes
          />
          
          {/* Heart button with improved styling */}
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 transition-all hover:bg-white">
            <Heart className="h-4 w-4" />
          </button>
          
          {/* Quick add to cart button */}
          <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white transition-all hover:bg-blue-600">
            <ShoppingCart className="h-4 w-4" />
          </button>
          
          {/* Price overlay with enhanced design */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-3 pt-10">
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
      <h3 className="text-center font-bold text-md text-gray-800 line-clamp-2 px-1">
        {product.name}
      </h3>
    </motion.div>
  );
};

export default ProductItem;
