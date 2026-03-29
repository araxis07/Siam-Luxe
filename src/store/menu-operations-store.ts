"use client";

import { create } from "zustand";

export type MenuOperationOverride = {
  dish_id: string;
  price_override: number | null;
  is_available: boolean;
  featured_override: boolean | null;
  status_override: "available" | "limited" | "soldOut" | "chefToday" | null;
  kitchen_note: string;
};

interface MenuOperationsState {
  operations: Record<string, MenuOperationOverride>;
  hasLoaded: boolean;
  isLoading: boolean;
  startLoading: () => void;
  setOperations: (operations: MenuOperationOverride[]) => void;
  markLoaded: () => void;
  upsertOperation: (operation: MenuOperationOverride) => void;
}

export const useMenuOperationsStore = create<MenuOperationsState>()((set) => ({
  operations: {},
  hasLoaded: false,
  isLoading: false,
  startLoading: () => set({ isLoading: true }),
  setOperations: (operations) =>
    set({
      operations: Object.fromEntries(operations.map((operation) => [operation.dish_id, operation])),
      hasLoaded: true,
      isLoading: false,
    }),
  markLoaded: () => set({ hasLoaded: true, isLoading: false }),
  upsertOperation: (operation) =>
    set((state) => ({
      operations: {
        ...state.operations,
        [operation.dish_id]: operation,
      },
    })),
}));
