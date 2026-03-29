"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { BranchId } from "@/lib/experience";

export interface ReservationRecord {
  id: string;
  branchId: BranchId;
  guestCount: number;
  date: string;
  timeSlot: string;
  seating: string;
  occasion: string;
  contactName: string;
  phone: string;
  notes: string;
  status: "confirmed" | "waitlist" | "cancelled";
}

interface ReservationState {
  reservations: ReservationRecord[];
  setReservations: (reservations: ReservationRecord[]) => void;
  createReservation: (payload: Omit<ReservationRecord, "id" | "status">) => ReservationRecord;
  joinWaitlist: (payload: Omit<ReservationRecord, "id" | "status">) => ReservationRecord;
  cancelReservation: (id: string) => void;
  updateReservation: (
    id: string,
    patch: Partial<Omit<ReservationRecord, "id">>,
  ) => void;
}

function buildId() {
  return `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export const useReservationStore = create<ReservationState>()(
  persist(
    (set) => ({
      reservations: [
        {
          id: "res-001",
          branchId: "bangrak",
          guestCount: 4,
          date: "2026-04-04",
          timeSlot: "19:00",
          seating: "private",
          occasion: "celebration",
          contactName: "Siam Lux Guest",
          phone: "+66 81 234 5678",
          notes: "Anniversary seating",
          status: "confirmed",
        },
      ],
      setReservations: (reservations) => set({ reservations }),
      createReservation: (payload) => {
        const reservation = { ...payload, id: buildId(), status: "confirmed" as const };
        set((state) => ({
          reservations: [reservation, ...state.reservations],
        }));
        return reservation;
      },
      joinWaitlist: (payload) => {
        const reservation = { ...payload, id: buildId(), status: "waitlist" as const };
        set((state) => ({
          reservations: [reservation, ...state.reservations],
        }));
        return reservation;
      },
      cancelReservation: (id) =>
        set((state) => ({
          reservations: state.reservations.map((reservation) =>
            reservation.id === id ? { ...reservation, status: "cancelled" } : reservation,
          ),
        })),
      updateReservation: (id, patch) =>
        set((state) => ({
          reservations: state.reservations.map((reservation) =>
            reservation.id === id ? { ...reservation, ...patch } : reservation,
          ),
        })),
    }),
    {
      name: "siam-lux-reservations",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
