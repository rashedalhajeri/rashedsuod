
import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, X, Loader2, Save } from "lucide-react";

interface ProductFormActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isDisabled: boolean;
  isSubmitting?: boolean;
  isEditMode?: boolean;
}

const ProductFormActions: React.FC<ProductFormActionsProps> = ({
  onCancel,
  onSubmit,
  isDisabled,
  isSubmitting = false,
  isEditMode = false
}) => {
  return (
    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="flex items-center gap-2"
        disabled={isSubmitting}
      >
        <X className="h-4 w-4" />
        <span>إلغاء</span>
      </Button>
      
      <Button
        type="button"
        onClick={onSubmit}
        disabled={isDisabled}
        className="flex items-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isEditMode ? (
          <Save className="h-4 w-4" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        <span>
          {isSubmitting 
            ? (isEditMode ? "جاري الحفظ..." : "جاري الإضافة...") 
            : (isEditMode ? "حفظ التغييرات" : "إضافة المنتج")
          }
        </span>
      </Button>
    </div>
  );
};

export default ProductFormActions;
