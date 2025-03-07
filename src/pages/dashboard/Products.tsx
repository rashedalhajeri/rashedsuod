
import React, { useState } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import { useProducts } from "@/hooks/use-products";
import ProductDetailDialog from "@/components/product/ProductDetailDialog";
import ProductFormDialog from "@/components/product/ProductFormDialog";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProductsHeader from "@/components/product/ProductsHeader";
import ProductsContent from "@/components/product/ProductsContent";

const Products = () => {
  const { data: storeData, isLoading: loadingStore } = useStoreData();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const {
    products,
    filteredProducts,
    isLoading,
    error,
    searchTerm,
    selectedItems,
    isRefreshing,
    archivedCount,
    inactiveCount,
    handleSearch,
    handleSelectionChange,
    handleProductUpdate,
    handleArchiveProduct,
    handleActivateProduct,
    refetch
  } = useProducts(storeData?.id);

  const handleEditProduct = (productId: string) => {
    setSelectedProductId(productId);
    setIsEditDialogOpen(true);
  };

  if (loadingStore || isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="جاري تحميل المنتجات..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <ErrorState 
          title="خطأ في تحميل المنتجات"
          message={(error as Error).message}
          onRetry={refetch}
        />
      </DashboardLayout>
    );
  }

  if (products?.length === 0) {
    return (
      <DashboardLayout>
        <ProductEmptyState 
          onAddProduct={() => setIsAddProductOpen(true)} 
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container dashboard-container mx-auto py-5 sm:py-6 px-3 sm:px-4" dir="rtl">
        <ProductsHeader 
          archivedCount={archivedCount}
          inactiveCount={inactiveCount}
          totalProducts={products.length}
          isRefreshing={isRefreshing}
          onRefresh={handleProductUpdate}
          onAddProduct={() => setIsAddProductOpen(true)}
        />

        <ProductsContent 
          products={filteredProducts}
          selectedItems={selectedItems}
          searchTerm={searchTerm}
          onEdit={handleEditProduct}
          onSelectionChange={handleSelectionChange}
          onSearch={handleSearch}
          onArchive={handleArchiveProduct}
          onActivate={handleActivateProduct}
          onRefresh={handleProductUpdate}
        />

        <ProductFormDialog
          isOpen={isAddProductOpen}
          onOpenChange={setIsAddProductOpen}
          storeId={storeData?.id}
          onAddSuccess={handleProductUpdate}
        />

        {isEditDialogOpen && (
          <ProductDetailDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            productId={selectedProductId}
            storeData={storeData}
            onSuccess={handleProductUpdate}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
