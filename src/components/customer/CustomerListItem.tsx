
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Customer } from "@/services/customer-service";
import { getCurrencyFormatter } from "@/hooks/use-store-data";

interface CustomerListItemProps {
  customer: Customer;
  onViewDetails: (customer: Customer) => void;
  currency: string;
}

const CustomerListItem: React.FC<CustomerListItemProps> = ({ 
  customer, 
  onViewDetails, 
  currency 
}) => {
  const formatCurrency = getCurrencyFormatter(currency);
  
  return (
    <div 
      className="p-4 border-b hover:bg-gray-50 transition-colors cursor-pointer" 
      onClick={() => onViewDetails(customer)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Avatar className="h-10 w-10 border">
            <AvatarFallback className="bg-primary-50 text-primary-700">
              {customer.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-sm font-medium text-gray-800">{customer.name}</h3>
            <p className="text-xs text-gray-500">{customer.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-800">{formatCurrency(customer.total_spent)}</span>
            <span className="text-xs text-gray-500">{customer.total_orders} طلب</span>
          </div>
          <Badge
            variant={customer.status === "active" ? "outline" : "secondary"}
            className={`
              ${customer.status === "active" ? "border-green-500 text-green-600 bg-green-50" : "bg-gray-200 text-gray-600"}
            `}
          >
            {customer.status === "active" ? "نشط" : "غير نشط"}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default CustomerListItem;
