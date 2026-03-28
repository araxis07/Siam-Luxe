"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface SavedAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  addressLine: string;
  district: string;
  city: string;
  isPrimary?: boolean;
}

export interface SavedPaymentMethod {
  id: string;
  label: string;
  kind: "card" | "promptpay" | "cash";
  last4?: string;
}

export interface GiftWalletEntry {
  id: string;
  code: string;
  amount: number;
  title: string;
  expiresAt: string;
}

export interface RedeemedRewardEntry {
  id: string;
  rewardId: string;
  title: string;
  pointsUsed: number;
  walletAmount: number;
  redeemedAt: string;
}

interface UserState {
  fullName: string;
  phone: string;
  addressLine: string;
  district: string;
  city: string;
  notes: string;
  paymentMethod: "cash" | "card" | "promptpay";
  savedAddresses: SavedAddress[];
  paymentProfiles: SavedPaymentMethod[];
  giftWallet: GiftWalletEntry[];
  rewardPoints: number;
  redeemedRewards: RedeemedRewardEntry[];
  activeAddressId: string;
  activePaymentProfileId: string;
  saveCheckoutProfile: (payload: {
    fullName: string;
    phone: string;
    addressLine: string;
    district: string;
    city: string;
    notes: string;
    paymentMethod: "cash" | "card" | "promptpay";
  }) => void;
  setActiveAddress: (id: string) => void;
  setActivePaymentProfile: (id: string) => void;
  addSavedAddress: (payload: Omit<SavedAddress, "id">) => void;
  addPaymentProfile: (payload: Omit<SavedPaymentMethod, "id">) => void;
  addGiftWalletEntry: (payload: Omit<GiftWalletEntry, "id">) => void;
  redeemReward: (payload: {
    rewardId: string;
    title: string;
    points: number;
    walletAmount: number;
  }) => { ok: boolean; remainingPoints: number };
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
      savedAddresses: [
        {
          id: "address-home",
          label: "Home",
          recipient: "Siam Lux Guest",
          phone: "",
          addressLine: "",
          district: "",
          city: "Bangkok",
          isPrimary: true,
        },
      ],
      paymentProfiles: [
        { id: "payment-promptpay", label: "PromptPay", kind: "promptpay" },
        { id: "payment-visa", label: "Visa ending 8842", kind: "card", last4: "8842" },
      ],
      giftWallet: [
        {
          id: "gift-001",
          code: "HOUSE500",
          amount: 500,
          title: "House Gift Card",
          expiresAt: "2026-12-31",
        },
        {
          id: "gift-002",
          code: "LOYALTY240",
          amount: 240,
          title: "Loyalty Reward Wallet",
          expiresAt: "2026-08-31",
        },
      ],
      rewardPoints: 1280,
      redeemedRewards: [],
      activeAddressId: "address-home",
      activePaymentProfileId: "payment-promptpay",
      saveCheckoutProfile: (payload) =>
        set((state) => {
          const activeAddress = state.savedAddresses.find((item) => item.id === state.activeAddressId);

          return {
            ...payload,
            savedAddresses: activeAddress
              ? state.savedAddresses.map((item) =>
                  item.id === activeAddress.id
                    ? {
                        ...item,
                        recipient: payload.fullName,
                        phone: payload.phone,
                        addressLine: payload.addressLine,
                        district: payload.district,
                        city: payload.city,
                      }
                    : item,
                )
              : [
                  ...state.savedAddresses,
                  {
                    id: `address-${Date.now()}`,
                    label: "Primary",
                    recipient: payload.fullName,
                    phone: payload.phone,
                    addressLine: payload.addressLine,
                    district: payload.district,
                    city: payload.city,
                    isPrimary: true,
                  },
                ],
          };
        }),
      setActiveAddress: (activeAddressId) => set({ activeAddressId }),
      setActivePaymentProfile: (activePaymentProfileId) => set({ activePaymentProfileId }),
      addSavedAddress: (payload) =>
        set((state) => ({
          savedAddresses: [
            ...state.savedAddresses,
            { ...payload, id: `address-${Date.now()}-${state.savedAddresses.length}` },
          ],
        })),
      addPaymentProfile: (payload) =>
        set((state) => ({
          paymentProfiles: [
            ...state.paymentProfiles,
            { ...payload, id: `payment-${Date.now()}-${state.paymentProfiles.length}` },
          ],
        })),
      addGiftWalletEntry: (payload) =>
        set((state) => ({
          giftWallet: [
            {
              ...payload,
              id: `gift-${Date.now()}-${state.giftWallet.length}`,
            },
            ...state.giftWallet,
          ],
        })),
      redeemReward: ({ rewardId, title, points, walletAmount }) => {
        let result = { ok: false, remainingPoints: 0 };

        set((state) => {
          if (state.rewardPoints < points) {
            result = {
              ok: false,
              remainingPoints: state.rewardPoints,
            };
            return state;
          }

          const remainingPoints = state.rewardPoints - points;

          result = {
            ok: true,
            remainingPoints,
          };

          return {
            rewardPoints: remainingPoints,
            giftWallet: [
              {
                id: `gift-${Date.now()}-${state.giftWallet.length}`,
                code: rewardId.toUpperCase(),
                amount: walletAmount,
                title,
                expiresAt: "2026-12-31",
              },
              ...state.giftWallet,
            ],
            redeemedRewards: [
              {
                id: `reward-${Date.now()}-${state.redeemedRewards.length}`,
                rewardId,
                title,
                pointsUsed: points,
                walletAmount,
                redeemedAt: "2026-03-28",
              },
              ...state.redeemedRewards,
            ],
          };
        });

        return result;
      },
    }),
    {
      name: "siam-lux-user",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
