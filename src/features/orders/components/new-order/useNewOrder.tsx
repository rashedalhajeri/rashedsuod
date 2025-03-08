
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { OrderItem, OrderData, Product } from "../../types/order-types";
import { fetchProductsBySearch } from "../../services/product-service";
import { createOrder } from "../../services/order-service";
import { 
  addProductToOrder, 
  updateItemQuantity, 
  removeItemFromOrder,
  validateOrderData
} from "../../utils/order-utils";

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
  const [productsData, setProductsData] = useState<Product[]>([]);

  // Reset form when modal is closed
  if (!isOpen) {
    if (selectedItems.length > 0) setSelectedItems([]);
    if (searchQuery) setSearchQuery("");
  }

  // Fetch and search for products
  const fetchProducts = async () => {
    if (!storeId || !isOpen) return;
    const data = await fetchProductsBySearch(storeId, searchQuery);
    setProductsData(data);
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
    setSelectedItems(prevItems => 
      addProductToOrder(prevItems, productId, productName, price)
    );
    // Clear search after adding
    setSearchQuery("");
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setSelectedItems(prevItems => updateItemQuantity(prevItems, id, quantity));
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems(prevItems => removeItemFromOrder(prevItems, id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateOrderData(orderData, selectedItems);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setSaving(true);

    try {
      const success = await createOrder(storeId, orderData, selectedItems);
      if (success) {
        onSuccess();
        onClose();
      }
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
