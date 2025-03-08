
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import NewOrderForm from "./new-order/NewOrderForm";
import { useNewOrder } from "./new-order/useNewOrder";

interface NewOrderModalProps {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({
  storeId,
  isOpen,
  onClose,
  onSuccess
}) => {
  const {
    orderData,
    selectedItems,
    productsData,
    searchQuery,
    saving,
    setSearchQuery,
    handleInputChange,
    handleSelectChange,
    handleAddProduct,
    handleQuantityChange,
    handleRemoveItem,
    handleSubmit
  } = useNewOrder(storeId, isOpen, onClose, onSuccess);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">إضافة طلب جديد</DialogTitle>
          <DialogDescription>
            أدخل تفاصيل الطلب الجديد
          </DialogDescription>
        </DialogHeader>
        
        <NewOrderForm
          orderData={orderData}
          selectedItems={selectedItems}
          productsData={productsData}
          searchQuery={searchQuery}
          saving={saving}
          onSearchChange={setSearchQuery}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
          onAddProduct={handleAddProduct}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NewOrderModal;
