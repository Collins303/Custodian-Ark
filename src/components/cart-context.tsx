'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { products } from '@/lib/site-data';

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  isHydrated: boolean;
  isCartOpen: boolean;
  itemCount: number;
  addItem: (productId: string, quantity?: number) => boolean;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const storageKey = 'custodian-ark-cart';
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      const storedItems: unknown = JSON.parse(window.localStorage.getItem(storageKey) ?? '[]');
      if (Array.isArray(storedItems)) {
        setItems(storedItems.flatMap((storedItem): CartItem[] => {
          if (
            typeof storedItem !== 'object' ||
            storedItem === null ||
            !('productId' in storedItem) ||
            !('quantity' in storedItem) ||
            typeof storedItem.productId !== 'string' ||
            typeof storedItem.quantity !== 'number' ||
            !Number.isInteger(storedItem.quantity) ||
            storedItem.quantity < 1
          ) {
            return [];
          }

          const product = products.find((candidate) => candidate.id === storedItem.productId);
          if (!product || product.stock < 1) return [];

          return [{ productId: product.id, quantity: Math.min(storedItem.quantity, product.stock) }];
        }));
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      window.localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [items, isHydrated]);

  function addItem(productId: string, quantity = 1) {
    const product = products.find((candidate) => candidate.id === productId);
    if (!product || product.stock < 1 || !Number.isInteger(quantity) || quantity < 1) return false;

    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === productId);
      if (!existingItem) {
        return [...currentItems, { productId, quantity: Math.min(quantity, product.stock) }];
      }

      return currentItems.map((item) => item.productId === productId
        ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
        : item);
    });
    return true;
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity < 1) {
      setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
      return;
    }

    const product = products.find((candidate) => candidate.id === productId);
    if (!product) return;

    setItems((currentItems) => currentItems.map((item) => item.productId === productId
      ? { ...item, quantity: Math.min(Math.floor(quantity), product.stock) }
      : item));
  }

  function removeItem(productId: string) {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  }

  function clearCart() {
    setItems([]);
  }

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      isHydrated,
      isCartOpen,
      itemCount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      openCart,
      closeCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider.');
  return context;
}