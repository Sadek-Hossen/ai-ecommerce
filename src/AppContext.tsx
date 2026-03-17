import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User } from './types';

interface AppContextType {
  products: Product[];
  categories: string[];
  cart: CartItem[];
  user: User | null;
  setUser: (user: User | null) => void;
  addToCart: (product: Product, variant: any) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  logout: () => void;
  refreshProducts: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('luxe_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('luxe_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
    
    fetch('/api/categories')
      .then(res => res.json())
      .then(setCategories);
  }, []);

  const addToCart = (product: Product, variant: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && JSON.stringify(item.selectedVariant) === JSON.stringify(variant));
      if (existing) {
        return prev.map(item => 
          item.id === product.id && JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedVariant: variant }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const clearCart = () => setCart([]);

  const refreshProducts = () => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts);
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('luxe_user');
  };

  return (
    <AppContext.Provider value={{
      products,
      categories,
      cart,
      user,
      setUser,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      logout,
      refreshProducts
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
