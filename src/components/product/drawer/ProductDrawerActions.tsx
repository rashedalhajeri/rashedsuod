
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Trash, Power, PowerOff } from "lucide-react";

interface ProductDrawerActionsProps {
  productId: string;
  isActive: boolean;
  isActionLoading: boolean;
  onEdit: (id: string) => void;
  onDelete?: (id: string) => Promise<void>;
  onActivate?: (id: string, isActive: boolean) => Promise<void>;
}

const ProductDrawerActions: React.FC<ProductDrawerActionsProps> = ({
  productId,
  isActive,
  isActionLoading,
  onEdit,
  onDelete,
  onActivate,
}) => {
  return (
    <div className="space-y-2">
      <Button
        onClick={() => onEdit(productId)}
        className="w-full"
        variant="outline"
      >
        <Edit className="h-4 w-4 ml-2" />
        تعديل المنتج
      </Button>
      
      {onActivate && (
        <Button
          onClick={() => onActivate(productId, !isActive)}
          className="w-full"
          variant="outline"
          disabled={isActionLoading}
        >
          {isActionLoading ? (
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          ) : isActive ? (
            <PowerOff className="h-4 w-4 ml-2" />
          ) : (
            <Power className="h-4 w-4 ml-2" />
          )}
          {isActive ? "تعطيل المنتج" : "تفعيل المنتج"}
        </Button>
      )}
      
      {onDelete && (
        <Button
          onClick={() => onDelete(productId)}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200"
          variant="outline"
          disabled={isActionLoading}
        >
          {isActionLoading ? (
            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
          ) : (
            <Trash className="h-4 w-4 ml-2" />
          )}
          حذف المنتج
        </Button>
      )}
    </div>
  );
};

export default ProductDrawerActions;
