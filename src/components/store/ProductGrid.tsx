
import React, { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProductGridProps {
  products: any[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  const { storeDomain } = useParams<{ storeDomain: string }>();
  const gridRef = useRef<HTMLDivElement>(null);
  const [realProducts, setRealProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchRealProducts = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching products:", error);
          return;
        }
        
        if (data && data.length > 0) {
          setRealProducts(data);
        }
      } catch (err) {
        console.error("Error in fetchRealProducts:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRealProducts();
  }, []);
  
  // Format currency with proper locale and format
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }).format(price);
  };
  
  // Default placeholder for products without images - black background
  const defaultPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23000000'/%3E%3C/svg%3E";
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={`loading-${index}`} className="flex flex-col">
            <div className="relative rounded-xl overflow-hidden shadow-sm bg-gray-100 w-full aspect-square animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded mt-2 w-3/4 mx-auto animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }
  
  // Use real products if available, otherwise use provided products
  const displayProducts = realProducts.length > 0 ? realProducts : products;
  
  // Show a professional empty state when no products are available
  if (displayProducts.length === 0) {
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
      className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
    >
      {displayProducts.map((product, index) => {
        const { brandName, brandLogo } = getBrandInfo(product.id);
        const productPrice = formatCurrency(product.price);
        
        // Generate vehicle model number based on product id
        const modelNumber = product.id.length > 5 ? "CX-30" : "CX-90";
        
        return (
          <motion.div
            key={product.id}
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
                  alt={product.name || `${brandName} ${modelNumber}`} 
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
                        {productPrice} <span className="text-xs font-normal">KWD</span>
                      </p>
                    </div>
                    
                    {/* Brand info at bottom right */}
                    <div className="flex items-center">
                      <span className="text-white mr-2 text-sm">{brandName}</span>
                      <div className="w-7 h-7 rounded-full bg-white overflow-hidden flex items-center justify-center">
                        <img 
                          src={brandLogo} 
                          alt={brandName} 
                          className="h-5 w-5 object-contain"
                          onError={(e) => {
                            // Fallback if brand logo fails to load
                            (e.target as HTMLImageElement).src = defaultPlaceholder;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            
            {/* Product name with improved typography */}
            <h3 className="text-center font-bold text-md text-gray-800 line-clamp-1">
              {product.name || `${brandName} ${modelNumber}`}
            </h3>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
