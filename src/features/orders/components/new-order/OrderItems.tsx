
import React from "react";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface OrderItemsProps {
  selectedItems: OrderItem[];
  totalAmount: number;
  onQuantityChange: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
}

const OrderItems: React.FC<OrderItemsProps> = ({
  selectedItems,
  totalAmount,
  onQuantityChange,
  onRemoveItem
}) => {
  return (
    <div className="mt-4">
      <Label>المنتجات المحددة</Label>
      {selectedItems.length > 0 ? (
        <Table className="mt-2">
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>المجموع</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.unit_price.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onQuantityChange(index, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span>{item.quantity}</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onQuantityChange(index, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{item.total_price.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-bold">المجموع الكلي:</TableCell>
              <TableCell className="font-bold">{totalAmount.toFixed(2)}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-4 border rounded-md mt-2 text-muted-foreground">
          لم تقم بإضافة أي منتجات بعد
        </div>
      )}
    </div>
  );
};

export default OrderItems;
