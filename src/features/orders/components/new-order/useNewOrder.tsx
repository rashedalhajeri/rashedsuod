import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface OrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  notes: string;
  payment_method: string;
}

export const useNewOrder = (
  storeId: string,
  isOpen: boolean,
  onClose: () => void,
  onSuccess: () => void
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [orderData, setOrderData] = useState<OrderData>({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    notes: "",
    payment_method: "cash_on_delivery"
  });

  // Fetch products
  const [productsData, setProductsData] = useState<any[]>([]);

  // Reset form when modal is closed
  if (!isOpen) {
    if (selectedItems.length > 0) setSelectedItems([]);
    if (searchQuery) setSearchQuery("");
  }

  // Search for products
  const fetchProducts = async () => {
    if (!storeId || !isOpen) return;

    try {
      let query = supabase
        .from("products")
        .select("id, name, price")
        .eq("store_id", storeId)
        .eq("is_active", true);

      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      const { data, error } = await query.limit(10);

      if (error) throw error;
      setProductsData(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProductsData([]);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, storeId, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setOrderData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = (productId: string, productName: string, price: number) => {
    // Check if product already exists in the order
    const existingItemIndex = selectedItems.findIndex(item => item.productId === productId);

    if (existingItemIndex >= 0) {
      // Increment quantity if product already exists
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1
      };
      setSelectedItems(updatedItems);
    } else {
      // Add new product to order
      setSelectedItems(prev => [
        ...prev,
        {
          id: uuidv4(),
          productId,
          productName,
          quantity: 1,
          price
        }
      ]);
    }

    // Clear search after adding
    setSearchQuery("");
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity < 1) return;

    setSelectedItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedItems.length === 0) {
      toast.error("يرجى إضافة منتج واحد على الأقل");
      return;
    }

    if (!orderData.customer_name || !orderData.shipping_address) {
      toast.error("يرجى ملء الحقول المطلوبة");
      return;
    }

    setSaving(true);

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
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("حدث خطأ أثناء إنشاء الطلب");
    } finally {
      setSaving(false);
    }
  };

  return {
    orderData,
    selectedItems,
    productsData,
    searchQuery,
    saving,
    setSearchQuery,
    handleInputChange,
    handleSelectChange,
    handleAddProduct,
    handleQuantityChange,
    handleRemoveItem,
    handleSubmit
  };
};
