
import { v4 as uuidv4 } from "uuid";
import { OrderItem } from "../types/order-types";

export function addProductToOrder(
  selectedItems: OrderItem[],
  productId: string,
  productName: string,
  price: number
): OrderItem[] {
  // Check if product already exists in the order
  const existingItemIndex = selectedItems.findIndex(item => item.productId === productId);

  if (existingItemIndex >= 0) {
    // Increment quantity if product already exists
    const updatedItems = [...selectedItems];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + 1
    };
    return updatedItems;
  } else {
    // Add new product to order
    return [
      ...selectedItems,
      {
        id: uuidv4(),
        productId,
        productName,
        quantity: 1,
        price
      }
    ];
  }
}

export function updateItemQuantity(items: OrderItem[], id: string, quantity: number): OrderItem[] {
  if (quantity < 1) return items;

  return items.map(item => (item.id === id ? { ...item, quantity } : item));
}

export function removeItemFromOrder(items: OrderItem[], id: string): OrderItem[] {
  return items.filter(item => item.id !== id);
}

export function validateOrderData(orderData: {
  customer_name: string;
  shipping_address: string;
}, items: OrderItem[]): { valid: boolean; message?: string } {
  if (items.length === 0) {
    return { valid: false, message: "يرجى إضافة منتج واحد على الأقل" };
  }

  if (!orderData.customer_name || !orderData.shipping_address) {
    return { valid: false, message: "يرجى ملء الحقول المطلوبة" };
  }

  return { valid: true };
}
