
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { formatCurrency } from "@/utils/currency";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderItemsListProps {
  items: OrderItem[];
  onRemoveItem: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items,
  onRemoveItem,
  onQuantityChange
}) => {
  if (items.length === 0) {
    return (
      <div className="border rounded-md p-4 text-center text-muted-foreground">
        لم يتم إضافة أي منتجات بعد
      </div>
    );
  }

  // Calculate subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المنتج</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">السعر</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الكمية</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المجموع</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.productName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center w-24">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 h-8 w-8 flex items-center justify-center border rounded-l-md"
                      onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    <div className="h-8 w-8 flex items-center justify-center border-t border-b">
                      {item.quantity}
                    </div>
                    <button
                      type="button"
                      className="text-gray-500 hover:text-gray-700 h-8 w-8 flex items-center justify-center border rounded-r-md"
                      onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatCurrency(item.price * item.quantity)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={3} className="px-6 py-3 text-right text-sm font-medium text-gray-900">
                المجموع الفرعي
              </td>
              <td colSpan={2} className="px-6 py-3 text-right text-sm text-gray-900">
                {formatCurrency(subtotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderItemsList;
