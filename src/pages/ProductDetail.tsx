
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStoreData } from "@/hooks/use-store-data";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import SaveButton from "@/components/ui/save-button";
import { useProductDetailForm } from "@/hooks/useProductDetailForm";
import ProductBasicInfo from "@/components/product/form/ProductBasicInfo";
import ProductAdvancedInfo from "@/components/product/form/ProductAdvancedInfo";

const ProductDetail = ({ storeId }) => {
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

  // Handle discount price toggle - Fix: Pass boolean value instead of formData.discount_price
  const toggleDiscount = () => {
    handleSwitchChange('discount_price', formData.discount_price === null);
  };

  const isUpdating = !!productId; // Convert to boolean

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

      <div className="mt-6">
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
    </div>
  );
};

export default ProductDetail;
