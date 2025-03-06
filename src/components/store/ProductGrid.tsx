
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductGridProps {
  products: any[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Format currency with proper locale and format
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(price);
  };
  
  // Show a professional empty state when no products are available
  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm">
        <p className="text-gray-800 font-medium text-lg mb-2">لا توجد منتجات متاحة حالياً</p>
        <p className="text-sm text-gray-500">يمكنك العودة لاحقاً للاطلاع على المنتجات الجديدة</p>
      </div>
    );
  }
  
  // Brand information
  const getBrandInfo = (productId: string) => {
    const id = parseInt(productId);
    
    // Brand name based on product ID
    const brandName = id % 3 === 0 ? "مازدا" : 
                     id % 3 === 1 ? "مازدا" : 
                     "مازدا";
    
    // Brand logo
    const brandLogo = "/public/lovable-uploads/9bdce759-607e-417a-b056-f23d54b1d8f3.png";
      
    return { brandName, brandLogo };
  };
  
  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-2 gap-4"
    >
      {products.map((product, index) => {
        const { brandName, brandLogo } = getBrandInfo(product.id);
        const productPrice = formatCurrency(product.price);
        
        // Generate vehicle model number based on product id
        const modelNumber = product.id % 2 === 0 ? "CX-30" : "CX-90";
        
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="flex flex-col"
          >
            <Link 
              to={`/store/${storeDomain}/product/${product.id}`}
              className="relative block mb-2"
            >
              <div className="relative rounded-xl overflow-hidden shadow-sm">
                <img 
                  src={product.image_url || "/placeholder.svg"} 
                  alt={product.name} 
                  className="w-full aspect-square object-cover"
                />
                
                {/* Heart button */}
                <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-gray-600/60 flex items-center justify-center text-white">
                  <Heart className="h-5 w-5" />
                </button>
                
                {/* Price overlaid on the bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-xl font-bold">
                        {productPrice} <span className="text-sm">KWD</span>
                      </p>
                    </div>
                    
                    {/* Brand info at bottom right */}
                    <div className="flex items-center">
                      <span className="text-white mr-2">{brandName}</span>
                      <div className="w-8 h-8 rounded-full bg-white overflow-hidden flex items-center justify-center">
                        <img 
                          src={brandLogo} 
                          alt={brandName} 
                          className="h-6 w-6 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Product name below the image */}
            <h3 className="text-center font-bold text-lg text-gray-800">
              {brandName} {modelNumber}
            </h3>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
