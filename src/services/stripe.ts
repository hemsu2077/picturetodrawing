import Stripe from "stripe";
import { updateOrder, updateSubOrder } from "./order";

// handle checkout session completed
export async function handleCheckoutSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  try {
    // not handle unpaid session
    if (session.payment_status !== "paid") {
      throw new Error("not handle unpaid session");
    }

    // get session metadata
    const metadata = session.metadata;
    if (!metadata || !metadata.order_no) {
      throw new Error("no metadata in session");
    }

    const subId = session.subscription as string;
    if (subId) {
      // handle subscription
      const subscription = await stripe.subscriptions.retrieve(subId);

      // update subscription metadata
      await stripe.subscriptions.update(subId, {
        metadata: metadata,
      });

      const item = subscription.items.data[0];

      metadata["sub_id"] = subId;
      metadata["sub_times"] = "1";
      // Fallback to price.recurring if plan is not present in newer API versions
      const interval = (item as any).plan?.interval || (item as any).price?.recurring?.interval;
      const intervalCount =
        (item as any).plan?.interval_count || (item as any).price?.recurring?.interval_count;
      metadata["sub_interval"] = interval;
      metadata["sub_interval_count"] = (intervalCount ?? "").toString();
      metadata["sub_cycle_anchor"] =
        subscription.billing_cycle_anchor.toString();
      metadata["sub_period_start"] =
        subscription.current_period_start.toString();
      metadata["sub_period_end"] = subscription.current_period_end.toString();

      // update subscription first time paid order
      await updateSubOrder({
        order_no: metadata.order_no,
        user_email: metadata.user_email,
        sub_id: subId,
        sub_interval_count: Number(metadata.sub_interval_count),
        sub_cycle_anchor: Number(metadata.sub_cycle_anchor),
        sub_period_end: Number(metadata.sub_period_end),
        sub_period_start: Number(metadata.sub_period_start),
        sub_times: Number(metadata.sub_times),
        paid_detail: JSON.stringify(session),
      });

      return;
    }

    // update one-time payment order
    const order_no = metadata.order_no;
    const paid_email =
      session.customer_details?.email || session.customer_email || "";
    const paid_detail = JSON.stringify(session);

    await updateOrder({ order_no, paid_email, paid_detail });
  } catch (e) {
    console.log("handle session completed failed: ", e);
    throw e;
  }
}

