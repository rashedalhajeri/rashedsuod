
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { storeId } = useParams<{ storeId: string }>();
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (!storeId) return;

    const storedCart = localStorage.getItem(`cart-${storeId}`);
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (err) {
        console.error("Error parsing stored cart:", err);
        localStorage.removeItem(`cart-${storeId}`);
      }
    }
  }, [storeId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!storeId || items.length === 0) return;
    localStorage.setItem(`cart-${storeId}`, JSON.stringify(items));
  }, [items, storeId]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);
      
      if (existingItemIndex >= 0) {
        // Product already in cart, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
        toast.success("تم تحديث المنتج في السلة");
        return updatedItems;
      } else {
        // Add new product to cart
        toast.success("تمت إضافة المنتج إلى السلة");
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      if (updatedItems.length === 0) {
        localStorage.removeItem(`cart-${storeId}`);
      }
      toast.success("تم إزالة المنتج من السلة");
      return updatedItems;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(prevItems => 
      prevItems.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    if (storeId) {
      localStorage.removeItem(`cart-${storeId}`);
    }
  };

  const getTotalQuantity = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalQuantity,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
