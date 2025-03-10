
import React from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Award, ShoppingBag, Star, BadgePercent, 
  PackageSearch, TrendingUp, ChevronLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import ProductGrid from "@/components/store/ProductGrid";

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
      return <Award className="h-4 w-4 ml-1.5" />;
    } else if (name.includes('وصل حديثاً') || name.includes('وصل حديثا')) {
      return <ShoppingBag className="h-4 w-4 ml-1.5" />;
    } else if (name.includes('مميزة') || name.includes('مميز')) {
      return <Star className="h-4 w-4 ml-1.5" />;
    } else if (name.includes('تخفيضات') || name.includes('خصم')) {
      return <BadgePercent className="h-4 w-4 ml-1.5" />;
    } else if (name.includes('جميع المنتجات') || name.includes('كل المنتجات')) {
      return <PackageSearch className="h-4 w-4 ml-1.5" />;
    } else if (name.includes('الأكثر رواجاً') || name.includes('رواجا')) {
      return <TrendingUp className="h-4 w-4 ml-1.5" />;
    } else {
      return <PackageSearch className="h-4 w-4 ml-1.5" />;
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
            <div className="flex items-center">
              {getSectionIcon(sectionName)}
              <h2 className="text-xl font-bold text-gray-800">{sectionName}</h2>
            </div>
            
            {storeDomain && (
              <Link 
                to={`/store/${storeDomain}/section/${encodeURIComponent(sectionName)}`}
                className="text-primary text-sm font-medium flex items-center"
              >
                مشاهدة الكل <ChevronLeft size={16} />
              </Link>
            )}
          </div>
          
          <p className="text-sm text-gray-500 mb-3 px-4">{getSectionDescription(sectionName)}</p>
          
          <div className="overflow-x-auto pb-4">
            <div className="flex flex-nowrap gap-4 px-4 md:grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {products.slice(0, 10).map(product => (
                <div 
                  key={product.id} 
                  className="w-[170px] min-w-[170px] md:w-full md:min-w-0"
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
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SectionContainer;
