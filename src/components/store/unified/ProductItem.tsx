
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, BadgePercent } from "lucide-react";
import { motion } from "framer-motion";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

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
  
  // Use the currency formatter from useStoreData
  const formatCurrency = getCurrencyFormatter();
  
  // Default placeholder for products without images
  const defaultPlaceholder = "/placeholder.svg";
  
  // Determine which image URL to use
  const displayImageUrl = imageError || !product.image_url ? defaultPlaceholder : product.image_url;
  
  const handleImageError = () => {
    console.log("Product image failed to load:", product.image_url);
    setImageError(true);
  };

  // Calculate discount percentage if there's a discount
  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discount_price) / product.price) * 100) 
    : 0;
  
  // If in list mode, use a different layout
  if (displayStyle === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="flex bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
      >
        <Link 
          to={`/store/${storeDomain}/product/${product.id}`}
          className="relative block"
          style={{ width: '120px', minHeight: '120px' }}
        >
          <div className="relative overflow-hidden bg-gray-100 h-full">
            <img 
              src={displayImageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
            
            {/* Discount badge */}
            {hasDiscount && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
                <BadgePercent className="h-3 w-3" />
                <span>خصم {discountPercentage}%</span>
              </div>
            )}
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
            <div className="flex items-center gap-2">
              {hasDiscount ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-red-600 font-bold">{formatCurrency(product.discount_price)}</span>
                  <span className="text-gray-400 text-xs line-through">{formatCurrency(product.price)}</span>
                </div>
              ) : (
                <span className="text-primary font-bold">{formatCurrency(product.price)}</span>
              )}
            </div>
            
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 transition-all hover:bg-gray-200">
                <Heart className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white transition-all hover:bg-primary/90">
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Default grid layout with enhanced design
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex flex-col rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
    >
      <Link 
        to={`/store/${storeDomain}/product/${product.id}`}
        className="relative block"
      >
        <div className="relative overflow-hidden bg-gray-100">
          <img 
            src={displayImageUrl} 
            alt={product.name} 
            className="w-full aspect-square object-cover transition duration-300 hover:scale-105"
            onError={handleImageError}
            key={product.id}
          />
          
          {/* Heart button with improved styling */}
          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-700 transition-all hover:bg-white hover:text-rose-500">
            <Heart className="h-4 w-4" />
          </button>
          
          {/* Quick add to cart button */}
          <button className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white transition-all hover:bg-primary/90 shadow-sm">
            <ShoppingCart className="h-4 w-4" />
          </button>
          
          {/* If there's a discount, show discount badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <BadgePercent className="h-3 w-3" />
              <span>خصم {discountPercentage}%</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-3 bg-white">
        {/* Product name with improved typography */}
        <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1 leading-tight">
          {product.name}
        </h3>
        
        {/* Price with discount display */}
        <div className="flex items-center mt-1">
          {hasDiscount ? (
            <>
              <span className="font-bold text-red-600">{formatCurrency(product.discount_price)}</span>
              <span className="text-gray-400 text-xs line-through mr-2">{formatCurrency(product.price)}</span>
            </>
          ) : (
            <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductItem;
