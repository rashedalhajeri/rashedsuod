
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface ProductFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isDisabled: boolean;
}

const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  onCancel,
  onSubmit,
  isDisabled
}) => {
  return (
    <DialogFooter className="mt-6">
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 w-full">
        <Button variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button 
          onClick={onSubmit}
          disabled={isDisabled}
          className="w-full sm:w-auto"
        >
          إضافة المنتج
        </Button>
      </div>
    </DialogFooter>
  );
};

export default ProductFormActions;
