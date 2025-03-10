import React, { useState } from "react";
import { Product } from "@/utils/products/types";
import ProductsList from "./ProductsList";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import BulkActionsBar from "./bulk-actions/BulkActionsBar";
import ProductsPagination from "./pagination/ProductsPagination";
import ChangeCategoryDialog from "./bulk-actions/ChangeCategoryDialog";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-media-query";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";

interface ProductsContentProps {
  products: Product[];
  selectedItems: string[];
  searchTerm: string;
  onEdit: (id: string) => void;
  onSelectionChange: (items: string[]) => void;
  onSearch: (term: string) => void;
  onDelete: (id: string) => Promise<void>;
  onActivate?: (id: string, isActive: boolean) => Promise<void>;
  onRefresh?: () => void;
  onActionClick: (product: Product) => void;
}

const ProductsContent: React.FC<ProductsContentProps> = ({
  products,
  selectedItems,
  searchTerm,
  onEdit,
  onSelectionChange,
  onSearch,
  onDelete,
  onActivate,
  onRefresh,
  onActionClick
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useIsMobile();
  const getItemsPerPage = () => {
    if (isMobile) return 10;
    return 20;
  };
  const itemsPerPage = getItemsPerPage();
  
  const [showBulkActivateConfirm, setShowBulkActivateConfirm] = useState(false);
  const [bulkActivateStatus, setBulkActivateStatus] = useState(false);
  const [showChangeCategoryDialog, setShowChangeCategoryDialog] = useState(false);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null);
  const [deleteProductName, setDeleteProductName] = useState<string>("");
  
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    onSelectionChange([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBulkActivateClick = (setActive: boolean) => {
    if (selectedItems.length === 0) return;
    setBulkActivateStatus(setActive);
    setShowBulkActivateConfirm(true);
  };
  
  const confirmBulkActivate = async () => {
    if (!onActivate) return;
    
    setIsBulkProcessing(true);
    try {
      await Promise.all(
        selectedItems.map(id => onActivate(id, bulkActivateStatus))
      );
      
      toast.success(
        bulkActivateStatus 
          ? `تم تفعيل ${selectedItems.length} منتج بنجاح`
          : `تم تعطيل ${selectedItems.length} منتج بنجاح`
      );
      
      onSelectionChange([]);
      
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error(`حدث خطأ: ${(error as Error).message}`);
    } finally {
      setIsBulkProcessing(false);
      setShowBulkActivateConfirm(false);
    }
  };

  const handleChangeCategoryClick = () => {
    if (selectedItems.length === 0) return;
    setShowChangeCategoryDialog(true);
  };
  
  const handleCategoryDialogClose = (open: boolean) => {
    setShowChangeCategoryDialog(open);
  };
  
  const handleOpenDeleteDialog = (product: Product) => {
    setDeleteProductId(product.id);
    setDeleteProductName(product.name);
  };
  
  const handleDeleteProduct = async () => {
    if (!deleteProductId) return;
    
    try {
      await onDelete(deleteProductId);
      toast.success(`تم حذف المنتج "${deleteProductName}" بنجاح`);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error(`فشل حذف المنتج: ${(error as Error).message}`);
    } finally {
      setDeleteProductId(null);
      setDeleteProductName("");
    }
  };
  
  return (
    <div className="space-y-4">
      {selectedItems.length > 0 && (
        <BulkActionsBar 
          selectedItemsCount={selectedItems.length}
          onActivate={() => handleBulkActivateClick(true)}
          onDeactivate={() => handleBulkActivateClick(false)}
          onChangeCategory={handleChangeCategoryClick}
        />
      )}
      
      <ProductsList 
        products={paginatedProducts}
        onEdit={onEdit}
        onSelectionChange={onSelectionChange}
        searchTerm={searchTerm}
        onSearch={onSearch}
        onDelete={handleOpenDeleteDialog}
        onActivate={onActivate}
        onRefresh={onRefresh}
        onActionClick={onActionClick}
      />
      
      {totalPages > 1 && (
        <div className={isMobile ? "mt-4" : "mt-6"}>
          <ProductsPagination 
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      
      <ConfirmDialog
        open={showBulkActivateConfirm}
        onOpenChange={(open) => {
          if (!isBulkProcessing) {
            setShowBulkActivateConfirm(open);
          }
        }}
        title={bulkActivateStatus ? "تأكيد تفعيل المنتجات" : "تأكيد تعطيل المنتجات"}
        description={
          <div className="text-center">
            <p>هل أنت متأكد من رغبتك في {bulkActivateStatus ? "تفعيل" : "تعطيل"}</p>
            <p className="font-bold mt-1 text-black">{selectedItems.length} منتج؟</p>
          </div>
        }
        confirmText={isBulkProcessing ? (bulkActivateStatus ? "جاري التفعيل..." : "جاري التعطيل...") : (bulkActivateStatus ? "تفعيل" : "تعطيل")}
        cancelText="إلغاء"
        onConfirm={confirmBulkActivate}
        confirmButtonProps={{ 
          variant: bulkActivateStatus ? "default" : "outline",
          className: bulkActivateStatus 
            ? "bg-green-500 hover:bg-green-600" 
            : "text-gray-600 border-gray-200 hover:bg-gray-50",
          disabled: isBulkProcessing
        }}
        variant={bulkActivateStatus ? "info" : "warning"}
      />

      <ChangeCategoryDialog
        open={showChangeCategoryDialog}
        onOpenChange={handleCategoryDialogClose}
        selectedProducts={selectedItems}
        storeId={products[0]?.store_id}
        onSuccess={() => {
          if (onRefresh) onRefresh();
          onSelectionChange([]);
        }}
      />
      
      <DeleteConfirmDialog
        open={!!deleteProductId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteProductId(null);
            setDeleteProductName("");
          }
        }}
        title="تأكيد حذف المنتج"
        description={
          <div className="text-center">
            <p>هل أنت متأكد من رغبتك في حذف المنتج:</p>
            <p className="font-bold mt-1 text-black">{deleteProductName}؟</p>
            <p className="mt-2 text-sm">لا يمكن التراجع عن هذا الإجراء.</p>
          </div>
        }
        onDelete={handleDeleteProduct}
        itemName={deleteProductName}
        itemType="منتج"
      />
    </div>
  );
};

export default ProductsContent;
