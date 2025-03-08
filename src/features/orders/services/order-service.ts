
import { supabase } from "@/integrations/supabase/client";
import { OrderItem, OrderData } from "../types/order-types";
import { toast } from "sonner";

export async function createOrder(
  storeId: string,
  orderData: OrderData,
  selectedItems: OrderItem[]
): Promise<boolean> {
  try {
    // Calculate total
    const total = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        store_id: storeId,
        order_number: orderNumber,
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email || null,
        customer_phone: orderData.customer_phone || null,
        shipping_address: orderData.shipping_address,
        payment_method: orderData.payment_method,
        total,
        status: "pending",
        notes: orderData.notes || null
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = selectedItems.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    toast.success("تم إنشاء الطلب بنجاح");
    return true;
  } catch (error) {
    console.error("Error creating order:", error);
    toast.error("حدث خطأ أثناء إنشاء الطلب");
    return false;
  }
}
