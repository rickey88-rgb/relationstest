import type Stripe from "stripe";
import { sendTransactionalRecoveryEmail } from "./audhdRecoveryEmail.server";
import { applicationOrigin, validLoginEmail } from "./authConfig.server";
import { BOOK_LIBRARY_PATH, bookDeliveryCover, bookFilePath, bookFiles, type CatalogBook } from "./bookCatalog";
import { deliveryBookForProduct, findDeliveryBook, verifiedDeliveryOrder } from "./bookDelivery.server";
import { bookEmailLifetime, isLiveBookSession, issueBookDeliveryToken } from "./bookDeliveryToken.server";
import { legacyCheckoutBook } from "./legacyBookLibrary.server";
import { paymentDatabase } from "./paymentsDb.server";

import { NORWEGIAN_BOOK } from "./norwegianBook";

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function deliveryMessage(book: CatalogBook, token: string) {
  const origin = applicationOrigin();
  if (book.id === NORWEGIAN_BOOK.id) {
    const url = new URL(bookFilePath(book, bookFiles(book)[0], { email: token }), origin).href;
    return {
      subject: `Din e-bok – ${book.title}`,
      text: ["Takk for kjøpet!", `${book.title} av ${book.author}`, "", "Last ned e-boka (PDF)", url, "", "Lenken er gyldig i 30 dager. Lagre gjerne PDF-en på enheten din.", "Kjøpsvilkår: https://www.relationsvarning.se/no/kjopsvilkar", "Kundestøtte: support@relationsvarning.se"].join("\n"),
    };
  }
  const files = bookFiles(book).map(file => ({
    label: file.id === "book" ? "Hämta din e-bok (PDF)" : file.label,
    url: new URL(bookFilePath(book, file, { email: token }), origin).href,
  }));
  const cover = new URL(bookDeliveryCover(book).src, origin).href;
  const library = new URL(BOOK_LIBRARY_PATH, origin).href;
  const reminder = "Dina länkar gäller i 30 dagar. Logga in med mejladressen från köpet för att öppna dina filer i Mitt bibliotek.";
  const html = `<!doctype html><html lang="sv"><body style="margin:0;background:#eef5fa;color:#101b49;font:16px/1.55 Arial,sans-serif">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:24px 12px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fffdfb;border-radius:20px">
        <tr><td align="center" style="padding:28px 24px">
          <img src="${escapeHtml(cover)}" width="136" alt="${escapeHtml("Omslag till " + book.title)}" style="display:block;height:auto;max-width:100%">
          <h1 style="font:700 28px/1.2 Georgia,serif;margin:20px 0 10px">Tack för ditt köp!</h1>
          <p style="font:bold 20px/1.35 Georgia,serif;margin:0">${escapeHtml(book.title)}</p>
          <p style="color:#485476;margin:4px 0 20px">${escapeHtml(book.author)}</p>
          ${files.map(({ label, url }, index) => `<p style="margin:10px 0"><a href="${escapeHtml(url)}" style="display:inline-block;padding:11px 17px;border-radius:8px;text-decoration:none;font-weight:bold;background:${index === 0 ? "#101b49;color:#ffffff" : "#f9e5ee;color:#101b49"}">${escapeHtml(label)}</a></p>`).join("")}
          <p style="margin:20px 0 0;color:#485476">Dina länkar gäller i 30 dagar. Logga in med mejladressen från köpet för att öppna dina filer i <a href="${escapeHtml(library)}" style="color:#101b49">Mitt bibliotek</a>.</p>
          <p style="margin:20px 0 0">Trevlig läsning!<br>Relationsvarning</p>
        </td></tr>
      </table>
    </td></tr></table>
  </body></html>`;
  return {
    subject: `Din e-bok: ${book.title}`,
    text: ["Tack för ditt köp!", book.title, book.author, "", ...files.map(file => `${file.label}: ${file.url}`),
      "", reminder, library, "", "Trevlig läsning!", "Relationsvarning"].join("\n"),
    html,
  };
}

export async function deliverBookEmail(stripe: Stripe, event: Stripe.Event, product: string) {
  const activation = Number(process.env.BOOK_DELIVERY_START_AT);
  if (!Number.isSafeInteger(activation) || activation <= 0 || !event.livemode || event.created < activation ||
    (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") ||
    event.data.object.payment_status !== "paid" || !isLiveBookSession(event.data.object.id)) return;
  const mapped = deliveryBookForProduct(product);
  if (!mapped && product !== "unmapped") return;
  const session = await stripe.checkout.sessions.retrieve(event.data.object.id);
  if (session.id !== event.data.object.id || session.metadata?.rv_lite_autism_email === "sent") return;
  const legacy = !mapped && session.payment_link ? await legacyCheckoutBook(stripe, session) : null;
  const book = mapped ?? (legacy ? findDeliveryBook(legacy.book) : undefined);
  if (!book || !await verifiedDeliveryOrder(stripe, session, book)) return;

  const to = validLoginEmail(session.customer_details?.email ?? session.customer_email);
  if (!to) throw new Error("Verified book checkout is missing an email address");
  const sql = paymentDatabase();
  // Commit the retry anchor before contacting Resend. It survives an ambiguous timeout or database error.
  await sql`insert into public.book_email_deliveries (stripe_checkout_session_id) values (${session.id})
    on conflict (stripe_checkout_session_id) do nothing`;
  const delivered = await sql.begin(async transaction => {
    const [row] = await transaction<{ started_at: Date; sent_at: Date | null; retryable: boolean }[]>`
      select started_at, sent_at, started_at > now() - interval '23 hours' as retryable
      from public.book_email_deliveries where stripe_checkout_session_id = ${session.id} for update`;
    if (row.sent_at) return true;
    // Resend deduplicates for 24 hours. Stop before that window closes if acceptance is uncertain.
    if (!row.retryable) {
      console.error(JSON.stringify({ event: "book_email_retry_window_elapsed", book: book.id }));
      return false;
    }
    const expires = Math.floor(row.started_at.getTime() / 1000) + bookEmailLifetime;
    const token = issueBookDeliveryToken(book.id, "email", session.id, expires);
    await sendTransactionalRecoveryEmail({ to, idempotencyKey: `book-delivery/${session.id}`, ...deliveryMessage(book, token) });
    await transaction`update public.book_email_deliveries set sent_at = now() where stripe_checkout_session_id = ${session.id}`;
    return true;
  });
  if (delivered && book.id === "lite-autism-har-val-ingen-dott-av") {
    await stripe.checkout.sessions.update(session.id, { metadata: { rv_lite_autism_email: "sent", rv_book_ga4: "" } });
  }
}
