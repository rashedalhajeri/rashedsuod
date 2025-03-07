
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Plus } from "lucide-react";

interface OrdersHeaderProps {
  onRefresh: () => void;
  onAddOrder: () => void;
}

const OrdersHeader: React.FC<OrdersHeaderProps> = ({ onRefresh, onAddOrder }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">إدارة الطلبات</h1>
        <p className="text-muted-foreground">
          قم بإدارة وتتبع جميع طلبات متجرك من مكان واحد
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCcw className="h-4 w-4" />
          تحديث
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onAddOrder}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          طلب جديد
        </Button>
      </div>
    </div>
  );
};

export default OrdersHeader;
