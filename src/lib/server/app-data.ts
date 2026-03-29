import type {
  AccountBootstrapPayload,
  BackendDiningPreferences,
  BackendGiftWalletEntry,
  BackendInvoiceProfile,
  BackendNotification,
  BackendNotificationSettings,
  BackendOrder,
  BackendRedeemedRewardEntry,
  BackendReservationRecord,
  BackendSavedAddress,
  BackendSavedPaymentMethod,
  BackendSubmittedReview,
} from "@/lib/backend/types";
import type { BranchId, ServiceMode } from "@/lib/experience";

type ServerSupabase = NonNullable<
  Awaited<ReturnType<typeof import("@/lib/supabase/server").createClient>>
>;

const defaultNotificationSettings: BackendNotificationSettings = {
  marketing: true,
  orderUpdates: true,
  reservationReminders: true,
  loyaltyDigest: true,
};

const defaultPreferences: BackendDiningPreferences = {
  spiceLevel: 3,
  allergenNotes: "",
  favoriteOccasion: "date",
  preferredBranchId: "bangrak",
  preferredServiceMode: "delivery",
};

const defaultInvoiceProfile: BackendInvoiceProfile = {
  needsReceipt: true,
  taxInvoice: false,
  companyName: "",
  taxId: "",
  email: "",
};

