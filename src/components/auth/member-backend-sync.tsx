"use client";

import { useEffect, useRef } from "react";

import type { AccountBootstrapPayload } from "@/lib/backend/types";
import { useFavoritesStore } from "@/store/favorites-store";
import { useMemberDataStore } from "@/store/member-data-store";
import { useReservationStore } from "@/store/reservation-store";
import { useReviewStore } from "@/store/review-store";
import { useUserStore } from "@/store/user-store";

export function MemberBackendSync() {
  const authStatus = useUserStore((state) => state.authStatus);
  const email = useUserStore((state) => state.email);
  const memberSince = useUserStore((state) => state.memberSince);
  const fullName = useUserStore((state) => state.fullName);
  const phone = useUserStore((state) => state.phone);
  const addressLine = useUserStore((state) => state.addressLine);
  const district = useUserStore((state) => state.district);
  const city = useUserStore((state) => state.city);
  const notes = useUserStore((state) => state.notes);
  const paymentMethod = useUserStore((state) => state.paymentMethod);
  const notificationSettings = useUserStore((state) => state.notificationSettings);
  const preferences = useUserStore((state) => state.preferences);
  const invoiceProfile = useUserStore((state) => state.invoiceProfile);
  const savedAddresses = useUserStore((state) => state.savedAddresses);
  const paymentProfiles = useUserStore((state) => state.paymentProfiles);
  const giftWallet = useUserStore((state) => state.giftWallet);
  const rewardPoints = useUserStore((state) => state.rewardPoints);
  const redeemedRewards = useUserStore((state) => state.redeemedRewards);
  const activeAddressId = useUserStore((state) => state.activeAddressId);
  const activePaymentProfileId = useUserStore((state) => state.activePaymentProfileId);
  const hydrateAccountData = useUserStore((state) => state.hydrateAccountData);
  const favoriteDishIds = useFavoritesStore((state) => state.favoriteDishIds);
  const setFavoriteDishIds = useFavoritesStore((state) => state.setFavoriteDishIds);
  const setReservations = useReservationStore((state) => state.setReservations);
  const setSubmittedReviews = useReviewStore((state) => state.setSubmittedReviews);
  const setOrders = useMemberDataStore((state) => state.setOrders);
  const setNotifications = useMemberDataStore((state) => state.setNotifications);
  const clearMemberData = useMemberDataStore((state) => state.clear);
  const bootstrapped = useRef(false);
  const bootstrapKey = useRef("");

  useEffect(() => {
    if (authStatus !== "member" || !email) {
      bootstrapped.current = false;
      bootstrapKey.current = "";
      clearMemberData();
      return;
    }

    if (bootstrapKey.current === email) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      const response = await fetch("/api/account/bootstrap", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as AccountBootstrapPayload;

      if (cancelled || !payload.authenticated || !payload.profile) {
        return;
      }

      hydrateAccountData(payload.profile);
      setFavoriteDishIds(payload.favoriteDishIds);
      setReservations(payload.reservations);
      setSubmittedReviews(payload.submittedReviews);
      setOrders(payload.orders);
      setNotifications(payload.notifications);
      bootstrapKey.current = payload.profile.email || email;
      bootstrapped.current = true;
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    authStatus,
    clearMemberData,
    email,
    hydrateAccountData,
    setFavoriteDishIds,
    setNotifications,
    setOrders,
    setReservations,
    setSubmittedReviews,
  ]);

  useEffect(() => {
    if (authStatus !== "member" || !email || !bootstrapped.current) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void fetch("/api/account/sync", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: {
            email,
            memberSince,
            fullName,
            phone,
            addressLine,
            district,
            city,
            notes,
            paymentMethod,
            notificationSettings,
            preferences,
            invoiceProfile,
            savedAddresses,
            paymentProfiles,
            giftWallet,
            rewardPoints,
            redeemedRewards,
            activeAddressId,
            activePaymentProfileId,
          },
          favoriteDishIds,
        }),
      });
    }, 500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    activeAddressId,
    activePaymentProfileId,
    addressLine,
    authStatus,
    city,
    district,
    email,
    favoriteDishIds,
    fullName,
    giftWallet,
    invoiceProfile,
    memberSince,
    notes,
    notificationSettings,
    paymentMethod,
    paymentProfiles,
    phone,
    preferences,
    redeemedRewards,
    rewardPoints,
    savedAddresses,
  ]);

  return null;
}
