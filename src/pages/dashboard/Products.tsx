
import React, { useState } from "react";
import { useStoreData } from "@/hooks/use-store-data";
import { useProducts } from "@/hooks/use-products";
import ProductActionDrawer from "@/components/product/ProductActionDrawer";
import ProductFormDialog from "@/components/product/ProductFormDialog";
import { ProductEmptyState } from "@/components/product/ProductEmptyState";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProductsHeader from "@/components/product/ProductsHeader";
import ProductsContent from "@/components/product/ProductsContent";
import { toast } from "sonner";
import { useIsMobile, useIsTablet } from "@/hooks/use-media-query";

const Products = () => {
  const { data: storeData, isLoading: loadingStore } = useStoreData();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  const {
    products,
    filteredProducts,
    isLoading,
    error,
    searchTerm,
    selectedItems,
    isRefreshing,
    inactiveCount,
    handleSearch,
    handleSelectionChange,
    handleProductUpdate,
    handleDeleteProduct,
    handleActivateProduct,
    refetch
  } = useProducts(storeData?.id);

  const handleEditProduct = (productId: string) => {
    // Close the action dialog if open
    setIsActionDialogOpen(false);
    
    // Find the product to edit
    const productToEdit = products.find(p => p.id === productId);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsEditDialogOpen(true);
    } else {
      toast.error("لم يتم العثور على المنتج");
    }
  };

  const handleOpenActionDrawer = (product: any) => {
    setSelectedProduct(product);
    setIsActionDialogOpen(true);
  };

  const handleBulkAction = async (productIds: string[], action: (id: string) => Promise<void>) => {
    if (productIds.length === 0) return;
    
    try {
      await Promise.all(productIds.map(id => action(id)));
      handleProductUpdate();
      toast.success(`تم تحديث ${productIds.length} منتج`);
    } catch (error) {
      toast.error("خطأ في تنفيذ العملية: " + (error as Error).message);
    }
  };

  // رسالة التحميل المتجاوبة
  if (loadingStore || isLoading) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-200px)] flex items-center justify-center">
          <LoadingState message="جاري تحميل المنتجات..." />
        </div>
      </DashboardLayout>
    );
  }

  // رسالة الخطأ المتجاوبة
  if (error) {
    return (
      <DashboardLayout>
        <div className="h-[calc(100vh-200px)] flex items-center justify-center p-4">
          <ErrorState 
            title="خطأ في تحميل المنتجات"
            message={(error as Error).message}
            onRetry={refetch}
          />
        </div>
      </DashboardLayout>
    );
  }

  // حالة عدم وجود منتجات
  if (products?.length === 0) {
    return (
      <DashboardLayout>
        <div className={`h-[calc(100vh-200px)] flex items-center justify-center ${isMobile ? 'p-4' : 'p-6'}`}>
          <ProductEmptyState 
            onAddProduct={() => setIsAddProductOpen(true)} 
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className={`container mx-auto ${isMobile ? 'py-3 px-2' : isTablet ? 'py-4 px-3' : 'py-6 px-4'} max-w-6xl`} dir="rtl">
        <ProductsHeader 
          inactiveCount={inactiveCount}
          totalProducts={products.length}
          isRefreshing={isRefreshing}
          onRefresh={handleProductUpdate}
          onAddProduct={() => setIsAddProductOpen(true)}
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />

        <div className={`${isMobile ? 'mt-3' : 'mt-5'}`}>
          <ProductsContent 
            products={filteredProducts}
            selectedItems={selectedItems}
            searchTerm={searchTerm}
            onEdit={handleEditProduct}
            onSelectionChange={handleSelectionChange}
            onSearch={handleSearch}
            onDelete={handleDeleteProduct}
            onActivate={handleActivateProduct}
            onRefresh={handleProductUpdate}
            onActionClick={handleOpenActionDrawer}
          />
        </div>

        {/* Add Product Dialog */}
        <ProductFormDialog
          isOpen={isAddProductOpen}
          onOpenChange={setIsAddProductOpen}
          storeId={storeData?.id}
          onAddSuccess={handleProductUpdate}
        />

        {/* Edit Product Dialog */}
        <ProductFormDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          storeId={storeData?.id}
          onAddSuccess={handleProductUpdate}
          editProduct={editingProduct}
          isEditMode={true}
        />

        {selectedProduct && (
          <ProductActionDrawer
            isOpen={isActionDialogOpen}
            onOpenChange={setIsActionDialogOpen}
            product={selectedProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onActivate={handleActivateProduct}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Products;
