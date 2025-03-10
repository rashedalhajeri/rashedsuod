
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SectionContainerProps {
  sectionProducts: {[key: string]: any[]};
  storeDomain?: string;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
  sectionProducts,
  storeDomain
}) => {
  if (Object.keys(sectionProducts).length === 0) {
    return null;
  }
  
  // أنيميشن للمنتجات
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <>
      {Object.entries(sectionProducts).map(([sectionName, products]) => (
        <div key={sectionName} className="mb-6">
          <div className="flex items-center justify-between mb-2 px-4">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-lg font-bold text-gray-800">{sectionName}</h2>
            </motion.div>
          </div>
          
          <motion.div 
            className="overflow-x-auto pb-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <div className="flex flex-nowrap gap-3 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {products.slice(0, 10).map((product) => (
                <motion.div 
                  key={product.id} 
                  className="w-[160px] min-w-[160px] md:w-full md:min-w-0"
                  variants={itemVariants}
                  whileHover={{ scale: 1.03 }}
                >
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 h-full">
                    <Link to={`/store/${storeDomain}/product/${product.id}`}>
                      <div className="aspect-square bg-gray-50 relative">
                        <img 
                          src={product.image_url || '/placeholder.svg'} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                        
                        {product.discount_price && (
                          <Badge className="absolute top-2 right-2 bg-red-500 text-xs px-1.5 py-0.5">
                            خصم
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-2">
                        <h3 className="text-xs font-medium line-clamp-1 mb-1">{product.name}</h3>
                        
                        <div className="flex items-baseline gap-1">
                          <span className="font-bold text-sm text-primary">
                            {product.discount_price ? product.discount_price : product.price} ر.س
                          </span>
                          
                          {product.discount_price && (
                            <span className="text-xs text-gray-500 line-through">
                              {product.price}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      ))}
    </>
  );
};

export default SectionContainer;
