
import React from "react";
import DeleteConfirmDialog from "@/components/ui/delete-confirm-dialog";

interface OrderDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderNumber?: string;
}

const OrderDeleteDialog: React.FC<OrderDeleteDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderNumber = ""
}) => {
  const handleDelete = async () => {
    onConfirm();
    // The parent component will handle closing the dialog
  };

  return (
    <DeleteConfirmDialog
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="تأكيد حذف الطلب"
      description={
        <div className="text-center">
          <p>هل أنت متأكد من رغبتك في حذف الطلب 
            {orderNumber ? <span className="font-bold"> #{orderNumber}</span> : ""}؟
          </p>
          <p className="mt-2 text-sm">هذا الإجراء لا يمكن التراجع عنه.</p>
        </div>
      }
      onDelete={handleDelete}
      itemName={orderNumber ? `#${orderNumber}` : "الطلب"}
      itemType="طلب"
    />
  );
};

export default OrderDeleteDialog;
