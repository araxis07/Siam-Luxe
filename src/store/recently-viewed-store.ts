"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RecentlyViewedState {
  dishIds: string[];
  pushDish: (dishId: string) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      dishIds: [],
      pushDish: (dishId) =>
        set((state) => ({
          dishIds: [dishId, ...state.dishIds.filter((item) => item !== dishId)].slice(0, 8),
        })),
      clear: () => set({ dishIds: [] }),
    }),
    {
      name: "siam-lux-recently-viewed",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
