
import React from "react";
import { Button } from "@/components/ui/button";
import OrdersList from "./OrdersList";
import OrderEmptyState from "./OrderEmptyState";
import { Order, OrderStatus } from "@/types/orders";

interface OrdersListContainerProps {
  orders: Order[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  currency?: string;
  onPageChange: (page: number) => void;
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onDelete: (orderId: string) => void;
}

const OrdersListContainer: React.FC<OrdersListContainerProps> = ({
  orders,
  isLoading,
  totalPages,
  currentPage,
  currency,
  onPageChange,
  onViewDetails,
  onUpdateStatus,
  onDelete
}) => {
  return (
    <div className="p-4">
      {orders && orders.length > 0 ? (
        <>
          <OrdersList
            orders={orders}
            isLoading={isLoading}
            onViewDetails={onViewDetails}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
            currency={currency}
          />
          
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="border-gray-200"
                >
                  السابق
                </Button>
                
                <span className="text-sm">
                  الصفحة {currentPage + 1} من {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1 < totalPages ? currentPage + 1 : currentPage)}
                  disabled={currentPage + 1 >= totalPages}
                  className="border-gray-200"
                >
                  التالي
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <OrderEmptyState />
      )}
    </div>
  );
};

export default OrdersListContainer;
