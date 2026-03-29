import type { AppLocale } from "@/i18n/routing";
import type { BranchId, ServiceMode } from "@/lib/experience";

export interface BackendSavedAddress {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  addressLine: string;
  district: string;
  city: string;
  isPrimary?: boolean;
}

export interface BackendSavedPaymentMethod {
  id: string;
  label: string;
  kind: "card" | "promptpay" | "cash";
  last4?: string;
  isPrimary?: boolean;
}

export interface BackendGiftWalletEntry {
  id: string;
  code: string;
  amount: number;
  title: string;
  expiresAt: string;
}

export interface BackendRedeemedRewardEntry {
  id: string;
  rewardId: string;
  title: string;
  pointsUsed: number;
  walletAmount: number;
  redeemedAt: string;
}

export interface BackendNotificationSettings {
  marketing: boolean;
  orderUpdates: boolean;
  reservationReminders: boolean;
  loyaltyDigest: boolean;
}

export interface BackendDiningPreferences {
  spiceLevel: number;
  allergenNotes: string;
  favoriteOccasion: "casual" | "date" | "celebration" | "business" | "family";
  preferredBranchId: BranchId;
  preferredServiceMode: ServiceMode;
}

export interface BackendInvoiceProfile {
  needsReceipt: boolean;
  taxInvoice: boolean;
  companyName: string;
  taxId: string;
  email: string;
}

export interface BackendReservationRecord {
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

export interface BackendSubmittedReview {
  id: string;
  dishId: string;
  guest: string;
  region: string;
  body: string;
  rating: number;
  locale: AppLocale;
}

export interface BackendOrderItem {
  id: string;
  dishId: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
  spiceLevel: number;
  toppings: string[];
}

export interface BackendOrderStage {
  id: string;
  status: string;
  occurredAt: string;
}

export interface BackendOrder {
  id: string;
  code: string;
  branchId: BranchId;
  serviceMode: ServiceMode;
  status: string;
  paymentStatus: string;
  placedAt: string;
  etaMinutes: number;
  total: number;
  items: BackendOrderItem[];
  stages: BackendOrderStage[];
}

export interface BackendNotification {
  id: string;
  title: string;
  body: string;
  kind: string;
  link: string | null;
  createdAt: string;
  readAt: string | null;
}

export interface AccountBootstrapPayload {
  authenticated: boolean;
  profile: {
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
  } | null;
  favoriteDishIds: string[];
  reservations: BackendReservationRecord[];
  submittedReviews: BackendSubmittedReview[];
  orders: BackendOrder[];
  notifications: BackendNotification[];
}
