
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import StorefrontLayout from "@/layouts/StorefrontLayout";
import ProductGallery from "@/features/store/product-detail/ProductGallery";
import ProductInformation from "@/features/store/product-detail/ProductInformation";
import QuantitySelector from "@/features/store/product-detail/QuantitySelector";
import ProductActions from "@/features/store/product-detail/ProductActions";
import { useProductDetail } from "@/features/store/product-detail/useProductDetail";

const StoreProductDetail: React.FC = () => {
  const {
    storeId,
    product,
    loading,
    error,
    quantity,
    formatCurrency,
    handleQuantityChange,
    handleAddToCart,
    getAllImages
  } = useProductDetail();

  if (loading) {
    return (
      <StorefrontLayout>
        <LoadingState message="جاري تحميل المنتج..." />
      </StorefrontLayout>
    );
  }

  if (error) {
    return (
      <StorefrontLayout>
        <ErrorState 
          title="خطأ في تحميل المنتج"
          message={error}
          onRetry={() => window.location.reload()}
        />
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <ErrorState 
          title="المنتج غير موجود"
          message="لم نتمكن من العثور على المنتج المطلوب"
          onRetry={() => window.location.reload()}
        />
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Link to={`/store/${storeId}/products`} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 ml-1" />
            العودة إلى المنتجات
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProductGallery 
            mainImage={product.image_url} 
            additionalImages={product.additional_images || []} 
            productName={product.name}
          />

          <div className="space-y-6">
            <ProductInformation 
              product={product} 
              formattedPrice={formatCurrency(product.price)} 
            />

            {product.stock_quantity > 0 && (
              <div className="flex flex-col space-y-4">
                <QuantitySelector 
                  quantity={quantity}
                  maxQuantity={product.stock_quantity}
                  onQuantityChange={handleQuantityChange}
                />

                <ProductActions 
                  product={product}
                  storeId={storeId || ""}
                  quantity={quantity}
                  onAddToCart={handleAddToCart}
                />
              </div>
            )}

            {product.stock_quantity <= 0 && (
              <ProductActions 
                product={product}
                storeId={storeId || ""}
                quantity={quantity}
                onAddToCart={handleAddToCart}
              />
            )}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
};

export default StoreProductDetail;
