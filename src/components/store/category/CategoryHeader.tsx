
import React from "react";
import StoreHeader from "@/components/store/unified/StoreHeader";

interface CategoryHeaderProps {
  headerTitle: string;
  storeDomain?: string;
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({ 
  headerTitle, 
  storeDomain 
}) => {
  return (
    <StoreHeader
      title={headerTitle}
      storeDomain={storeDomain}
      showBackButton={true}
    />
  );
};

export default CategoryHeader;
