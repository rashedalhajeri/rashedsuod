
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import SaveButton from "@/components/ui/save-button";
import { Percent } from "lucide-react";
import { useProductDetailForm } from "@/hooks/useProductDetailForm";
import ProductBasicInfo from "@/components/product/form/ProductBasicInfo";
import ProductAdvancedInfo from "@/components/product/form/ProductAdvancedInfo";
import ProductPreview from "@/components/product/form/ProductPreview";

const ProductDetail: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data: storeData } = useStoreData();
  
  const {
    product,
    loading,
    saving,
    error,
    formData,
    categories,
    handleChange,
    handleSwitchChange,
    handleImagesChange,
    handleCategoryChange,
    handleSave,
    handleDelete
  } = useProductDetailForm({ productId, storeData });

  // Handle discount price toggle
  const toggleDiscount = () => {
    handleSwitchChange('discount_price', formData.discount_price === null ? formData.price : null);
  };

  if (loading) {
    return <LoadingState message="جاري تحميل بيانات المنتج..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="خطأ في تحميل المنتج"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 px-4" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">تفاصيل المنتج</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/products")}>
            العودة للمنتجات
          </Button>
          <SaveButton isSaving={saving} onClick={handleSave} />
        </div>
      </div>

      <ProductBasicInfo
        name={formData.name}
        description={formData.description}
        price={formData.price}
        discount_price={formData.discount_price}
        images={formData.images}
        storeId={storeData?.id}
        handleChange={handleChange}
        handleImagesChange={handleImagesChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ProductAdvancedInfo
            category_id={formData.category_id}
            track_inventory={formData.track_inventory}
            stock_quantity={formData.stock_quantity}
            has_colors={formData.has_colors}
            has_sizes={formData.has_sizes}
            require_customer_name={formData.require_customer_name}
            require_customer_image={formData.require_customer_image}
            available_colors={formData.available_colors}
            available_sizes={formData.available_sizes}
            categories={categories}
            handleChange={handleChange}
            handleSwitchChange={handleSwitchChange}
            handleCategoryChange={handleCategoryChange}
            formData={formData}
          />
        </div>
        
        <div>
          <ProductPreview
            name={formData.name}
            price={formData.price}
            discount_price={formData.discount_price}
            description={formData.description}
            images={formData.images}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
