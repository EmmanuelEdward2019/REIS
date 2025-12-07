import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price_ngn: number;
    price_gbp: number;
    images: string[];
    stock_quantity: number;
    brand?: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  cartItemCount: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartTotal: (currency: 'NGN' | 'GBP') => number;
  showAddToCartDialog: boolean;
  addToCartDialogData: { productName: string; quantity: number } | null;
  setShowAddToCartDialog: (show: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showAddToCartDialog, setShowAddToCartDialog] = useState(false);
  const [addToCartDialogData, setAddToCartDialogData] = useState<{ productName: string; quantity: number } | null>(null);

  // Check authentication and load cart
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      if (user) {
        await refreshCart();
      } else {
        // Load cart from localStorage for non-authenticated users
        loadLocalCart();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Listen to auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUserId = session?.user?.id || null;
      setUserId(newUserId);

      if (event === 'SIGNED_IN' && newUserId) {
        // Sync local cart to database
        await syncLocalCartToDatabase(newUserId);
        await refreshCart();
      } else if (event === 'SIGNED_OUT') {
        // Clear cart and load from localStorage
        setCartItems([]);
        loadLocalCart();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load cart from localStorage
  const loadLocalCart = () => {
    try {
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    } catch (error) {
      console.error('Error loading local cart:', error);
    }
  };

  // Save cart to localStorage
  const saveLocalCart = (items: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  };

  // Sync local cart to database when user logs in
  const syncLocalCartToDatabase = async (newUserId: string) => {
    try {
      const localCart = localStorage.getItem('cart');
      if (!localCart) return;

      const localItems: CartItem[] = JSON.parse(localCart);

      for (const item of localItems) {
        // Check if item already exists in database
        const { data: existingItem } = await supabase
          .from('shopping_cart')
          .select('*')
          .eq('user_id', newUserId)
          .eq('product_id', item.product_id)
          .single();

        if (existingItem) {
          // Update quantity
          await supabase
            .from('shopping_cart')
            .update({ quantity: existingItem.quantity + item.quantity })
            .eq('id', existingItem.id);
        } else {
          // Insert new item
          await supabase
            .from('shopping_cart')
            .insert({
              user_id: newUserId,
              product_id: item.product_id,
              quantity: item.quantity
            });
        }
      }

      // Clear local cart after sync
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error syncing local cart:', error);
    }
  };

  // Refresh cart from database
  const refreshCart = async () => {
    if (!userId) {
      loadLocalCart();
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('shopping_cart')
        .select(`
          id,
          product_id,
          quantity,
          product:products (
            id,
            name,
            price_ngn,
            price_gbp,
            images,
            stock_quantity,
            brand
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      setCartItems(data as CartItem[] || []);
    } catch (error) {
      console.error('Error refreshing cart:', error);
      toast.error('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      let productName = '';

      if (!userId) {
        // Add to local cart
        const { data: product } = await supabase
          .from('products')
          .select('id, name, price_ngn, price_gbp, images, stock_quantity, brand')
          .eq('id', productId)
          .single();

        if (!product) throw new Error('Product not found');

        productName = product.name;

        const existingItemIndex = cartItems.findIndex(item => item.product_id === productId);
        let newCartItems: CartItem[];

        if (existingItemIndex >= 0) {
          newCartItems = [...cartItems];
          newCartItems[existingItemIndex].quantity += quantity;
        } else {
          const newItem: CartItem = {
            id: `local-${Date.now()}`,
            product_id: productId,
            quantity,
            product
          };
          newCartItems = [...cartItems, newItem];
        }

        setCartItems(newCartItems);
        saveLocalCart(newCartItems);
      } else {
        // Get product name first
        const { data: product } = await supabase
          .from('products')
          .select('name')
          .eq('id', productId)
          .single();

        if (product) {
          productName = product.name;
        }

        // Add to database cart
        const { data: existingItem } = await supabase
          .from('shopping_cart')
          .select('*')
          .eq('user_id', userId)
          .eq('product_id', productId)
          .single();

        if (existingItem) {
          await supabase
            .from('shopping_cart')
            .update({ quantity: existingItem.quantity + quantity })
            .eq('id', existingItem.id);
        } else {
          await supabase
            .from('shopping_cart')
            .insert({
              user_id: userId,
              product_id: productId,
              quantity
            });
        }

        await refreshCart();
      }

      // Show dialog instead of toast
      setAddToCartDialogData({ productName, quantity });
      setShowAddToCartDialog(true);
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add product to cart');
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId: string) => {
    try {
      if (!userId) {
        // Remove from local cart
        const newCartItems = cartItems.filter(item => item.id !== cartItemId);
        setCartItems(newCartItems);
        saveLocalCart(newCartItems);
        toast.success('Product removed from cart');
        return;
      }

      // Remove from database
      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('id', cartItemId);

      if (error) throw error;

      await refreshCart();
      toast.success('Product removed from cart');
    } catch (error: any) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove product from cart');
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      if (!userId) {
        // Update local cart
        const newCartItems = cartItems.map(item =>
          item.id === cartItemId ? { ...item, quantity } : item
        );
        setCartItems(newCartItems);
        saveLocalCart(newCartItems);
        return;
      }

      // Update database
      const { error } = await supabase
        .from('shopping_cart')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) throw error;

      await refreshCart();
    } catch (error: any) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (!userId) {
        setCartItems([]);
        localStorage.removeItem('cart');
        return;
      }

      const { error } = await supabase
        .from('shopping_cart')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      setCartItems([]);
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  // Calculate cart total
  const getCartTotal = (currency: 'NGN' | 'GBP'): number => {
    return cartItems.reduce((total, item) => {
      const price = currency === 'GBP' ? item.product.price_gbp : item.product.price_ngn;
      return total + (price * item.quantity);
    }, 0);
  };

  // Calculate total item count
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartItemCount,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        getCartTotal,
        showAddToCartDialog,
        addToCartDialogData,
        setShowAddToCartDialog
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

