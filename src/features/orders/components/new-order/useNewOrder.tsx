
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createOrder } from "@/services/order-service";
import { OrderStatus } from "@/types/orders";
import { useQuery } from "@tanstack/react-query";
import { getProductsWithPagination } from "@/integrations/supabase/client";

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface OrderData {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  payment_method: string;
  status: OrderStatus;
  total: number;
  notes: string;
}

export const useNewOrder = (
  storeId: string,
  isOpen: boolean,
  onClose: () => void,
  onSuccess: () => void
) => {
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  
  const generateOrderNumber = () => {
    const randomNumber = Math.floor(Math.random() * 9999) + 1;
    return `ORD-${randomNumber.toString().padStart(4, '0')}`;
  };
  
  const [orderData, setOrderData] = useState<OrderData>({
    order_number: generateOrderNumber(),
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    shipping_address: "",
    payment_method: "cash",
    status: "processing",
    total: 0,
    notes: ""
  });

  const { data: productsData } = useQuery({
    queryKey: ["products", storeId, searchQuery],
    queryFn: () => getProductsWithPagination(storeId, 0, 100, searchQuery),
    enabled: !!storeId && isOpen
  });

  useEffect(() => {
    if (isOpen) {
      setOrderData(prev => ({
        ...prev,
        order_number: generateOrderNumber(),
        total: 0
      }));
      setSelectedItems([]);
      setSearchQuery("");
    }
  }, [isOpen, storeId]);

  useEffect(() => {
    const newTotal = selectedItems.reduce((sum, item) => sum + item.total_price, 0);
    setOrderData(prev => ({
      ...prev,
      total: newTotal
    }));
  }, [selectedItems]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...prev,
      [name]: name === "total" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "status") {
      setOrderData(prev => ({
        ...prev,
        [name]: value as OrderStatus
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddProduct = (productId: string, productName: string, price: number) => {
    const existingItemIndex = selectedItems.findIndex(item => item.product_id === productId);
    
    if (existingItemIndex >= 0) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += 1;
      updatedItems[existingItemIndex].total_price = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].unit_price;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems(prev => [
        ...prev,
        {
          product_id: productId,
          product_name: productName,
          quantity: 1,
          unit_price: price,
          total_price: price
        }
      ]);
    }
  };

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = newQuantity;
    updatedItems[index].total_price = newQuantity * updatedItems[index].unit_price;
    setSelectedItems(updatedItems);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeId) {
      toast("خطأ", {
        description: "لم يتم العثور على بيانات المتجر",
        style: { backgroundColor: 'red', color: 'white' }
      });
      return;
    }
    
    if (!orderData.customer_name || !orderData.shipping_address) {
      toast("حقول مطلوبة", {
        description: "يرجى إدخال اسم العميل وعنوان الشحن",
        style: { backgroundColor: 'red', color: 'white' }
      });
      return;
    }

    if (selectedItems.length === 0) {
      toast("لا توجد منتجات", {
        description: "يرجى إضافة منتج واحد على الأقل للطلب",
        style: { backgroundColor: 'red', color: 'white' }
      });
      return;
    }
    
    try {
      setSaving(true);
      
      const completeOrderData: any = {
        ...orderData,
        store_id: storeId
      };
      
      const orderItems = selectedItems.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));
      
      const result = await createOrder(storeId, completeOrderData, orderItems);
      
      if (result) {
        toast("تم بنجاح", {
          description: "تم إنشاء الطلب بنجاح"
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast("خطأ", {
        description: "حدث خطأ أثناء إنشاء الطلب",
        style: { backgroundColor: 'red', color: 'white' }
      });
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
