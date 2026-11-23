import { paymentDatabase } from "./paymentsDb.server";
import { OVERTHINKING_BOOK } from "./overthinkingBook";

export type BookCheckout = {
  sessionId: string;
  priceId: string;
  live: boolean;
  expiresAt: Date;
};

/** Stripe's signed webhook ledger prioritizes paid sessions, including when
 * the buyer closes Stripe before the return. Final access is verified live. */
export async function ownedBookCheckouts(userId: string, live: boolean) {
  const sql = paymentDatabase();
  return sql<BookCheckout[]>`
    select b.stripe_checkout_session_id as "sessionId", b.stripe_price_id as "priceId",
           b.live_mode as live, b.expires_at as "expiresAt"
    from public.overthinking_book_checkouts b
    left join public.stripe_payments p on p.stripe_checkout_session_id = b.stripe_checkout_session_id
      and p.product_key = ${OVERTHINKING_BOOK.product} and p.livemode = b.live_mode
      and p.payment_status = 'paid'
    where b.user_id = ${userId} and b.live_mode = ${live}
    order by p.paid_at desc nulls last, b.created_at desc
    limit 12
  `;
}

export async function recordBookCheckout(userId: string, checkout: BookCheckout) {
  const sql = paymentDatabase();
  const rows = await sql<{ id: string }[]>`
    insert into public.overthinking_book_checkouts
      (stripe_checkout_session_id, user_id, stripe_price_id, live_mode, expires_at)
    values (${checkout.sessionId}, ${userId}, ${checkout.priceId}, ${checkout.live}, ${checkout.expiresAt})
    on conflict (stripe_checkout_session_id) do update set
      expires_at = excluded.expires_at
    where overthinking_book_checkouts.user_id = excluded.user_id
      and overthinking_book_checkouts.stripe_price_id = excluded.stripe_price_id
      and overthinking_book_checkouts.live_mode = excluded.live_mode
    returning stripe_checkout_session_id as id
  `;
  if (rows.length !== 1) throw new Error("Book checkout could not be bound to account");
}
