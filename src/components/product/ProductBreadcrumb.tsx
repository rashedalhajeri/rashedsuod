
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  storeDomain: string;
}

const ProductBreadcrumb: React.FC<ProductBreadcrumbProps> = ({ storeDomain }) => {
  return (
    <div className="mb-6">
      <Link to={`/store/${storeDomain}`} className="flex items-center text-sm text-primary hover:underline">
        <ChevronRight className="h-4 w-4 ml-1" />
        <span>العودة للمتجر</span>
      </Link>
    </div>
  );
};

export default ProductBreadcrumb;
