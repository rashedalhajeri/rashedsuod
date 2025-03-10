
import React from "react";
import AllProductsSection from "./AllProductsSection";
import { Badge } from "@/components/ui/badge";
import { 
  Award, ShoppingBag, Star, BadgePercent, 
  PackageSearch, TagIcon, Gift
} from "lucide-react";

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
    } else if (name.includes('فئة') || name.includes('تصنيف')) {
      return <TagIcon className="h-4 w-4 ml-1.5" />;
    } else {
      return <Gift className="h-4 w-4 ml-1.5" />;
    }
  };
  
  return (
    <>
      {Object.entries(sectionProducts).map(([sectionName, products]) => (
        <div key={sectionName} className="mb-8">
          <div className="flex items-center mb-2">
            {getSectionIcon(sectionName)}
            <h2 className="text-xl font-bold">{sectionName}</h2>
          </div>
          <AllProductsSection 
            products={products}
            sectionTitle={sectionName}
            storeDomain={storeDomain}
          />
        </div>
      ))}
    </>
  );
};

export default SectionContainer;