export async function getAccountBootstrap(
  supabase: ServerSupabase,
  userId: string,
  fallback: {
    email: string;
    fullName: string;
    phone: string;
    memberSince: string;
  },
): Promise<AccountBootstrapPayload> {
  const [
    profileResult,
    preferencesResult,
    notificationPreferencesResult,
    addressesResult,
    paymentMethodsResult,
    favoritesResult,
    giftWalletResult,
    redemptionsResult,
    reservationsResult,
    reviewsResult,
    ordersResult,
    notificationsResult,
    loyaltyAccountResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "email, full_name, phone, created_at, notes, address_line, district, city, payment_method",
      )
      .eq("id", userId)
      .maybeSingle(),
    supabase.from("user_preferences").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("notification_preferences").select("*").eq("user_id", userId).maybeSingle(),
    supabase.from("saved_addresses").select("*").eq("user_id", userId).order("created_at", { ascending: true }),
    supabase
      .from("saved_payment_methods")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true }),
    supabase.from("favorite_dishes").select("dish_id").eq("user_id", userId),
    supabase.from("gift_wallet_entries").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase
      .from("reward_redemptions")
      .select("*")
      .eq("user_id", userId)
      .order("redeemed_at", { ascending: false }),
    supabase.from("reservations").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("reviews").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase
      .from("orders")
      .select(
        "id, code, branch_id, service_mode, status, payment_status, created_at, eta_minutes, total, order_items(id, dish_id, dish_name, quantity, unit_price, spice_level, toppings), order_status_history(id, status, occurred_at)",
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false }),
    supabase.from("notifications").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    supabase.from("loyalty_accounts").select("*").eq("user_id", userId).maybeSingle(),
  ]);

  const profile = profileResult.data;
  const preferences = preferencesResult.data;
  const notificationPreferences = notificationPreferencesResult.data;
  const addresses = (addressesResult.data ?? []) as Array<Record<string, unknown>>;
  const paymentMethods = (paymentMethodsResult.data ?? []) as Array<Record<string, unknown>>;
  const favorites = (favoritesResult.data ?? []) as Array<{ dish_id: string }>;
  const giftWallet = (giftWalletResult.data ?? []) as Array<Record<string, unknown>>;
  const redemptions = (redemptionsResult.data ?? []) as Array<Record<string, unknown>>;
  const reservations = (reservationsResult.data ?? []) as Array<Record<string, unknown>>;
  const reviews = (reviewsResult.data ?? []) as Array<Record<string, unknown>>;
  const orders = (ordersResult.data ?? []) as Array<Record<string, unknown>>;
  const notifications = (notificationsResult.data ?? []) as Array<Record<string, unknown>>;
  const loyaltyAccount = loyaltyAccountResult.data;

  const savedAddresses: BackendSavedAddress[] =
    addresses.length > 0
      ? addresses.map((item) => ({
          id: String(item.id),
          label: String(item.label ?? "Primary"),
          recipient: String(item.recipient ?? fallback.fullName),
          phone: String(item.phone ?? fallback.phone),
          addressLine: String(item.address_line ?? ""),
          district: String(item.district ?? ""),
          city: String(item.city ?? "Bangkok"),
          isPrimary: Boolean(item.is_primary),
        }))
      : [
          {
            id: "address-home",
            label: "Home",
            recipient: fallback.fullName,
            phone: fallback.phone,
            addressLine: String(profile?.address_line ?? ""),
            district: String(profile?.district ?? ""),
            city: String(profile?.city ?? "Bangkok"),
            isPrimary: true,
          },
        ];

  const savedPaymentMethods: BackendSavedPaymentMethod[] =
    paymentMethods.length > 0
      ? paymentMethods.map((item) => ({
          id: String(item.id),
          label: String(item.label ?? "PromptPay"),
          kind: (item.kind as "cash" | "card" | "promptpay") ?? "promptpay",
          last4: item.last4 ? String(item.last4) : undefined,
          isPrimary: Boolean(item.is_primary),
        }))
      : [{ id: "payment-promptpay", label: "PromptPay", kind: "promptpay", isPrimary: true }];

  const backendOrders: BackendOrder[] = orders.map((item) => ({
    id: String(item.id),
    code: String(item.code),
    branchId: String(item.branch_id) as BranchId,
    serviceMode: String(item.service_mode) as ServiceMode,
    status: String(item.status),
    paymentStatus: String(item.payment_status),
    placedAt: String(item.created_at),
    etaMinutes: Number(item.eta_minutes ?? 35),
    total: Number(item.total ?? 0),
    items: ((item.order_items as Array<Record<string, unknown>> | null) ?? []).map((orderItem) => ({
      id: String(orderItem.id),
      dishId: String(orderItem.dish_id),
      dishName: String(orderItem.dish_name),
      quantity: Number(orderItem.quantity ?? 1),
      unitPrice: Number(orderItem.unit_price ?? 0),
      spiceLevel: Number(orderItem.spice_level ?? 0),
      toppings: Array.isArray(orderItem.toppings)
        ? orderItem.toppings.map((entry) => String(entry))
        : [],
    })),
    stages: ((item.order_status_history as Array<Record<string, unknown>> | null) ?? []).map((stage) => ({
      id: String(stage.id),
      status: String(stage.status),
      occurredAt: String(stage.occurred_at),
    })),
  }));

  return {
    authenticated: true,
    profile: {
      authStatus: "member",
      email: String(profile?.email ?? fallback.email),
      memberSince: String(profile?.created_at ?? fallback.memberSince).slice(0, 10),
      fullName: String(profile?.full_name ?? fallback.fullName),
      phone: String(profile?.phone ?? fallback.phone),
      addressLine: String(profile?.address_line ?? ""),
      district: String(profile?.district ?? ""),
      city: String(profile?.city ?? "Bangkok"),
      notes: String(profile?.notes ?? ""),
      paymentMethod: (profile?.payment_method as "cash" | "card" | "promptpay") ?? "promptpay",
      notificationSettings: notificationPreferences
        ? {
            marketing: Boolean(notificationPreferences.marketing),
            orderUpdates: Boolean(notificationPreferences.order_updates),
            reservationReminders: Boolean(notificationPreferences.reservation_reminders),
            loyaltyDigest: Boolean(notificationPreferences.loyalty_digest),
          }
        : defaultNotificationSettings,
      preferences: preferences
        ? {
            spiceLevel: Number(preferences.spice_level ?? 3),
            allergenNotes: String(preferences.allergen_notes ?? ""),
            favoriteOccasion:
              (preferences.favorite_occasion as BackendDiningPreferences["favoriteOccasion"]) ?? "date",
            preferredBranchId:
              (preferences.preferred_branch_id as BackendDiningPreferences["preferredBranchId"]) ??
              "bangrak",
            preferredServiceMode:
              (preferences.preferred_service_mode as BackendDiningPreferences["preferredServiceMode"]) ??
              "delivery",
          }
        : defaultPreferences,
      invoiceProfile: preferences
        ? {
            needsReceipt: Boolean(preferences.needs_receipt),
            taxInvoice: Boolean(preferences.tax_invoice),
            companyName: String(preferences.company_name ?? ""),
            taxId: String(preferences.tax_id ?? ""),
            email: String(preferences.invoice_email ?? fallback.email),
          }
        : { ...defaultInvoiceProfile, email: fallback.email },
      savedAddresses,
      paymentProfiles: savedPaymentMethods,
      giftWallet: giftWallet.map((item) => ({
        id: String(item.id),
        code: String(item.code),
        amount: Number(item.amount ?? 0),
        title: String(item.title),
        expiresAt: String(item.expires_at),
      })) as BackendGiftWalletEntry[],
      rewardPoints:
        loyaltyAccount !== null && loyaltyAccount !== undefined
          ? Number(loyaltyAccount.current_points ?? 0)
          : 1280 - redemptions.reduce((sum, item) => sum + Number(item.points_used ?? 0), 0),
      redeemedRewards: redemptions.map((item) => ({
        id: String(item.id),
        rewardId: String(item.reward_id),
        title: String(item.title),
        pointsUsed: Number(item.points_used ?? 0),
        walletAmount: Number(item.wallet_amount ?? 0),
        redeemedAt: String(item.redeemed_at),
      })) as BackendRedeemedRewardEntry[],
      activeAddressId: savedAddresses.find((item) => item.isPrimary)?.id ?? savedAddresses[0]?.id ?? "",
      activePaymentProfileId:
        savedPaymentMethods.find((item) => item.isPrimary)?.id ?? savedPaymentMethods[0]?.id ?? "",
    },
    favoriteDishIds: favorites.map((item) => item.dish_id),
    reservations: reservations.map((item) => ({
      id: String(item.id),
      branchId: String(item.branch_id) as BranchId,
      guestCount: Number(item.guest_count ?? 2),
      date: String(item.reservation_date),
      timeSlot: String(item.time_slot),
      seating: String(item.seating),
      occasion: String(item.occasion),
      contactName: String(item.contact_name),
      phone: String(item.phone),
      notes: String(item.notes ?? ""),
      status: String(item.status) as BackendReservationRecord["status"],
    })) as BackendReservationRecord[],
    submittedReviews: reviews.map((item) => ({
      id: String(item.id),
      dishId: String(item.dish_id),
      guest: String(item.guest),
      region: String(item.region),
      body: String(item.body),
      rating: Number(item.rating ?? 5),
      locale: String(item.locale ?? "th") as BackendSubmittedReview["locale"],
    })) as BackendSubmittedReview[],
    orders: backendOrders,
    notifications: notifications.map((item) => ({
      id: String(item.id),
      title: String(item.title),
      body: String(item.body),
      kind: String(item.kind ?? "info"),
      link: item.link ? String(item.link) : null,
      createdAt: String(item.created_at),
      readAt: item.read_at ? String(item.read_at) : null,
    })) as BackendNotification[],
  };
}

