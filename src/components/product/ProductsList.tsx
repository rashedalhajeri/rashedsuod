import React, { useState, useMemo, useEffect } from "react";
import { Product } from "@/utils/products/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductActionDrawer from "./ProductActionDrawer";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import ProductFilterBar from "./list/ProductFilterBar";
import ProductItems from "./list/ProductItems";

interface ProductsListProps {
  products: Product[];
  onEdit: (id: string) => void;
  onSelectionChange: (items: string[]) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onActivate?: (id: string, isActive: boolean) => void;
  onRefresh?: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onEdit,
  onSelectionChange,
  searchTerm,
  onSearch,
  onArchive,
  onActivate,
  onRefresh
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterActive, setFilterActive] = useState<string>("active");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const handleToggleSelection = (id: string, isSelected: boolean) => {
    const newSelectedItems = isSelected
      ? [...selectedItems, id]
      : selectedItems.filter(itemId => itemId !== id);
    
    setSelectedItems(newSelectedItems);
    onSelectionChange(newSelectedItems);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredProducts.length) {
      setSelectedItems([]);
      onSelectionChange([]);
    } else {
      const allIds = filteredProducts.map((product) => product.id);
      setSelectedItems(allIds);
      onSelectionChange(allIds);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = (open: boolean) => {
    setIsDrawerOpen(open);
    if (!open) {
      // Clear selected product after drawer is fully closed
      setTimeout(() => {
        setSelectedProduct(null);
      }, 300);
    }
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setShowDeleteConfirm(true);
    // Don't close the drawer yet - we'll close it after confirmation or cancellation
  };

  const confirmDelete = () => {
    if (productToDelete && onArchive) {
      onArchive(productToDelete, true);
      // Close both dialogs after successful delete
      setShowDeleteConfirm(false);
      setIsDrawerOpen(false);
      setProductToDelete(null);
      // Reset selected product after a short delay
      setTimeout(() => {
        setSelectedProduct(null);
      }, 300);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
    // Keep the drawer open - user only canceled the delete operation
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by active status
      if (filterActive === "active" && (!product.is_active || product.is_archived)) {
        return false;
      }
      
      if (filterActive === "inactive" && (product.is_active || product.is_archived)) {
        return false;
      }
      
      if (filterActive === "archived" && !product.is_archived) {
        return false;
      }
      
      // Filter by category
      if (categoryFilter && product.category_id !== categoryFilter) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower))
        );
      }
      
      return true;
    });
  }, [products, searchTerm, filterActive, categoryFilter]);

  const getFilterCounts = () => {
    const active = products.filter(p => p.is_active && !p.is_archived).length;
    const inactive = products.filter(p => !p.is_active && !p.is_archived).length;
    const archived = products.filter(p => p.is_archived).length;
    
    return { active, inactive, archived };
  };
  
  const filterCounts = getFilterCounts();

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Filters Bar */}
        <ProductFilterBar
          searchTerm={searchTerm}
          onSearch={onSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          filterActive={filterActive}
          setFilterActive={setFilterActive}
          handleSelectAll={handleSelectAll}
          selectedItemsCount={selectedItems.length}
          filteredProductsCount={filteredProducts.length}
          filterCounts={filterCounts}
        />
        
        {/* Products List */}
        <ScrollArea className="h-full">
          <ProductItems
            filteredProducts={filteredProducts}
            selectedItems={selectedItems}
            handleToggleSelection={handleToggleSelection}
            handleProductClick={handleProductClick}
            onEdit={onEdit}
            onArchive={onArchive}
            onActivate={onActivate}
            onRefresh={onRefresh}
            searchTerm={searchTerm}
            onSearch={onSearch}
            setCategoryFilter={setCategoryFilter}
            categoryFilter={categoryFilter}
          />
        </ScrollArea>
      </div>

      {/* Product Action Drawer */}
      {selectedProduct && (
        <ProductActionDrawer
          product={selectedProduct}
          isOpen={isDrawerOpen}
          onOpenChange={handleDrawerClose}
          onEdit={(id) => {
            onEdit(id);
            // Let the parent component control the drawer
          }}
          onActivate={onActivate ? 
            (id, isActive) => {
              onActivate(id, isActive);
              // Close drawer after activation
              setIsDrawerOpen(false);
              setTimeout(() => {
                setSelectedProduct(null);
              }, 300);
            } : undefined
          }
          onDelete={handleDeleteClick}
        />
      )}

      {/* Delete Confirmation Dialog - separate from the drawer */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="تأكيد حذف المنتج"
        description="هل أنت متأكد من رغبتك في حذف هذا المنتج؟ لا يمكن التراجع عن هذه العملية."
        confirmText="حذف المنتج"
        cancelText="إلغاء"
        onConfirm={confirmDelete}
        confirmButtonProps={{ 
          variant: "destructive",
          className: "bg-red-500 hover:bg-red-600"
        }}
      />
    </div>
  );
};

export default ProductsList;
