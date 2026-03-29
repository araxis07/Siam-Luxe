"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AppLocale } from "@/i18n/routing";

export interface SubmittedReview {
  id: string;
  dishId: string;
  guest: string;
  region: string;
  body: string;
  rating: number;
  locale: AppLocale;
}

interface ReviewState {
  submittedReviews: SubmittedReview[];
  setSubmittedReviews: (reviews: SubmittedReview[]) => void;
  submitReview: (payload: Omit<SubmittedReview, "id">) => void;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      submittedReviews: [],
      setSubmittedReviews: (submittedReviews) => set({ submittedReviews }),
      submitReview: (payload) =>
        set((state) => ({
          submittedReviews: [
            {
              ...payload,
              id: `review-${Date.now()}-${state.submittedReviews.length}`,
            },
            ...state.submittedReviews,
          ],
        })),
    }),
    {
      name: "siam-lux-reviews",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
