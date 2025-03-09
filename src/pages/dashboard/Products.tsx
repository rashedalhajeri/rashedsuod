
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
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const { data: storeData, isLoading: loadingStore } = useStoreData();
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
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
      <div className="container mx-auto py-3 sm:py-6 px-2 sm:px-4 max-w-6xl" dir="rtl">
        <ProductsHeader 
          inactiveCount={inactiveCount}
          totalProducts={products.length}
          isRefreshing={isRefreshing}
          onRefresh={handleProductUpdate}
          onAddProduct={() => setIsAddProductOpen(true)}
          searchTerm={searchTerm}
          onSearch={handleSearch}
        />

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
