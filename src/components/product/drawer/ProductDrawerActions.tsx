
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Edit, Trash, Power, PowerOff } from "lucide-react";

interface ProductDrawerActionsProps {
  productId: string;
  isActive: boolean;
  isActionLoading: boolean;
  onEdit: (id: string) => void;
  onDelete?: () => Promise<void>;
  onActivate?: () => Promise<void>;
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
    <div className="space-y-2.5">
      <Button
        onClick={() => onEdit(productId)}
        className="w-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 transition-all border border-blue-200"
        variant="outline"
      >
        <Edit className="h-4 w-4 ml-2" />
        تعديل المنتج
      </Button>
      
      {onActivate && (
        <Button
          onClick={onActivate}
          className={`w-full transition-all ${
            isActive 
              ? "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-600 hover:from-amber-100 hover:to-amber-200 border-amber-200" 
              : "bg-gradient-to-r from-green-50 to-green-100 text-green-600 hover:from-green-100 hover:to-green-200 border-green-200"
          }`}
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
          onClick={onDelete}
          className="w-full bg-gradient-to-r from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200 transition-all border border-red-200"
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
