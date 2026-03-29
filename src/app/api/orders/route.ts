import { z } from "zod";

import { getCurrentUser } from "@/lib/server/auth";
import { enqueueAndDispatchEmail } from "@/lib/server/email";
import { fail, ok } from "@/lib/server/http";
import { getPromoDiscount, getPromoOffer } from "@/lib/server/promos";

const orderSchema = z.object({
  branchId: z.enum(["bangrak", "sukhumvit", "chiangmai"]),
  serviceMode: z.enum(["delivery", "pickup"]),
  locale: z.enum(["th", "en", "ja", "zh", "ko"]).default("th"),
  promoCode: z.string().nullable().optional(),
  deliveryTime: z.string().default("asap"),
  contactName: z.string().min(2),
  phone: z.string().min(7),
  addressLine: z.string().min(5),
  district: z.string().min(2),
  city: z.string().min(2),
  notes: z.string().optional().default(""),
  paymentMethod: z.enum(["cash", "card", "promptpay"]),
  invoiceProfile: z.object({
    needsReceipt: z.boolean(),
    taxInvoice: z.boolean(),
    companyName: z.string(),
    taxId: z.string(),
    email: z.string(),
  }),
  items: z.array(
    z.object({
      dishId: z.string(),
      dishName: z.string(),
      quantity: z.number().int().positive(),
      unitPrice: z.number().nonnegative(),
      spiceLevel: z.number().int().min(0).max(5),
      toppings: z.array(z.string()),
    }),
  ).min(1),
});

function buildOrderCode() {
  const now = new Date();
  const date = `${now.getUTCFullYear()}${String(now.getUTCMonth() + 1).padStart(2, "0")}${String(
    now.getUTCDate(),
  ).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `SLX-${date}-${suffix}`;
}

export async function GET() {
  const { supabase, user } = await getCurrentUser();

  if (!user) {
    return ok([]);
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, code, branch_id, service_mode, status, payment_status, created_at, eta_minutes, total, order_items(id, dish_id, dish_name, quantity, unit_price, spice_level, toppings), order_status_history(id, status, occurred_at)",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return fail("Unable to load orders", 500, error.message);
  }

  return ok(
    (data ?? []).map((item) => ({
      id: item.id,
      code: item.code,
      branchId: item.branch_id,
      serviceMode: item.service_mode,
      status: item.status,
      paymentStatus: item.payment_status,
      placedAt: item.created_at,
      etaMinutes: item.eta_minutes,
      total: Number(item.total ?? 0),
      items: (item.order_items ?? []).map((orderItem) => ({
        id: orderItem.id,
        dishId: orderItem.dish_id,
        dishName: orderItem.dish_name,
        quantity: orderItem.quantity,
        unitPrice: Number(orderItem.unit_price ?? 0),
        spiceLevel: orderItem.spice_level,
        toppings: Array.isArray(orderItem.toppings)
          ? orderItem.toppings.map((entry) => String(entry))
          : [],
      })),
      stages: (item.order_status_history ?? []).map((stage) => ({
        id: stage.id,
        status: stage.status,
        occurredAt: stage.occurred_at,
      })),
    })),
  );
}

export async function POST(request: Request) {
  const { supabase, user } = await getCurrentUser();
  const parsed = orderSchema.safeParse(await request.json());

  if (!parsed.success) {
    return fail("Invalid order payload", 400, parsed.error.flatten());
  }

  const payload = parsed.data;
  const subtotal = payload.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const offer = await getPromoOffer(supabase, payload.promoCode ?? null);
  const discount = getPromoDiscount(subtotal, offer);
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const delivery = discountedSubtotal === 0 ? 0 : discountedSubtotal >= 1600 ? 0 : 79;
  const service = discountedSubtotal === 0 ? 0 : Math.round(discountedSubtotal * 0.05);
  const totals = {
    subtotal,
    discount,
    discountedSubtotal,
    delivery,
    service,
    total: discountedSubtotal + delivery + service,
  };
  const code = buildOrderCode();
  const etaMinutes = payload.serviceMode === "pickup" ? 22 : 35;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      code,
      user_id: user?.id ?? null,
      branch_id: payload.branchId,
      service_mode: payload.serviceMode,
      status: "confirmed",
      payment_status: payload.paymentMethod === "cash" ? "pending" : "pending",
      payment_method: payload.paymentMethod,
      promo_code: offer?.code ?? null,
      subtotal: totals.subtotal,
      discount: totals.discount,
      discounted_subtotal: totals.discountedSubtotal,
      delivery_fee: totals.delivery,
      service_fee: totals.service,
      total: totals.total,
      delivery_time: payload.deliveryTime,
      contact_name: payload.contactName,
      phone: payload.phone,
      address_line: payload.addressLine,
      district: payload.district,
      city: payload.city,
      notes: payload.notes,
      eta_minutes: etaMinutes,
      needs_receipt: payload.invoiceProfile.needsReceipt,
      tax_invoice: payload.invoiceProfile.taxInvoice,
      company_name: payload.invoiceProfile.companyName,
      tax_id: payload.invoiceProfile.taxId,
      invoice_email: payload.invoiceProfile.email,
    })
    .select("id, code, branch_id, service_mode, status, payment_status, created_at, eta_minutes, total")
    .single();

  if (orderError || !order) {
    return fail("Unable to create order", 500, orderError?.message);
  }

  const { error: itemError } = await supabase.from("order_items").insert(
    payload.items.map((item) => ({
      order_id: order.id,
      dish_id: item.dishId,
      dish_name: item.dishName,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      spice_level: item.spiceLevel,
      toppings: item.toppings,
    })),
  );

  if (itemError) {
    return fail("Unable to create order items", 500, itemError.message);
  }

  const { data: stage, error: stageError } = await supabase.from("order_status_history").insert({
    order_id: order.id,
    status: "confirmed",
  }).select("id, status, occurred_at").single();

  if (stageError || !stage) {
    return fail("Unable to create order timeline", 500, stageError?.message);
  }

  if (user?.id) {
    await supabase.from("notifications").insert({
      user_id: user.id,
      title: code,
      body: `${code} · ${payload.branchId} · THB ${totals.total}`,
      kind: "order-placed",
      link: "/tracking",
    });

    if (user.email) {
      await enqueueAndDispatchEmail(supabase, {
        userId: user.id,
        toEmail: user.email,
        subject: `Siam Lux order confirmed · ${code}`,
        templateKey: "order-confirmed",
        htmlBody: `<p>Your order ${code} has been placed for ${payload.branchId}. Total: THB ${totals.total}.</p>`,
      });
    }
  }

  return ok({
    id: order.id,
    code: order.code,
    branchId: order.branch_id,
    serviceMode: order.service_mode,
    status: order.status,
    paymentStatus: order.payment_status,
    placedAt: order.created_at,
    etaMinutes: order.eta_minutes,
    total: Number(order.total ?? 0),
    items: payload.items.map((item, index) => ({
      id: `${order.id}-item-${index}`,
      dishId: item.dishId,
      dishName: item.dishName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      spiceLevel: item.spiceLevel,
      toppings: item.toppings,
    })),
    stages: [
      {
        id: stage.id,
        status: stage.status,
        occurredAt: stage.occurred_at,
      },
    ],
  });
}
