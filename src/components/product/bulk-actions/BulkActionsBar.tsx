
import React from "react";
import { Button } from "@/components/ui/button";
import { Power, FolderClosed, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-media-query";

interface BulkActionsBarProps {
  selectedItemsCount: number;
  onActivate: () => void;
  onDeactivate: () => void;
  onChangeCategory?: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedItemsCount,
  onActivate,
  onDeactivate,
  onChangeCategory
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-3'} p-3 rounded-lg items-center bg-blue-50 border border-blue-100 shadow-sm`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold">
          {selectedItemsCount}
        </div>
        <span className="text-sm text-blue-700 font-medium">
          تم تحديد {selectedItemsCount} منتج
        </span>
      </div>
      
      <div className={`flex gap-2 ${isMobile ? 'w-full' : 'mr-auto'}`}>
        {onChangeCategory && (
          <Button
            size="sm"
            variant="outline"
            className={`text-blue-600 border-blue-200 hover:bg-blue-100 ${isMobile ? 'flex-1' : ''}`}
            onClick={onChangeCategory}
          >
            <FolderClosed className="h-4 w-4 ml-1.5" />
            تغيير الفئة
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          className={`text-green-600 border-green-200 hover:bg-green-100 ${isMobile ? 'flex-1' : ''}`}
          onClick={onActivate}
        >
          <Power className="h-4 w-4 ml-1.5" />
          تفعيل
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={`text-gray-600 border-gray-200 hover:bg-gray-100 ${isMobile ? 'flex-1' : ''}`}
          onClick={onDeactivate}
        >
          <Power className="h-4 w-4 ml-1.5" />
          تعطيل
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
