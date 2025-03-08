
import React, { useState } from "react";
import { Product } from "@/utils/products/types";
import ProductsList from "./ProductsList";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import BulkActionsBar from "./bulk-actions/BulkActionsBar";
import ProductsPagination from "./pagination/ProductsPagination";
import ChangeCategoryDialog from "./bulk-actions/ChangeCategoryDialog";

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
  onRefresh
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30; // Display 30 products per page
  
  // Bulk action states
  const [showBulkActivateConfirm, setShowBulkActivateConfirm] = useState(false);
  const [bulkActivateStatus, setBulkActivateStatus] = useState(false);
  const [showChangeCategoryDialog, setShowChangeCategoryDialog] = useState(false);
  
  // Calculate pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset selected items when changing page
    onSelectionChange([]);
  };
  
  // Handle bulk activate/deactivate confirmation
  const handleBulkActivateClick = (setActive: boolean) => {
    if (selectedItems.length === 0) return;
    setBulkActivateStatus(setActive);
    setShowBulkActivateConfirm(true);
  };
  
  const confirmBulkActivate = async () => {
    if (!onActivate) return;
    
    // Apply activation status to each selected product
    await Promise.all(
      selectedItems.map(id => onActivate(id, bulkActivateStatus))
    );
    
    // Reset selection
    onSelectionChange([]);
    setShowBulkActivateConfirm(false);
  };

  // Handle bulk category change
  const handleChangeCategoryClick = () => {
    if (selectedItems.length === 0) return;
    setShowChangeCategoryDialog(true);
  };
  
  return (
    <div className="bg-gray-50 rounded-lg p-2">
      {/* Show bulk actions if items are selected */}
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
        onDelete={onDelete}
        onActivate={onActivate}
        onRefresh={onRefresh}
      />
      
      {/* Pagination control */}
      {totalPages > 1 && (
        <ProductsPagination 
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
      
      {/* Bulk Activate/Deactivate Confirmation Dialog */}
      <ConfirmDialog
        open={showBulkActivateConfirm}
        onOpenChange={setShowBulkActivateConfirm}
        title={bulkActivateStatus ? "تأكيد تفعيل المنتجات" : "تأكيد تعطيل المنتجات"}
        description={
          bulkActivateStatus
            ? `هل أنت متأكد من رغبتك في تفعيل ${selectedItems.length} منتج؟`
            : `هل أنت متأكد من رغبتك في تعطيل ${selectedItems.length} منتج؟`
        }
        confirmText={bulkActivateStatus ? "تفعيل" : "تعطيل"}
        cancelText="إلغاء"
        onConfirm={confirmBulkActivate}
        confirmButtonProps={{ 
          variant: bulkActivateStatus ? "default" : "outline",
          className: bulkActivateStatus 
            ? "bg-green-500 hover:bg-green-600" 
            : "text-gray-600 border-gray-200 hover:bg-gray-50"
        }}
      />

      {/* Change Category Dialog */}
      <ChangeCategoryDialog
        open={showChangeCategoryDialog}
        onOpenChange={setShowChangeCategoryDialog}
        selectedProducts={selectedItems}
        storeId={products[0]?.store_id}
        onSuccess={onRefresh || (() => {})}
      />
    </div>
  );
};

export default ProductsContent;
