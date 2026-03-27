"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { BranchId, ServiceMode } from "@/lib/experience";

interface ExperienceState {
  selectedBranchId: BranchId;
  serviceMode: ServiceMode;
  appliedPromoCode: string | null;
  setSelectedBranchId: (branchId: BranchId) => void;
  setServiceMode: (serviceMode: ServiceMode) => void;
  setAppliedPromoCode: (promoCode: string | null) => void;
}

export const useExperienceStore = create<ExperienceState>()(
  persist(
    (set) => ({
      selectedBranchId: "bangrak",
      serviceMode: "delivery",
      appliedPromoCode: null,
      setSelectedBranchId: (selectedBranchId) => set({ selectedBranchId }),
      setServiceMode: (serviceMode) => set({ serviceMode }),
      setAppliedPromoCode: (appliedPromoCode) => set({ appliedPromoCode }),
    }),
    {
      name: "siam-lux-experience",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
