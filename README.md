# NORTHPAW COFFEE ROASTERS — BLACK FRIDAY 2026

A single-file Black Friday campaign page for Northpaw Coffee Roasters (Portland, OR).
Fight-poster energy: full-screen black + safety-orange hero, letter-by-letter
"BLACK FRIDAY" slam, split-flap departure-board countdown, tilted brew-kit cutout
with a `-30%` rubber stamp, a scrolling deals ticker, a doorbuster with live stock,
and a cart drawer with a free-shipping meter and Shopify Checkout hand-off.

Everything — CSS, JS, and all four product photos — is inlined into **`index.html`**
(~360 KB). No build step is needed to run it.

---

## The drop

| Product | Handle | Price | Compare at | Stock |
| --- | --- | --- | --- | --- |
| Night Shift Espresso | `night-shift-espresso` | $18 | ~~$24~~ | — |
| Ridgeline Single Origin | `ridgeline-single-origin` | $21 | ~~$28~~ | — |
| Pour-Over Brew Kit **(doorbuster)** | `pour-over-brew-kit` | $59 | ~~$85~~ | **40 sets** |

Sale window: **Fri Nov 27 2026, 00:00 PT → Mon Nov 30 2026, 23:59 PT.**

## Quick start

Open `index.html` in a browser (needs internet for GSAP + Google Fonts; photos are inlined).
The page renders the **pre-sale** state and counts down to Fri Nov 27 2026, 00:00 PT.

Preview states:

- `index.html` — pre-sale: countdown to doors-open, ATC buttons read "NOTIFY ME"
- `index.html?state=live` — sale live: countdown to sale end, full add-to-cart + checkout
- `index.html?state=soldout` — doorbuster sold out: SOLD OUT stamps, disabled ATC
- `index.html?state=pre` — force pre-sale view (useful after Nov 27)

The page switches states on its own at the real times (PT). Motion is GSAP and
respects `prefers-reduced-motion`: no slam, no marquee, no flap animation — digits
just update.

In **preview mode** (no Shopify connected), "STAGE THIS ORDER (DEMO)" in the checkout
modal decrements the 40-set doorbuster counter (stored in `localStorage`) so you can
watch the stock meter drain and the SOLD OUT stamp appear. Reset with
`localStorage.clear()`.

## Going live on Shopify

The page ships with a seeded catalog and runs standalone, but it is built to sit on
a real Shopify store. Five steps:

1. **Create the store.** Shopify admin → create a new store for Northpaw (any plan;
   a development store works for testing).
2. **Seed the products.** Admin → Products → **Import** → upload
   `shopify-products.csv`. It creates the three products above with the correct
   compare-at prices and a tracked inventory of **40** on the Brew Kit (deny when
   out of stock). Then upload the photos from `assets/`
   (`night-shift.png`, `ridgeline.png`, `brew-kit.png`) to each product — the CSV
   leaves `Image Src` blank so you can attach your final photography.
3. **Create a Storefront API token.** Admin → Settings → Apps and sales channels →
   **Headless** → create a Storefront API public access token (includes
   `unauthenticated_read_product_inventory`).
4. **Paste your values into `index.html`.** Search for `const SHOPIFY =` near the top
   of the inline script and fill in:

   ```js
   const SHOPIFY = {
     domain: "your-store.myshopify.com",
     storefrontAccessToken: "your-token",
     apiVersion: "2025-07",
   };
   ```

   On load the page pulls live prices, compare-at prices, images, the doorbuster's
   `quantityAvailable`, and `availableForSale` from your store (matched by handle —
   keep the handles in the CSV). When the kit hits 0 in Shopify, the SOLD OUT stamps
   and disabled button appear automatically.
5. **Checkout is real.** With the token in place, CHECKOUT builds a Shopify cart
   (`cartCreate` with the line items) and redirects the customer to their Shopify
   checkout URL — real inventory, real orders, real 40-set doorbuster.

If the API is unreachable, the page quietly falls back to the seeded catalog.

## Deploy

- **GitHub Pages** (this repo): Settings → Pages → deploy from `main` / root.
  `index.html` is self-contained; `assets/` and `src/` are only needed for editing.
- Any static host (Netlify, Vercel, S3) — upload `index.html`.
- Note: this is a standalone headless storefront, not a Liquid theme. Point your
  roastery domain (or a subdomain like `drop.northpaw.coffee`) at it.

## Rebuilding after edits

Edit `src/index.template.html` (asset placeholders look like `{{ASSET:brew-kit-cut}}`),
drop replacement images into `assets/`, then:

```bash
python3 scripts/build_site.py   # re-inlines assets → index.html
```

## Early-access emails

The hero form validates and stores the address in `localStorage` (and logs it to the
console). It is deliberately not wired to a vendor. To collect for real, POST the
value in the `submit` handler (search `early access signup`) to Klaviyo, Mailchimp,
or Shopify's Customer API.

## Things you may want to change

- `hello@northpaw.coffee` (terms strip + policy modal) — placeholder address
- Return-policy copy in the policy modal — review before publishing
- Product weights (`Variant Grams`) in the CSV — set to your real shipping weights

## Credits

- Motion: [GSAP 3.13](https://gsap.com) (CDN)
- Type: Anton · Oswald · Space Mono (Google Fonts)
- Photos: generated for this campaign (`assets/` holds the sources; the hero kit is
  a transparent cutout)
