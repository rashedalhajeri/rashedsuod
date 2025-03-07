
import React from "react";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";

interface BulkActionsBarProps {
  selectedItemsCount: number;
  onActivate: () => void;
  onDeactivate: () => void;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedItemsCount,
  onActivate,
  onDeactivate
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-2 mb-3 bg-gray-100 rounded-lg items-center">
      <span className="text-sm text-gray-600 font-medium px-2">
        تم تحديد {selectedItemsCount} منتج
      </span>
      <div className="flex gap-2 mr-auto">
        <Button
          size="sm"
          variant="outline"
          className="text-green-600 border-green-200 hover:bg-green-50"
          onClick={onActivate}
        >
          <Power className="h-4 w-4 ml-1" />
          تفعيل المحدد
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-gray-600 border-gray-200 hover:bg-gray-50"
          onClick={onDeactivate}
        >
          <Power className="h-4 w-4 ml-1" />
          تعطيل المحدد
        </Button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
