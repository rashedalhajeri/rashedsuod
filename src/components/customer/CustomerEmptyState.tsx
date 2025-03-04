
import React from "react";
import { Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomerEmptyStateProps {
  title?: string;
  description?: string;
  hasFilters?: boolean;
  onClearFilters?: () => void;
}

const CustomerEmptyState: React.FC<CustomerEmptyStateProps> = ({
  title = "لا يوجد عملاء",
  description = "سيظهر هنا عملاؤك عندما يقومون بالتسجيل أو إتمام عملية شراء",
  hasFilters = false,
  onClearFilters
}) => {
  return (
    <div className="text-center py-12">
      <Users className="h-12 w-12 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {description}
      </p>
      {hasFilters && onClearFilters && (
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={onClearFilters}
        >
          <X className="h-4 w-4 ml-2" />
          إزالة عوامل التصفية
        </Button>
      )}
    </div>
  );
};

export default CustomerEmptyState;
