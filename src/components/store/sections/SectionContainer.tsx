
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Award, ShoppingBag, Star, BadgePercent, 
  PackageSearch, TrendingUp, ChevronLeft
} from "lucide-react";
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
  
  // الحصول على الأيقونة المناسبة حسب اسم القسم
  const getSectionIcon = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    
    if (name.includes('مبيعاً') || name.includes('مبيعا')) {
      return <Award className="h-5 w-5 ml-2" />;
    } else if (name.includes('حديثاً') || name.includes('حديثا') || name.includes('جديد')) {
      return <ShoppingBag className="h-5 w-5 ml-2" />;
    } else if (name.includes('مميز')) {
      return <Star className="h-5 w-5 ml-2" />;
    } else if (name.includes('تخفيض') || name.includes('خصم')) {
      return <BadgePercent className="h-5 w-5 ml-2" />;
    } else if (name.includes('منتجات')) {
      return <PackageSearch className="h-5 w-5 ml-2" />;
    } else if (name.includes('رواج')) {
      return <TrendingUp className="h-5 w-5 ml-2" />;
    } else {
      return <PackageSearch className="h-5 w-5 ml-2" />;
    }
  };

  // الحصول على اللون المناسب حسب اسم القسم
  const getSectionColor = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    
    if (name.includes('مبيعاً') || name.includes('مبيعا')) {
      return "bg-emerald-500";
    } else if (name.includes('حديثاً') || name.includes('حديثا') || name.includes('جديد')) {
      return "bg-blue-500";
    } else if (name.includes('مميز')) {
      return "bg-amber-500";
    } else if (name.includes('تخفيض') || name.includes('خصم')) {
      return "bg-rose-500";
    } else if (name.includes('منتجات')) {
      return "bg-gray-500";
    } else if (name.includes('رواج')) {
      return "bg-indigo-500";
    } else {
      return "bg-primary";
    }
  };

  // الحصول على وصف مناسب للقسم
  const getSectionDescription = (sectionName: string) => {
    const name = sectionName.toLowerCase();
    
    if (name.includes('مبيعاً') || name.includes('مبيعا')) {
      return 'الأكثر مبيعاً';
    } else if (name.includes('حديثاً') || name.includes('حديثا') || name.includes('جديد')) {
      return 'وصل حديثاً';
    } else if (name.includes('مميز')) {
      return 'منتجات مختارة بعناية';
    } else if (name.includes('تخفيض') || name.includes('خصم')) {
      return 'عروض حصرية';
    } else if (name.includes('منتجات')) {
      return 'تسوق الآن';
    } else if (name.includes('رواج')) {
      return 'الأكثر شعبية';
    } else {
      return 'اكتشف المزيد';
    }
  };
  
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
              <motion.div 
                className={`${getSectionColor(sectionName)} p-2 rounded-full text-white flex items-center justify-center mr-2`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {getSectionIcon(sectionName)}
              </motion.div>
              <h2 className="text-lg font-bold text-gray-800">{sectionName}</h2>
            </motion.div>
            
            {storeDomain && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Link 
                  to={`/store/${storeDomain}/section/${encodeURIComponent(sectionName)}`}
                  className="text-primary text-xs font-medium flex items-center hover:underline"
                >
                  {getSectionDescription(sectionName)} <ChevronLeft size={16} />
                </Link>
              </motion.div>
            )}
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
