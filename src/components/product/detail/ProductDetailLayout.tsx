
import React, { ReactNode } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import ProductDetailHeader from "./ProductDetailHeader";

interface ProductDetailLayoutProps {
  children: ReactNode;
  isLoading: boolean;
  error: any;
  isNewProduct: boolean;
  pageTitle: string;
  isSaving: boolean;
  onSave: () => void;
  onDelete: () => void;
}

const ProductDetailLayout: React.FC<ProductDetailLayoutProps> = ({
  children,
  isLoading,
  error,
  isNewProduct,
  pageTitle,
  isSaving,
  onSave,
  onDelete
}) => {
  if (isLoading) {
    return <LoadingState message="جاري تحميل بيانات المنتج..." />;
  }

  if (error && !isNewProduct) {
    return (
      <ErrorState 
        title="خطأ في تحميل المنتج"
        message={error.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <ProductDetailHeader
        pageTitle={pageTitle}
        isNewProduct={isNewProduct}
        isSaving={isSaving}
        onSave={onSave}
        onDelete={onDelete}
      />
      {children}
    </div>
  );
};

export default ProductDetailLayout;
