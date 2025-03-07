
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, EyeOff, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ProductActionsProps {
  id: string;
  isArchived: boolean;
  isActive: boolean;
  onEdit: (id: string) => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onActivate?: (id: string, isActive: boolean) => void;
  isMobile?: boolean;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  id,
  isArchived,
  isActive,
  onEdit,
  onArchive,
  onActivate,
  isMobile = false
}) => {
  const handleArchive = () => {
    if (onArchive) {
      onArchive(id, !isArchived);
    }
  };

  const handleToggleActive = () => {
    if (onActivate) {
      onActivate(id, !isActive);
      toast({
        title: isActive ? "تم تعطيل المنتج" : "تم تفعيل المنتج",
        description: isActive ? "تم تعطيل المنتج بنجاح" : "تم تفعيل المنتج بنجاح",
      });
    }
  };

  const iconSize = isMobile ? "h-3.5 w-3.5" : "h-4 w-4";
  const buttonSize = "h-8 w-8";

  return (
    <div className={`flex gap-1 ${isMobile ? 'sm:hidden' : 'hidden sm:flex'}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEdit(id)}
        className={`text-gray-500 hover:text-gray-700 ${buttonSize}`}
        title="تعديل"
      >
        <Edit className={iconSize} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleActive}
        className={`${buttonSize} ${isActive ? 'text-green-500 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'}`}
        title={isActive ? "تعطيل المنتج" : "تفعيل المنتج"}
      >
        {isActive ? (
          <ToggleRight className={iconSize} />
        ) : (
          <ToggleLeft className={iconSize} />
        )}
      </Button>
      
      {onArchive && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleArchive}
          className={`${buttonSize} ${isArchived ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          title={isArchived ? "إلغاء الأرشفة" : "أرشفة"}
        >
          <EyeOff className={iconSize} />
        </Button>
      )}
    </div>
  );
};
