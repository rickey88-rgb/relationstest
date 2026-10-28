# AUTISM ALL INCLUSIVE – isolated release

Base: GitHub main / Vercel Production `8438f7bc071715c8998c18ac53eecffbe26f7d43`.
Branch: `codex/autism-all-inclusive`. No database, account, test-checkout or product-map changes.

Sales stay disabled in `app/_lib/featureFlags.ts`. The page, result recommendation and existing purchase fulfilment keep the existing product identity. The local presentation preview uses `AUTISM_BOOK_LOCAL_PREVIEW=1` with `next dev` only; production ignores this override. The preview never creates entitlements.

## Source assets

The original PDFs are never bundled into public or committed. Upload them as separate, unchanged objects only after explicit approval.

| Asset | SHA-256 |
| --- | --- |
| AUTISM_ALL_INCLUSIVE_Elias_Voss.pdf | 6b212ce6f6cb82e84331ff4299ce5afc9428d542800175b32e8a93fb60fb12ac |
| AUTISM_ALL_INCLUSIVE_arbetsblad_A4.pdf | 1733b01f8bec6b0a8a8aa8cce2e4405dd62d06d1ee306e7ed42a5fb3a6b276dc |

Public previews are PDF pages 5, 11, 15, 25, 31 and an actual cropped raster of page 10 containing only the first two worksheet prompts. The full page 10 is not present behind a CSS mask. These are individual page excerpts, not complete chapters. Mockup dimensions: 1205 × 1305.

## Stripe preparation – do not execute yet

Rename both existing Products; retain all IDs, prices, links and redirect URLs:

| | Standard | After test |
| --- | --- | --- |
| SEK | 149 | 99 |
| Product | prod_VOEk6abNdB0GWm | prod_VOEmvkbNajjGJ6 |
| Price | price_1UNSH2AgF4ugWkEkOazhPISh | price_1UNSJ6AgF4ugWkEkrq5Q0MuY |
| Payment Link | plink_1UNSHSAgF4ugWkEkhXeRG4Ig | plink_1UNSJQAgF4ugWkEkQX8r1EXv |

Suggested names: `AUTISM ALL INCLUSIVE – bok + arbetsblad` and `AUTISM ALL INCLUSIVE – bok + arbetsblad, kundpris`.
Both retain `https://www.relationsvarning.se/autism-bok/tack?session_id={CHECKOUT_SESSION_ID}`.
Leave `STRIPE_PAYMENT_PRODUCT_MAP_JSON` unchanged. No real payment is authorized.

## R2 / Vercel preparation – do not execute yet

See `autism-all-inclusive.env.example`. Preserve all existing shared Stripe, R2 and token secrets. Add only the autism price allowlist and worksheets key; update the main-book key to the new versioned object.

Before upload verify private bucket access, disabled public URLs and appropriate R2 credentials. Upload the two hash-verified originals separately. Read back and compare hashes. The worksheets must still have 12 pages and 72 interactive fields.

Both `/api/books/autism-bok/download` and `/api/books/autism-bok/worksheets` require the same signed `rv_autism_book_access` cookie for `autism-bok`. Each signs its own configured object for 60 seconds with PDF attachment headers and no-store. Missing authorization returns 403; missing storage configuration returns 503. The thank-you page shows two separate download buttons.

Checkout verification requires a live completed/paid payment-mode session in SEK, an allowed existing Payment Link, one allowed Price and quantity one, succeeded PaymentIntent, and a paid/captured Charge with no refund or dispute. Stripe errors fail closed. AuDHD's verifier and shared cookie format are unchanged.

The inherited 180-day product cookie does not bind a Stripe Session. Refunds after cookie issuance are not rechecked at download time. Browser changes and erased cookies still require manual support. Automatic mail delivery and account-library claims are intentionally absent.

## Local verification

Install the locked dependencies with `npm ci --ignore-scripts`. Run `node scripts/test-autism-book-release.cjs --output <external-output.json>` for the 15 relevant test programs. The integration test uses a local HTTP R2 fixture and synthetic Stripe sessions, never production.

To verify the actual PDF bytes through that fixture, set `AUTISM_PRIVATE_ASSETS` to the private source directory and `AUTISM_DOWNLOADED_ASSETS` to an external scratch directory, then run the purchase-flow test. Run `verify-autism-book-pdfs.py --source <source-dir> --downloaded <download-dir> --work <scratch-dir>` using Python with pypdf. It checks both hashes, 52/12 pages, 72 canonical fields and widgets, fills all 72, saves/reopens them and checks appearance streams without modifying originals.

Run TypeScript, ESLint and `next build --webpack`. The build needs the existing public ADHD/autism 79 SEK payment-link environment values, unchanged. Stop local dev before a clean production build so generated dev route types are not mixed with build types. Run `next-sitemap` after a direct Next build; npm run build already invokes postbuild.

## Activation and rollback

After the owner approves the reviewed implementation and later production actions:

1. Recheck current main and Production, compare the exact release manifest and integrate only this isolated diff if the base advanced.
2. Verify the two private R2 objects and environment values, and rename both existing Stripe Products. Do not touch price/link IDs, the product map, accounts or database.
3. Publish initially with sales disabled. Check both authorized downloads and file hashes in the real environment before activating the sale flag. Preserve existing fulfilment while paused.
4. Activate only `AUTISM_BOOK_SALE_ENABLED` in a separately reviewed change. The existing result recommendation then becomes visible at 99 SEK. Verify 149/99 offers, mobile/desktop, valid/invalid access, both files and the unchanged autism-test 79 SEK flow. No paid test purchase without separate approval.
5. On failure disable new book sales/recommendations while retaining these download routes and R2 objects for paid customers. Prefer a rollback build retaining both-file fulfilment over reverting to the old one-file version. Keep the new price allowlist/worksheets key while this verifier is deployed. Do not rotate shared secrets, delete purchases or remove uploaded release objects as a rollback.

A clean rollback must preserve both promised files for anyone who has paid. The old single-file deployment is not a complete fulfilment rollback after the first new book sale.

## Inherited baseline findings

The full-project ESLint run has 17 errors, identical to a fresh run on the untouched 8438f7b source with the same locked dependencies/configuration. The book change adds no errors; all changed JavaScript/TypeScript files lint without errors or warnings. Do not silently change unrelated test flows or relax lint rules to hide the baseline findings.

The current main source also contains the temporary public AuDHD support PDF restored by the earlier production release. It is unchanged here. Neither new autism PDF is in public, the static build, or server trace files. A statement that the entire deployment has no public full-book PDFs would be incorrect while that inherited AuDHD file remains. Resolve its separate support/removal decision before giving such a site-wide guarantee.
