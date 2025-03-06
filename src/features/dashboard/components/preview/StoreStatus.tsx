
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface StoreStatusProps {
  isOnline: boolean;
  storeUrl: string;
}

const StoreStatus: React.FC<StoreStatusProps> = ({ isOnline, storeUrl }) => {
  return (
    <div className="flex items-center gap-1 mb-2">
      <Badge variant={isOnline ? "default" : "destructive"} className="px-2 py-0 h-5">
        {isOnline ? "متصل" : "غير متصل"}
      </Badge>
      <span className="text-xs text-muted-foreground">
        {storeUrl}
      </span>
    </div>
  );
};

export default StoreStatus;
