
import React, { useState, useMemo } from "react";
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
  onDelete?: (id: string) => Promise<void>;
  onActivate?: (id: string, isActive: boolean) => Promise<void>;
  onRefresh?: () => void;
}

const ProductsList: React.FC<ProductsListProps> = ({
  products,
  onEdit,
  onSelectionChange,
  searchTerm,
  onSearch,
  onDelete,
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
      // إعادة تعيين المنتج المحدد عند إغلاق النافذة
      setTimeout(() => {
        setSelectedProduct(null);
      }, 300); // تأخير بسيط لضمان إغلاق الانيميشن أولاً
    }
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setShowDeleteConfirm(true);
    setIsDrawerOpen(false);
  };

  const confirmDelete = () => {
    if (productToDelete && onDelete) {
      onDelete(productToDelete);
      setShowDeleteConfirm(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by active status
      if (filterActive === "active" && !product.is_active) {
        return false;
      }
      
      if (filterActive === "inactive" && product.is_active) {
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
    const active = products.filter(p => p.is_active).length;
    const inactive = products.filter(p => !p.is_active).length;
    
    return { active, inactive, archived: 0 }; // Add archived: 0 to match the expected type
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
            onDelete={onDelete}
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
      <ProductActionDrawer
        product={selectedProduct}
        isOpen={isDrawerOpen}
        onOpenChange={handleDrawerClose}
        onEdit={(id) => {
          onEdit(id);
          setIsDrawerOpen(false);
        }}
        onActivate={onActivate ? 
          (id, isActive) => {
            onActivate(id, isActive);
            setIsDrawerOpen(false);
          } : undefined
        }
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={handleDeleteCancel}
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
