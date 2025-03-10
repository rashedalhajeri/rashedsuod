
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Award, ShoppingBag, Star, BadgePercent, 
  PackageSearch, TrendingUp, ChevronLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductGrid from "@/components/store/ProductGrid";
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
  
  // Helper to get an icon for the section title based on section name
  const getSectionIcon = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    
    if (name.includes('الأكثر مبيعاً') || name.includes('الاكثر مبيعا')) {
      return <Award className="h-5 w-5 ml-2" />;
    } else if (name.includes('وصل حديثاً') || name.includes('وصل حديثا')) {
      return <ShoppingBag className="h-5 w-5 ml-2" />;
    } else if (name.includes('مميزة') || name.includes('مميز')) {
      return <Star className="h-5 w-5 ml-2" />;
    } else if (name.includes('تخفيضات') || name.includes('خصم')) {
      return <BadgePercent className="h-5 w-5 ml-2" />;
    } else if (name.includes('جميع المنتجات') || name.includes('كل المنتجات')) {
      return <PackageSearch className="h-5 w-5 ml-2" />;
    } else if (name.includes('الأكثر رواجاً') || name.includes('رواجا')) {
      return <TrendingUp className="h-5 w-5 ml-2" />;
    } else {
      return <PackageSearch className="h-5 w-5 ml-2" />;
    }
  };

  // Helper to get a color for the section icon based on section name
  const getSectionColor = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    
    if (name.includes('الأكثر مبيعاً') || name.includes('الاكثر مبيعا')) {
      return "bg-emerald-500";
    } else if (name.includes('وصل حديثاً') || name.includes('وصل حديثا')) {
      return "bg-blue-500";
    } else if (name.includes('مميزة') || name.includes('مميز')) {
      return "bg-amber-500";
    } else if (name.includes('تخفيضات') || name.includes('خصم')) {
      return "bg-rose-500";
    } else if (name.includes('جميع المنتجات') || name.includes('كل المنتجات')) {
      return "bg-gray-500";
    } else if (name.includes('الأكثر رواجاً') || name.includes('رواجا')) {
      return "bg-indigo-500";
    } else {
      return "bg-primary";
    }
  };

  // Helper to get a description for each section type
  const getSectionDescription = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    
    if (name.includes('الأكثر مبيعاً') || name.includes('الاكثر مبيعا')) {
      return 'المنتجات الأكثر شراءاً من قبل عملائنا';
    } else if (name.includes('وصل حديثاً') || name.includes('وصل حديثا')) {
      return 'أحدث المنتجات التي تمت إضافتها للمتجر';
    } else if (name.includes('مميزة') || name.includes('مميز')) {
      return 'منتجات مختارة بعناية لتناسب احتياجاتك';
    } else if (name.includes('تخفيضات') || name.includes('خصم')) {
      return 'عروض وتخفيضات حصرية على منتجات مميزة';
    } else if (name.includes('جميع المنتجات') || name.includes('كل المنتجات')) {
      return 'جميع المنتجات المتوفرة في المتجر';
    } else if (name.includes('الأكثر رواجاً') || name.includes('رواجا')) {
      return 'المنتجات الأكثر شعبية ومشاهدة من قبل العملاء';
    } else {
      return 'منتجات متنوعة لتلبية احتياجاتك';
    }
  };
  
  return (
    <>
      {Object.entries(sectionProducts).map(([sectionName, products]) => (
        <div key={sectionName} className="mb-8">
          <div className="flex items-center justify-between mb-2 px-4">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className={`${getSectionColor(sectionName)} p-2 rounded-full text-white flex items-center justify-center mr-2`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  duration: 1 
                }}
              >
                {getSectionIcon(sectionName)}
              </motion.div>
              <motion.h2 
                className="text-xl font-bold text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {sectionName}
              </motion.h2>
            </motion.div>
            
            {storeDomain && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Link 
                  to={`/store/${storeDomain}/section/${encodeURIComponent(sectionName)}`}
                  className="text-primary text-sm font-medium flex items-center hover:underline"
                >
                  مشاهدة الكل <ChevronLeft size={16} />
                </Link>
              </motion.div>
            )}
          </div>
          
          <motion.p 
            className="text-sm text-gray-500 mb-3 px-4"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {getSectionDescription(sectionName)}
          </motion.p>
          
          <div className="overflow-x-auto pb-4">
            <div className="flex flex-nowrap gap-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {products.slice(0, 10).map((product, index) => (
                <motion.div 
                  key={product.id} 
                  className="w-[170px] min-w-[170px] md:w-full md:min-w-0"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.3 }}
                  whileHover={{ 
                    scale: 1.03, 
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                  }}
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
                          <Badge className="absolute top-2 right-2 bg-red-500">
                            خصم
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-3">
                        <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
                        
                        <div className="mt-2 flex items-baseline gap-2">
                          <span className="font-bold text-primary">
                            {product.discount_price ? product.discount_price : product.price} ر.س
                          </span>
                          
                          {product.discount_price && (
                            <span className="text-xs text-gray-500 line-through">
                              {product.price} ر.س
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SectionContainer;
