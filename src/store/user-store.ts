"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  BackendDiningPreferences,
  BackendGiftWalletEntry,
  BackendInvoiceProfile,
  BackendNotificationSettings,
  BackendRedeemedRewardEntry,
  BackendSavedAddress,
  BackendSavedPaymentMethod,
} from "@/lib/backend/types";
import type { BranchId, ServiceMode } from "@/lib/experience";

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
  isPrimary?: boolean;
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

export interface NotificationSettings {
  marketing: boolean;
  orderUpdates: boolean;
  reservationReminders: boolean;
  loyaltyDigest: boolean;
}

export interface DiningPreferences {
  spiceLevel: number;
  allergenNotes: string;
  favoriteOccasion: "casual" | "date" | "celebration" | "business" | "family";
  preferredBranchId: BranchId;
  preferredServiceMode: ServiceMode;
}

export interface InvoiceProfile {
  needsReceipt: boolean;
  taxInvoice: boolean;
  companyName: string;
  taxId: string;
  email: string;
}

interface UserState {
  authStatus: "guest" | "member";
  email: string;
  memberSince: string;
  fullName: string;
  phone: string;
  addressLine: string;
  district: string;
  city: string;
  notes: string;
  paymentMethod: "cash" | "card" | "promptpay";
  notificationSettings: NotificationSettings;
  preferences: DiningPreferences;
  invoiceProfile: InvoiceProfile;
  savedAddresses: SavedAddress[];
  paymentProfiles: SavedPaymentMethod[];
  giftWallet: GiftWalletEntry[];
  rewardPoints: number;
  redeemedRewards: RedeemedRewardEntry[];
  activeAddressId: string;
  activePaymentProfileId: string;
  hydrateAccountData: (payload: {
    email: string;
    memberSince: string;
    fullName: string;
    phone: string;
    addressLine: string;
    district: string;
    city: string;
    notes: string;
    paymentMethod: "cash" | "card" | "promptpay";
    notificationSettings: BackendNotificationSettings;
    preferences: BackendDiningPreferences;
    invoiceProfile: BackendInvoiceProfile;
    savedAddresses: BackendSavedAddress[];
    paymentProfiles: BackendSavedPaymentMethod[];
    giftWallet: BackendGiftWalletEntry[];
    rewardPoints: number;
    redeemedRewards: BackendRedeemedRewardEntry[];
    activeAddressId: string;
    activePaymentProfileId: string;
  }) => void;
  signInMember: (payload: {
    fullName: string;
    email: string;
    phone?: string;
    memberSince?: string;
  }) => void;
  continueAsGuest: () => void;
  updateNotificationSettings: (patch: Partial<NotificationSettings>) => void;
  updatePreferences: (patch: Partial<DiningPreferences>) => void;
  updateInvoiceProfile: (patch: Partial<InvoiceProfile>) => void;
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
  updateSavedAddress: (id: string, patch: Partial<Omit<SavedAddress, "id">>) => void;
  removeSavedAddress: (id: string) => void;
  setPrimaryAddress: (id: string) => void;
  addPaymentProfile: (payload: Omit<SavedPaymentMethod, "id">) => void;
  removePaymentProfile: (id: string) => void;
  setPrimaryPaymentProfile: (id: string) => void;
  addGiftWalletEntry: (payload: Omit<GiftWalletEntry, "id">) => void;
  prependGiftWalletEntry: (payload: GiftWalletEntry) => void;
  prependRedeemedReward: (payload: RedeemedRewardEntry) => void;
  setRewardPoints: (points: number) => void;
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
      authStatus: "guest",
      email: "",
      memberSince: "2024-11-12",
      fullName: "Siam Lux Guest",
      phone: "",
      addressLine: "",
      district: "",
      city: "Bangkok",
      notes: "",
      paymentMethod: "promptpay",
      notificationSettings: {
        marketing: true,
        orderUpdates: true,
        reservationReminders: true,
        loyaltyDigest: true,
      },
      preferences: {
        spiceLevel: 3,
        allergenNotes: "",
        favoriteOccasion: "date",
        preferredBranchId: "bangrak",
        preferredServiceMode: "delivery",
      },
      invoiceProfile: {
        needsReceipt: true,
        taxInvoice: false,
        companyName: "",
        taxId: "",
        email: "",
      },
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
        { id: "payment-promptpay", label: "PromptPay", kind: "promptpay", isPrimary: true },
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
      hydrateAccountData: (payload) =>
        set((state) => ({
          authStatus: "member",
          email: payload.email || state.email,
          memberSince: payload.memberSince || state.memberSince,
          fullName: payload.fullName || state.fullName,
          phone: payload.phone,
          addressLine: payload.addressLine,
          district: payload.district,
          city: payload.city,
          notes: payload.notes,
          paymentMethod: payload.paymentMethod,
          notificationSettings: payload.notificationSettings,
          preferences: payload.preferences,
          invoiceProfile: payload.invoiceProfile,
          savedAddresses: payload.savedAddresses.length > 0 ? payload.savedAddresses : state.savedAddresses,
          paymentProfiles:
            payload.paymentProfiles.length > 0 ? payload.paymentProfiles : state.paymentProfiles,
          giftWallet: payload.giftWallet,
          rewardPoints: payload.rewardPoints,
          redeemedRewards: payload.redeemedRewards,
          activeAddressId:
            payload.activeAddressId || payload.savedAddresses[0]?.id || state.activeAddressId,
          activePaymentProfileId:
            payload.activePaymentProfileId ||
            payload.paymentProfiles[0]?.id ||
            state.activePaymentProfileId,
        })),
      signInMember: ({ fullName, email, phone, memberSince }) =>
        set((state) => ({
          authStatus: "member",
          fullName,
          email,
          phone: phone ?? state.phone,
          memberSince:
            memberSince ?? state.memberSince ?? new Date().toISOString().slice(0, 10),
          invoiceProfile: {
            ...state.invoiceProfile,
            email,
          },
        })),
      continueAsGuest: () =>
        set({
          authStatus: "guest",
          email: "",
        }),
      updateNotificationSettings: (patch) =>
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...patch },
        })),
      updatePreferences: (patch) =>
        set((state) => ({
          preferences: { ...state.preferences, ...patch },
        })),
      updateInvoiceProfile: (patch) =>
        set((state) => ({
          invoiceProfile: { ...state.invoiceProfile, ...patch },
        })),
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
            invoiceProfile: {
              ...state.invoiceProfile,
              email: state.invoiceProfile.email || state.email,
            },
          };
        }),
      setActiveAddress: (activeAddressId) => set({ activeAddressId }),
      setActivePaymentProfile: (activePaymentProfileId) => set({ activePaymentProfileId }),
      addSavedAddress: (payload) =>
        set((state) => ({
          savedAddresses: [
            ...state.savedAddresses,
            {
              ...payload,
              id: `address-${Date.now()}-${state.savedAddresses.length}`,
              isPrimary: payload.isPrimary ?? false,
            },
          ],
        })),
      updateSavedAddress: (id, patch) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
          ),
        })),
      removeSavedAddress: (id) =>
        set((state) => {
          const nextAddresses = state.savedAddresses.filter((item) => item.id !== id);
          const fallbackAddressId = nextAddresses[0]?.id ?? "";
          const activeAddressId =
            state.activeAddressId === id ? fallbackAddressId : state.activeAddressId;

          return {
            savedAddresses: nextAddresses.map((item, index) => ({
              ...item,
              isPrimary: activeAddressId ? item.id === activeAddressId : index === 0,
            })),
            activeAddressId,
          };
        }),
      setPrimaryAddress: (id) =>
        set((state) => ({
          savedAddresses: state.savedAddresses.map((item) => ({
            ...item,
            isPrimary: item.id === id,
          })),
          activeAddressId: id,
        })),
      addPaymentProfile: (payload) =>
        set((state) => ({
          paymentProfiles: [
            ...state.paymentProfiles,
            {
              ...payload,
              id: `payment-${Date.now()}-${state.paymentProfiles.length}`,
              isPrimary: payload.isPrimary ?? false,
            },
          ],
        })),
      removePaymentProfile: (id) =>
        set((state) => {
          const nextPayments = state.paymentProfiles.filter((item) => item.id !== id);
          const fallbackPaymentId = nextPayments[0]?.id ?? "";
          const activePaymentProfileId =
            state.activePaymentProfileId === id ? fallbackPaymentId : state.activePaymentProfileId;

          return {
            paymentProfiles: nextPayments.map((item, index) => ({
              ...item,
              isPrimary: activePaymentProfileId ? item.id === activePaymentProfileId : index === 0,
            })),
            activePaymentProfileId,
          };
        }),
      setPrimaryPaymentProfile: (id) =>
        set((state) => ({
          paymentProfiles: state.paymentProfiles.map((item) => ({
            ...item,
            isPrimary: item.id === id,
          })),
          activePaymentProfileId: id,
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
      prependGiftWalletEntry: (payload) =>
        set((state) => ({
          giftWallet: [payload, ...state.giftWallet.filter((entry) => entry.id !== payload.id)],
        })),
      prependRedeemedReward: (payload) =>
        set((state) => ({
          redeemedRewards: [payload, ...state.redeemedRewards.filter((entry) => entry.id !== payload.id)],
        })),
      setRewardPoints: (rewardPoints) => set({ rewardPoints }),
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
