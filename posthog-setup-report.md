# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into Sultan Top Up. PostHog is initialized client-side via `instrumentation-client.ts` (the Next.js 15.3+ recommended approach) with a reverse proxy configured in `next.config.mjs` to route PostHog traffic through `/ingest` — this prevents ad-blockers from dropping analytics events. A server-side client in `lib/posthog-server.ts` handles tracking from Next.js server components. 11 events were instrumented across 7 files, covering the full purchase funnel from game page view through to order result, plus auth events and order lookup.

| Event                     | Description                                                                              | File                                               |
| ------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `game_page_viewed`        | User views a game's top-up page, marking the start of the purchase funnel.               | `app/game/[slug]/page.tsx`                         |
| `product_selected`        | User selects a denomination (e.g., 514 Diamonds) in the checkout form.                   | `components/checkout-form/product-step.tsx`        |
| `payment_method_selected` | User selects a payment method (QRIS, virtual account, e-wallet) during checkout.         | `components/checkout-form/payment-method-step.tsx` |
| `checkout_submitted`      | User clicks 'Lanjutkan Pembayaran' and checkout form is submitted successfully.          | `hooks/use-checkout-form.ts`                       |
| `payment_page_viewed`     | User lands on the payment page and sees payment instructions (QRIS or VA).               | `components/bayar-card.tsx`                        |
| `va_number_copied`        | User copies the virtual account number, indicating active payment intent.                | `components/bayar-card.tsx`                        |
| `invoice_copied`          | User copies the invoice number from the payment page.                                    | `components/bayar-card.tsx`                        |
| `order_result_viewed`     | User views the order result page showing success, processing, failed, or expired status. | `components/result-card.tsx`                       |
| `user_registered`         | User submits the registration form to create a new account.                              | `components/auth-form.tsx`                         |
| `user_logged_in`          | User submits the login form to sign in to their account.                                 | `components/auth-form.tsx`                         |
| `order_lookup_performed`  | User submits the order tracking form to check an order's status.                         | `components/order-lookup.tsx`                      |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/518208/dashboard/1868856)
- [Purchase funnel (wizard)](https://us.posthog.com/project/518208/insights/JpRftQ5X) — Conversion from game page view through to order result
- [Checkouts over time (wizard)](https://us.posthog.com/project/518208/insights/9910O8UF) — Daily checkout submission volume
- [Order results by status (wizard)](https://us.posthog.com/project/518208/insights/qsrC87Iv) — Success vs failed vs expired vs processing breakdown
- [Payment methods used (wizard)](https://us.posthog.com/project/518208/insights/lqD6JZ6E) — Which payment methods users choose most
- [User registrations and logins (wizard)](https://us.posthog.com/project/518208/insights/pMfpb5AT) — Auth activity over time

## Verify before merging

- [ ] Run `pnpm install` to install `posthog-js` and `posthog-node` — bash was unavailable during the wizard run, so packages were added to `package.json` but not yet installed.
- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the auth form currently fires `posthog.identify()` only on login/register; if users refresh while logged in, their session will be anonymous until they log in again.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
