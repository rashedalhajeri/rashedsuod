
import React from "react";
import AllProductsSection from "./AllProductsSection";

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
  
  return (
    <>
      {Object.entries(sectionProducts).map(([sectionName, products]) => (
        <div key={sectionName} className="mb-8">
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
