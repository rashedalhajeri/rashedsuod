
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle } from "lucide-react";

interface StoreStatusBadgeProps {
  status: string;
}

const StoreStatusBadge: React.FC<StoreStatusBadgeProps> = ({ status }) => {
  if (status === 'active') {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <Check className="h-3 w-3 ml-1" /> نشط
      </Badge>
    );
  }
  
  return (
    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
      <AlertTriangle className="h-3 w-3 ml-1" /> معلق
    </Badge>
  );
};

export default StoreStatusBadge;