export async function syncAccountSnapshot(
  supabase: ServerSupabase,
  userId: string,
  payload: AccountBootstrapPayload["profile"] & { favoriteDishIds: string[] },
) {
  await supabase.from("profiles").upsert({
    id: userId,
    email: payload.email,
    full_name: payload.fullName,
    phone: payload.phone,
    notes: payload.notes,
    address_line: payload.addressLine,
    district: payload.district,
    city: payload.city,
    payment_method: payload.paymentMethod,
  });

  await supabase.from("user_preferences").upsert({
    user_id: userId,
    spice_level: payload.preferences.spiceLevel,
    allergen_notes: payload.preferences.allergenNotes,
    favorite_occasion: payload.preferences.favoriteOccasion,
    preferred_branch_id: payload.preferences.preferredBranchId,
    preferred_service_mode: payload.preferences.preferredServiceMode,
    needs_receipt: payload.invoiceProfile.needsReceipt,
    tax_invoice: payload.invoiceProfile.taxInvoice,
    company_name: payload.invoiceProfile.companyName,
    tax_id: payload.invoiceProfile.taxId,
    invoice_email: payload.invoiceProfile.email,
  });

  await supabase.from("notification_preferences").upsert({
    user_id: userId,
    marketing: payload.notificationSettings.marketing,
    order_updates: payload.notificationSettings.orderUpdates,
    reservation_reminders: payload.notificationSettings.reservationReminders,
    loyalty_digest: payload.notificationSettings.loyaltyDigest,
  });

  await supabase.from("saved_addresses").delete().eq("user_id", userId);
  if (payload.savedAddresses.length > 0) {
    await supabase.from("saved_addresses").insert(
      payload.savedAddresses.map((item) => ({
        id: item.id,
        user_id: userId,
        label: item.label,
        recipient: item.recipient,
        phone: item.phone,
        address_line: item.addressLine,
        district: item.district,
        city: item.city,
        is_primary: item.id === payload.activeAddressId || item.isPrimary === true,
      })),
    );
  }

  await supabase.from("saved_payment_methods").delete().eq("user_id", userId);
  if (payload.paymentProfiles.length > 0) {
    await supabase.from("saved_payment_methods").insert(
      payload.paymentProfiles.map((item) => ({
        id: item.id,
        user_id: userId,
        label: item.label,
        kind: item.kind,
        last4: item.last4 ?? null,
        is_primary: item.id === payload.activePaymentProfileId || item.isPrimary === true,
      })),
    );
  }

  await supabase.from("favorite_dishes").delete().eq("user_id", userId);
  if (payload.favoriteDishIds.length > 0) {
    await supabase.from("favorite_dishes").insert(
      payload.favoriteDishIds.map((dishId) => ({
        user_id: userId,
        dish_id: dishId,
      })),
    );
  }

  await supabase.from("gift_wallet_entries").delete().eq("user_id", userId);
  if (payload.giftWallet.length > 0) {
    await supabase.from("gift_wallet_entries").insert(
      payload.giftWallet.map((item) => ({
        id: item.id,
        user_id: userId,
        code: item.code,
        title: item.title,
        amount: item.amount,
        expires_at: item.expiresAt,
      })),
    );
  }

  await supabase.from("reward_redemptions").delete().eq("user_id", userId);
  if (payload.redeemedRewards.length > 0) {
    await supabase.from("reward_redemptions").insert(
      payload.redeemedRewards.map((item) => ({
        id: item.id,
        user_id: userId,
        reward_id: item.rewardId,
        title: item.title,
        points_used: item.pointsUsed,
        wallet_amount: item.walletAmount,
        redeemed_at: item.redeemedAt,
      })),
    );
  }
}
