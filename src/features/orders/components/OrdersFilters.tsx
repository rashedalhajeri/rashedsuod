
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { OrderStatus } from "@/types/orders";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, Check, X } from "lucide-react";

interface StatusItem {
  id: OrderStatus | "all";
  label: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

interface OrdersFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: OrderStatus | "all";
  onTabChange: (tab: OrderStatus | "all") => void;
  stats: {
    total: number;
    processing: number;
    delivered: number;
    cancelled: number;
  };
}

const OrdersFilters: React.FC<OrdersFiltersProps> = ({
  searchQuery,
  onSearchChange,
  activeTab,
  onTabChange,
  stats
}) => {
  // Status items for filter tabs
  const statusItems: StatusItem[] = [
    {
      id: "all",
      label: "الكل",
      count: stats?.total || 0,
      icon: <ShoppingBag className="h-4 w-4" />,
      color: "bg-gray-100 text-gray-800 border-gray-200"
    },
    {
      id: "processing",
      label: "قيد المعالجة",
      count: stats?.processing || 0,
      icon: <Clock className="h-4 w-4" />,
      color: "bg-blue-50 text-blue-800 border-blue-200"
    },
    {
      id: "delivered",
      label: "تم التوصيل",
      count: stats?.delivered || 0,
      icon: <Check className="h-4 w-4" />,
      color: "bg-green-50 text-green-800 border-green-200"
    },
    {
      id: "cancelled",
      label: "ملغي",
      count: stats?.cancelled || 0,
      icon: <X className="h-4 w-4" />,
      color: "bg-red-50 text-red-800 border-red-200"
    }
  ];

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="البحث في الطلبات..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-3 pr-9 border-gray-200 focus:border-primary-300 focus:ring focus:ring-primary-100 focus:ring-opacity-50"
          />
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 sm:w-auto w-full justify-center border-gray-200 hover:border-primary-200 hover:bg-primary-50"
        >
          <Filter className="h-4 w-4" />
          تصفية متقدمة
        </Button>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto py-4 px-4 gap-2 border-b border-gray-100">
          {statusItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === item.id
                  ? `${item.color} shadow-sm`
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              <Badge variant="outline" className="ml-1 bg-white text-xs min-w-5 h-5 flex items-center justify-center">
                {item.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default OrdersFilters;
