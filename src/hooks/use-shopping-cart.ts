
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string | null;
};

export const useShoppingCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('cart-items');
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart-items', JSON.stringify(cartItems));
      
      // Dispatch custom event to notify components about cart updates
      const event = new CustomEvent('cart-updated');
      window.dispatchEvent(event);
    }
  }, [cartItems, isLoading]);

  // Add item to cart
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.productId === item.productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item already exists
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + item.quantity
        };
        toast.success('تم تحديث المنتج في السلة');
        return updatedItems;
      } else {
        // Add new item
        toast.success('تمت إضافة المنتج إلى السلة');
        return [...prevItems, { ...item, id: Date.now().toString() }];
      }
    });
  };

  // Update item quantity
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (itemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast.info('تم إزالة المنتج من السلة');
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
    toast.info('تم تفريغ السلة');
  };

  // Calculate cart subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    cartItems,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    itemCount: cartItems.length
  };
};
