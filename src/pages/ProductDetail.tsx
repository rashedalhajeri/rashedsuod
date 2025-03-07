
import React from "react";
import { useParams } from "react-router-dom";
import ProductBasicInfo from "@/components/product/form/ProductBasicInfo";
import ProductAdvancedInfo from "@/components/product/form/ProductAdvancedInfo";
import ProductPreview from "@/components/product/form/ProductPreview";
import { useProductForm } from "@/components/product/form/useProductForm";
import { useProductData } from "@/hooks/useProductData";
import { useProductOperations } from "@/hooks/useProductOperations";
import { useProductCategories } from "@/hooks/useProductCategories";
import ProductDetailLayout from "@/components/product/detail/ProductDetailLayout";

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  
  // Get product data
  const { productData, isLoading, error, isNewProduct, storeData } = useProductData();
  
  // Get categories
  const { categories } = useProductCategories(storeData?.id);
  
  // Initialize form with product data
  const {
    formData,
    handleInputChange,
    handleSwitchChange,
    handleImagesChange,
    handleColorsChange,
    handleSizesChange,
    handleCategoryChange,
    toggleDiscount,
    isFormValid
  } = useProductForm(productData);

  // Operations (save, delete)
  const {
    isSaving,
    handleSave,
    handleDelete,
    isNewProduct: isNewProductOp
  } = useProductOperations(productId, storeData?.id, formData, isFormValid);

  const pageTitle = isNewProduct ? "إضافة منتج جديد" : "تعديل المنتج";

  return (
    <ProductDetailLayout
      isLoading={isLoading}
      error={error}
      isNewProduct={isNewProduct}
      pageTitle={pageTitle}
      isSaving={isSaving}
      onSave={handleSave}
      onDelete={handleDelete}
    >
      <ProductBasicInfo
        name={formData.name}
        description={formData.description}
        price={formData.price}
        discount_price={formData.discount_price}
        images={formData.images}
        storeId={storeData?.id}
        handleChange={handleInputChange}
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
            handleChange={handleInputChange}
            handleSwitchChange={handleSwitchChange}
            handleCategoryChange={handleCategoryChange}
            handleColorsChange={handleColorsChange}
            handleSizesChange={handleSizesChange}
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
    </ProductDetailLayout>
  );
};

export default ProductDetail;
