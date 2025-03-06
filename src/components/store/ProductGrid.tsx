
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Loader2 } from "lucide-react";
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
      <div className="text-center py-16 bg-gradient-to-b from-gray-50 to-white rounded-lg border border-gray-100 shadow-sm">
        <div className="max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
          <p className="text-gray-800 font-medium text-lg mb-2">لا توجد منتجات متاحة حالياً</p>
          <p className="text-sm text-gray-500">يمكنك العودة لاحقاً للاطلاع على المنتجات الجديدة</p>
        </div>
      </div>
    );
  }
  
  // Generate random brand logos and names for demo
  const getBrandInfo = (productId: string) => {
    const id = parseInt(productId);
    
    // Brand name based on product ID
    const brandName = id % 3 === 0 ? "توني فايف" : 
                     id % 3 === 1 ? "شركة جينيريشن" : 
                     "جنرال للالكترونيات";
    
    // Brand logo
    const brandLogo = id % 3 === 0 ? 
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%2345b7e8' stroke-width='0'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' font-family='Arial' font-size='11' fill='white' text-anchor='middle'%3ETF%3C/text%3E%3C/svg%3E" : 
      id % 3 === 1 ? 
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%23e83845' stroke-width='0'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' font-family='Arial' font-size='11' fill='white' text-anchor='middle'%3E3R%3C/text%3E%3C/svg%3E" :
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 24 24' fill='%23333' stroke-width='0'%3E%3Ccircle cx='12' cy='12' r='10'/%3E%3Ctext x='12' y='16' font-family='Arial' font-size='11' fill='white' text-anchor='middle'%3EG%3C/text%3E%3C/svg%3E";
      
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
        
        return (
          <Link 
            key={product.id} 
            to={`/store/${storeDomain}/product/${product.id}`}
            className="block"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm relative"
            >
              {/* Product Image with heart button */}
              <div className="relative">
                <img 
                  src={product.image_url || "/placeholder.svg"} 
                  alt={product.name} 
                  className="w-full aspect-square object-cover"
                />
                <button className="absolute top-2 right-2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:text-rose-500 transition-colors">
                  <Heart className="h-5 w-5" />
                </button>
              </div>
              
              {/* Price overlay on the image */}
              <div className="absolute bottom-[100px] left-4 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
                <p className="text-white font-bold text-lg flex items-center">
                  {productPrice}
                  <span className="text-sm ml-1">KWD</span>
                </p>
              </div>
              
              {/* Product details */}
              <div className="p-4">
                {/* Brand info */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-800 font-medium">
                    {brandName}
                  </p>
                  <div className="h-7 w-7 rounded-full overflow-hidden">
                    <img 
                      src={brandLogo} 
                      alt="Brand" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                
                {/* Product name */}
                <h3 className="text-right font-bold text-lg text-gray-800 line-clamp-2">
                  {product.name.length > 40 
                    ? product.name.substring(0, 40) + "..." 
                    : product.name}
                </h3>
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