// handle invoice payment succeeded
export async function handleInvoice(stripe: Stripe, invoice: Stripe.Invoice) {
  try {
    // not handle unpaid invoice
    if (invoice.status !== "paid") {
      throw new Error("not handle unpaid invoice");
    }

    // Try to extract subscription id robustly across API versions
    const getSubscriptionIdFromInvoice = async (): Promise<string | undefined> => {
      const raw = (invoice as any).subscription;
      if (typeof raw === "string" && raw) return raw;
      if (raw && typeof raw === "object" && typeof raw.id === "string") return raw.id;

      // Some newer API variants may put parent references
      const parent = (invoice as any).parent;
      if (parent && typeof parent === "object") {
        if (typeof parent.id === "string") return parent.id;
        if (typeof (parent as any).subscription?.id === "string") return (parent as any).subscription.id;
      }

      // Try retrieving invoice with expansion to access subscription field directly
      try {
        const inv = await stripe.invoices.retrieve(invoice.id as string, {
          expand: ["subscription", "lines.data", "lines.data.price"],
        } as any);
        const invSub = (inv as any).subscription;
        if (typeof invSub === "string" && invSub) return invSub;
        if (invSub && typeof invSub === "object" && typeof invSub.id === "string") return invSub.id;
      } catch (e) {
        // ignore and continue other fallbacks
      }

      // Fallback: find via line subscription_item -> retrieve item to get subscription id
      const lines = (invoice as any).lines?.data || [];
      for (const line of lines) {
        const subItemId = (line as any).subscription_item;
        if (typeof subItemId === "string" && subItemId) {
          try {
            const subItem = await stripe.subscriptionItems.retrieve(subItemId);
            if (typeof (subItem as any).subscription === "string") {
              return (subItem as any).subscription as string;
            }
          } catch (e) {
            // ignore and continue other fallbacks
          }
        }
      }

      // Last resort: query customer's subscriptions and match by price on invoice lines
      if (invoice.customer) {
        try {
          const customerId = typeof invoice.customer === "string" ? invoice.customer : (invoice.customer as any).id;
          const priceIds: string[] = [];
          for (const line of lines) {
            const priceId = (line as any).price?.id;
            if (typeof priceId === "string") priceIds.push(priceId);
          }

          if (customerId) {
            const subs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 100 });
            // Prefer exact match by latest_invoice -> invoice.id
            for (const sub of subs.data) {
              const latestInvoice = (sub as any).latest_invoice;
              const latestInvoiceId = typeof latestInvoice === "string" ? latestInvoice : latestInvoice?.id;
              if (latestInvoiceId && latestInvoiceId === invoice.id) {
                return sub.id;
              }
            }
            for (const sub of subs.data) {
              const subPriceIds = sub.items.data
                .map((it) => ((it as any).price?.id as string | undefined))
                .filter(Boolean) as string[];
              const matched = priceIds.some((pid) => subPriceIds.includes(pid));
              if (matched) return sub.id;
            }
          }
        } catch (e) {
          // ignore and fall through
        }
      }

      return undefined;
    };

    const subId = await getSubscriptionIdFromInvoice();
    // not handle none-subscription payment
    if (!subId) {
      throw new Error("not handle none-subscription payment");
    }

    // not handle first subscription, because it's be handled in session completed event
    if (invoice.billing_reason === "subscription_create") {
      return;
    }

    // get subscription
    const subscription = await stripe.subscriptions.retrieve(subId);

    let metadata = subscription.metadata;

    if (!metadata || !metadata.order_no) {
      // get subscription session metadata
      const checkoutSessions = await stripe.checkout.sessions.list({
        subscription: subId,
      });

      if (checkoutSessions.data.length > 0) {
        const session = checkoutSessions.data[0];
        if (session.metadata) {
          metadata = session.metadata;
          await stripe.subscriptions.update(subId, {
            metadata: metadata,
          });
        }
      }
    }

    if (!metadata || !metadata.order_no) {
      throw new Error("no metadata in subscription");
    }

    // get subscription item
    const item = subscription.items.data[0];

    const anchor = subscription.billing_cycle_anchor;
    const start = subscription.current_period_start;
    const end = subscription.current_period_end;

    const periodDuration = end - start;
    const subTimes = Math.round((start - anchor) / periodDuration) + 1;

    metadata["sub_id"] = subId;
    metadata["sub_times"] = subTimes.toString();
    // Fallback to price.recurring if plan is not present
    const itemInterval = (item as any).plan?.interval || (item as any).price?.recurring?.interval;
    const itemIntervalCount =
      (item as any).plan?.interval_count || (item as any).price?.recurring?.interval_count;
    metadata["sub_interval"] = itemInterval;
    metadata["sub_interval_count"] = (itemIntervalCount ?? "").toString();
    metadata["sub_cycle_anchor"] = subscription.billing_cycle_anchor.toString();
    metadata["sub_period_start"] = subscription.current_period_start.toString();
    metadata["sub_period_end"] = subscription.current_period_end.toString();

    // create renew order
    await updateSubOrder({
      order_no: metadata.order_no,
      user_email: metadata.user_email,
      sub_id: subId,
      sub_interval_count: Number(metadata.sub_interval_count),
      sub_cycle_anchor: Number(metadata.sub_cycle_anchor),
      sub_period_end: Number(metadata.sub_period_end),
      sub_period_start: Number(metadata.sub_period_start),
      sub_times: Number(metadata.sub_times),
      paid_detail: JSON.stringify(invoice),
    });
  } catch (e) {
    console.log("handle payment succeeded failed: ", e);
    throw e;
  }
}
