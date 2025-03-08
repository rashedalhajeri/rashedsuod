
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Customer } from "@/services/customer-service";
import CustomerListItem from "./CustomerListItem";

interface CustomerListProps {
  isLoading: boolean;
  error: unknown;
  filteredCustomers: Customer[];
  handleViewDetails: (customer: Customer) => void;
  refetch: () => void;
  currency: string;
}

const CustomerList: React.FC<CustomerListProps> = ({
  isLoading,
  error,
  filteredCustomers,
  handleViewDetails,
  refetch,
  currency,
}) => {
  const emptyState = (
    <div className="text-center py-12">
      <Users className="h-12 w-12 mx-auto text-gray-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-900">لا يوجد عملاء</h3>
      <p className="mt-1 text-sm text-gray-500">ابدأ بإضافة عملاء جدد لمتجرك</p>
      <Button className="mt-4">إضافة عميل جديد</Button>
    </div>
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          العملاء ({filteredCustomers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-8 text-center">
            <p>جاري تحميل بيانات العملاء...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500">حدث خطأ أثناء تحميل بيانات العملاء</p>
            <Button variant="outline" className="mt-2" onClick={() => refetch()}>
              إعادة المحاولة
            </Button>
          </div>
        ) : filteredCustomers.length === 0 ? (
          emptyState
        ) : (
          filteredCustomers.map((customer) => (
            <CustomerListItem
              key={customer.id}
              customer={customer}
              onViewDetails={handleViewDetails}
              currency={currency}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default CustomerList;
