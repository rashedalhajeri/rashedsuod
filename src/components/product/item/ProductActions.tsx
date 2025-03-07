
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, EyeOff, Eye, ToggleLeft, ToggleRight, Archive, ArrowUpCircle } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

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
      toast.success(!isArchived ? "تم أرشفة المنتج" : "تم إلغاء أرشفة المنتج", {
        description: !isArchived 
          ? "تم إخفاء المنتج من المتجر" 
          : "تم إعادة عرض المنتج في المتجر"
      });
    }
  };

  const handleToggleActive = () => {
    if (onActivate) {
      onActivate(id, !isActive);
      toast.success(!isActive ? "تم تفعيل المنتج" : "تم تعطيل المنتج", {
        description: !isActive 
          ? "أصبح المنتج مرئياً للعملاء" 
          : "أصبح المنتج غير مرئي للعملاء"
      });
    }
  };

  const iconSize = isMobile ? "h-3.5 w-3.5" : "h-4 w-4";
  const buttonSize = "h-8 w-8";

  // للنسخة الموبايل، نستخدم قائمة منسدلة بدلاً من الأزرار
  if (isMobile) {
    return (
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 rounded-full p-0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onEdit(id)}>
              <Edit className="h-4 w-4 ml-2" />
              <span>تعديل المنتج</span>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={handleToggleActive}>
              {isActive ? (
                <>
                  <ToggleLeft className="h-4 w-4 ml-2 text-red-500" />
                  <span>تعطيل المنتج</span>
                </>
              ) : (
                <>
                  <ToggleRight className="h-4 w-4 ml-2 text-green-500" />
                  <span>تفعيل المنتج</span>
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {onArchive && (
              <DropdownMenuItem onClick={handleArchive}>
                {isArchived ? (
                  <>
                    <ArrowUpCircle className="h-4 w-4 ml-2 text-blue-500" />
                    <span>إلغاء الأرشفة</span>
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4 ml-2" />
                    <span>أرشفة المنتج</span>
                  </>
                )}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex gap-1">
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
          {isArchived ? (
            <ArrowUpCircle className={iconSize} />
          ) : (
            <Archive className={iconSize} />
          )}
        </Button>
      )}
    </div>
  );
};
