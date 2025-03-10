
import React from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: React.ReactNode;
  onDelete: () => Promise<void>;
  itemName: string;
  itemType: string;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onDelete,
  itemName,
  itemType
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete();
      // Don't close here, the parent component should handle this
    } catch (error) {
      console.error(`Error deleting ${itemType}:`, error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      confirmText={isDeleting ? `جاري الحذف...` : `حذف ${itemName}`}
      cancelText="إلغاء"
      onConfirm={handleDelete}
      variant="delete"
      confirmButtonProps={{
        disabled: isDeleting
      }}
    />
  );
};

export default DeleteConfirmDialog;
