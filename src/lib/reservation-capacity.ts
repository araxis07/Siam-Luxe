import type { BranchId } from "@/lib/experience";

export type ReservationSeatingId = "salon" | "terrace" | "counter" | "private";

export const reservationTimeSlots = ["18:00", "19:00", "20:30", "21:30"] as const;

export const reservationSeatingCapacities: Record<ReservationSeatingId, number> = {
  salon: 20,
  terrace: 10,
  counter: 8,
  private: 16,
};

export const reservationBaseLoads: Record<
  BranchId,
  Record<string, Partial<Record<ReservationSeatingId, number>>>
> = {
  bangrak: {
    "18:00": { salon: 11, terrace: 4, counter: 4, private: 8 },
    "19:00": { salon: 17, terrace: 8, counter: 7, private: 15 },
    "20:30": { salon: 18, terrace: 10, counter: 8, private: 16 },
    "21:30": { salon: 12, terrace: 6, counter: 4, private: 12 },
  },
  sukhumvit: {
    "18:00": { salon: 8, terrace: 2, counter: 5, private: 4 },
    "19:00": { salon: 15, terrace: 5, counter: 7, private: 9 },
    "20:30": { salon: 18, terrace: 8, counter: 8, private: 12 },
    "21:30": { salon: 10, terrace: 3, counter: 5, private: 6 },
  },
  chiangmai: {
    "18:00": { salon: 7, terrace: 3, counter: 2, private: 4 },
    "19:00": { salon: 13, terrace: 6, counter: 4, private: 8 },
    "20:30": { salon: 16, terrace: 8, counter: 5, private: 11 },
    "21:30": { salon: 9, terrace: 4, counter: 3, private: 6 },
  },
};

export interface ReservationCapacityInput {
  id?: string;
  seating: string;
  guestCount: number;
  status: string;
}

export interface ReservationSeatAvailability {
  id: ReservationSeatingId;
  reserved: number;
  capacity: number;
  remaining: number;
  isFull: boolean;
}

export function getReservationSeatPreview({
  branchId,
  timeSlot,
  guestCount,
  reservations,
}: {
  branchId: BranchId;
  timeSlot: string;
  guestCount: number;
  reservations: ReservationCapacityInput[];
}): ReservationSeatAvailability[] {
  return (Object.keys(reservationSeatingCapacities) as ReservationSeatingId[]).map((seatId) => {
    const baseReserved = reservationBaseLoads[branchId]?.[timeSlot]?.[seatId] ?? 0;
    const liveReserved = reservations
      .filter((item) => item.status === "confirmed" && item.seating === seatId)
      .reduce((sum, item) => sum + item.guestCount, 0);
    const capacity = reservationSeatingCapacities[seatId];
    const reserved = baseReserved + liveReserved;
    const remaining = Math.max(0, capacity - reserved);

    return {
      id: seatId,
      reserved,
      capacity,
      remaining,
      isFull: remaining < guestCount,
    };
  });
}

export function resolveReservationStatusForCapacity({
  branchId,
  timeSlot,
  seating,
  guestCount,
  requestedStatus,
  reservations,
}: {
  branchId: BranchId;
  timeSlot: string;
  seating: string;
  guestCount: number;
  requestedStatus: "confirmed" | "waitlist" | "cancelled";
  reservations: ReservationCapacityInput[];
}) {
  if (requestedStatus === "cancelled") {
    return "cancelled" as const;
  }

  if (requestedStatus === "waitlist") {
    return "waitlist" as const;
  }

  const seatPreview = getReservationSeatPreview({
    branchId,
    timeSlot,
    guestCount,
    reservations,
  }).find((entry) => entry.id === seating);

  if (!seatPreview || seatPreview.isFull) {
    return "waitlist" as const;
  }

  return "confirmed" as const;
}
