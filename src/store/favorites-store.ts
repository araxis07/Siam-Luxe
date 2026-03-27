"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoritesState {
  favoriteDishIds: string[];
  toggleFavorite: (dishId: string) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favoriteDishIds: [],
      toggleFavorite: (dishId) =>
        set((state) => ({
          favoriteDishIds: state.favoriteDishIds.includes(dishId)
            ? state.favoriteDishIds.filter((id) => id !== dishId)
            : [...state.favoriteDishIds, dishId],
        })),
      clearFavorites: () => set({ favoriteDishIds: [] }),
    }),
    {
      name: "siam-lux-favorites",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
