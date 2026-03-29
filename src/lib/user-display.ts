import type { AppLocale } from "@/i18n/routing";
import type { GiftWalletEntry, SavedAddress, SavedPaymentMethod } from "@/store/user-store";

const userDisplayText = {
  th: {
    defaultGuest: "",
    guestProfileEmail: "guest@siamlux.com",
    billingEmail: "billing@siamlux.com",
    invoiceCompany: "Siam Lux Hospitality",
    home: "บ้าน",
    primary: "หลัก",
    studio: "สตูดิโอ",
    promptpay: "PromptPay",
    visaEnding: "Visa ลงท้าย {last4}",
    mastercardEnding: "Mastercard ลงท้าย {last4}",
    cardEnding: "บัตรลงท้าย {last4}",
    houseGiftCard: "บัตรของขวัญจากร้าน",
    loyaltyWallet: "เครดิตรางวัลสมาชิก",
  },
  en: {
    defaultGuest: "",
    guestProfileEmail: "guest@siamlux.com",
    billingEmail: "billing@siamlux.com",
    invoiceCompany: "Siam Lux Hospitality",
    home: "Home",
    primary: "Primary",
    studio: "Studio",
    promptpay: "PromptPay",
    visaEnding: "Visa ending {last4}",
    mastercardEnding: "Mastercard ending {last4}",
    cardEnding: "Card ending {last4}",
    houseGiftCard: "House Gift Card",
    loyaltyWallet: "Loyalty Reward Wallet",
  },
  ja: {
    defaultGuest: "",
    guestProfileEmail: "guest@siamlux.com",
    billingEmail: "billing@siamlux.com",
    invoiceCompany: "Siam Lux Hospitality",
    home: "自宅",
    primary: "メイン",
    studio: "スタジオ",
    promptpay: "PromptPay",
    visaEnding: "Visa 下4桁 {last4}",
    mastercardEnding: "Mastercard 下4桁 {last4}",
    cardEnding: "カード下4桁 {last4}",
    houseGiftCard: "ハウスギフトカード",
    loyaltyWallet: "ロイヤルティ特典ウォレット",
  },
  zh: {
    defaultGuest: "",
    guestProfileEmail: "guest@siamlux.com",
    billingEmail: "billing@siamlux.com",
    invoiceCompany: "Siam Lux Hospitality",
    home: "家",
    primary: "主要",
    studio: "工作室",
    promptpay: "PromptPay",
    visaEnding: "Visa 尾号 {last4}",
    mastercardEnding: "Mastercard 尾号 {last4}",
    cardEnding: "银行卡尾号 {last4}",
    houseGiftCard: "门店礼品卡",
    loyaltyWallet: "会员奖励钱包",
  },
  ko: {
    defaultGuest: "",
    guestProfileEmail: "guest@siamlux.com",
    billingEmail: "billing@siamlux.com",
    invoiceCompany: "Siam Lux Hospitality",
    home: "집",
    primary: "기본",
    studio: "스튜디오",
    promptpay: "PromptPay",
    visaEnding: "Visa 끝자리 {last4}",
    mastercardEnding: "Mastercard 끝자리 {last4}",
    cardEnding: "카드 끝자리 {last4}",
    houseGiftCard: "하우스 기프트 카드",
    loyaltyWallet: "멤버십 리워드 월렛",
  },
} as const;

function replaceLast4(template: string, last4?: string) {
  return template.replace("{last4}", last4 ?? "----");
}

function matchesAny(value: string, candidates: string[]) {
  return candidates.includes(value);
}

export function normalizeSeedGuestName(value: string) {
  return value === "Siam Lux Guest" ? "" : value;
}

export function getGuestProfileEmailFallback(locale: AppLocale) {
  return userDisplayText[locale].guestProfileEmail;
}

export function getBillingEmailFallback(locale: AppLocale) {
  return userDisplayText[locale].billingEmail;
}

export function getInvoiceCompanyFallback(locale: AppLocale) {
  return userDisplayText[locale].invoiceCompany;
}

export function getLocalizedAddressLabel(locale: AppLocale, address: SavedAddress) {
  const text = userDisplayText[locale];

  if (address.id === "address-home" || matchesAny(address.label, ["Home", "บ้าน", "自宅", "家", "집"])) {
    return text.home;
  }

  if (matchesAny(address.label, ["Primary", "หลัก", "メイン", "主要", "기본"])) {
    return text.primary;
  }

  if (matchesAny(address.label, ["Studio", "สตูดิโอ", "スタジオ", "工作室", "스튜디오"])) {
    return text.studio;
  }

  return address.label;
}

export function getLocalizedPaymentLabel(locale: AppLocale, payment: SavedPaymentMethod) {
  const text = userDisplayText[locale];

  if (payment.kind === "promptpay" || payment.id === "payment-promptpay" || payment.label === "PromptPay") {
    return text.promptpay;
  }

  if ((payment.label.startsWith("Visa") || payment.id === "payment-visa") && payment.last4) {
    return replaceLast4(text.visaEnding, payment.last4);
  }

  if (payment.label.startsWith("Mastercard") && payment.last4) {
    return replaceLast4(text.mastercardEnding, payment.last4);
  }

  if (payment.last4) {
    return replaceLast4(text.cardEnding, payment.last4);
  }

  return payment.label;
}

export function getLocalizedWalletTitle(locale: AppLocale, wallet: GiftWalletEntry) {
  const text = userDisplayText[locale];

  if (wallet.id === "gift-001" || wallet.title === "House Gift Card") {
    return text.houseGiftCard;
  }

  if (wallet.id === "gift-002" || wallet.title === "Loyalty Reward Wallet") {
    return text.loyaltyWallet;
  }

  return wallet.title;
}
