"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserState {
  fullName: string;
  phone: string;
  addressLine: string;
  district: string;
  city: string;
  notes: string;
  paymentMethod: "cash" | "card" | "promptpay";
  saveCheckoutProfile: (payload: {
    fullName: string;
    phone: string;
    addressLine: string;
    district: string;
    city: string;
    notes: string;
    paymentMethod: "cash" | "card" | "promptpay";
  }) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      fullName: "Siam Lux Guest",
      phone: "",
      addressLine: "",
      district: "",
      city: "Bangkok",
      notes: "",
      paymentMethod: "promptpay",
      saveCheckoutProfile: (payload) => set(payload),
    }),
    {
      name: "siam-lux-user",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
