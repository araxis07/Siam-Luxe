"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ToppingId } from "@/lib/catalog";

export interface CartItem {
  key: string;
  dishId: string;
  quantity: number;
  unitPrice: number;
  spiceLevel: number;
  toppings: ToppingId[];
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "key">) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
}

function buildCartKey(item: Omit<CartItem, "key">) {
  return [item.dishId, item.spiceLevel, [...item.toppings].sort().join(",")].join(
    "::",
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (item) =>
        set((state) => {
          const key = buildCartKey(item);
          const existing = state.items.find((entry) => entry.key === key);

          if (existing) {
            return {
              items: state.items.map((entry) =>
                entry.key === key
                  ? { ...entry, quantity: entry.quantity + item.quantity }
                  : entry,
              ),
            };
          }

          return {
            items: [...state.items, { ...item, key }],
          };
        }),
      updateQuantity: (key, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((item) => item.key !== key)
              : state.items.map((item) =>
                  item.key === key ? { ...item, quantity } : item,
                ),
        })),
      removeItem: (key) =>
        set((state) => ({
          items: state.items.filter((item) => item.key !== key),
        })),
      clearCart: () => set({ items: [] }),
      setCartOpen: (open) => set({ isOpen: open }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "siam-lux-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
