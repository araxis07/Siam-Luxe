"use client";

import { create } from "zustand";

import type { BackendNotification, BackendOrder } from "@/lib/backend/types";

interface MemberDataState {
  orders: BackendOrder[];
  notifications: BackendNotification[];
  setOrders: (orders: BackendOrder[]) => void;
  setNotifications: (notifications: BackendNotification[]) => void;
  prependOrder: (order: BackendOrder) => void;
  prependNotification: (notification: BackendNotification) => void;
  clear: () => void;
}

export const useMemberDataStore = create<MemberDataState>()((set) => ({
  orders: [],
  notifications: [],
  setOrders: (orders) => set({ orders }),
  setNotifications: (notifications) => set({ notifications }),
  prependOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders.filter((entry) => entry.id !== order.id)],
    })),
  prependNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications.filter((entry) => entry.id !== notification.id)],
    })),
  clear: () => set({ orders: [], notifications: [] }),
}));
