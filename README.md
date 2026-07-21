# Divine Bloom™ — Website

A calm, elegant website for a wellness brand selling herbal teas. Built as clean, dependency-free HTML/CSS/JS so it's easy to host anywhere and easy to hand off to a developer later.

Divine Bloom™ sells herbal teas only. Botanical soaps are made by the sister brand, Coco's Natural™ (linked from the homepage and every page's footer).

## ⚠️ Launch Status: NOT yet ready to take real orders

This is a complete, polished front-end site with a **working shopping cart** (add/remove/adjust quantity, persisted across pages). It does **not** have live payment processing. See "Checkout Status" below before launching publicly.

## Folder Structure

```
divine-bloom/
├── index.html          Homepage
├── teas.html            Herbal Teas shop page
├── about.html            About Divine Bloom
├── contact.html          Contact page + form
├── privacy.html          Privacy Policy
├── terms.html            Terms of Service
├── shipping.html         Shipping Policy
├── refunds.html          Refund Policy
├── css/
│   └── style.css        All site styling (design tokens at the top)
├── js/
│   └── main.js           Nav, cart, product rendering, forms, animations
├── data/
│   └── products.json    Herbal tea product data (prices in cents)
└── assets/
    ├── logo/             Divine Bloom™ logo mark (used in nav + hero)
    └── products/         Studio product photos for each tea
```

## Checkout Status (read this before launch)

The site has a **real, working client-side cart**: customers can add items, adjust quantities, remove items, and the cart persists across page visits via browser localStorage. The cart icon in the nav shows a live item count.

What it does **not** have: a payment processor. Clicking "Checkout" currently shows a message asking the customer to email their order in — it does not charge a card. To take real orders online, you need one of:

1. **Shopify** — recreate the 3 products in Shopify Admin (same titles/SKUs/prices are in `data/products.json`), then either use Shopify's Buy Button SDK layered on this design, or migrate this HTML/CSS into a Shopify theme. Shopify handles Stripe/card processing, tax, shipping rates, and order emails for you.
2. **Stripe directly** — requires a small backend (a serverless function on Vercel/Netlify/Cloudflare Workers works well) that creates a Stripe Checkout Session from the cart contents, plus a webhook to confirm paid orders. This is real development work beyond static HTML/CSS/JS — budget for a developer or a platform like Snipcart/Foxy that adds Stripe checkout to static sites with less custom backend code.

Either path, once you have it, replace `showCheckoutMessage()` in `js/main.js` with a redirect to your real checkout.

## Hosting, GitHub, Cloudflare, Domain, SSL

None of this is set up by Claude — these all require your own accounts and credentials:
- **GitHub**: push this folder to your repo whenever you're ready.
- **Cloudflare / DNS / domain**: point your domain to wherever you host the files (Cloudflare Pages, Netlify, Vercel, GitHub Pages all work for a static site like this).
- **SSL/HTTPS**: automatic on virtually every modern static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages all provision this for free) — nothing extra to configure on your end.

## How to Add a New Product

Open `data/products.json` and add a new object to the `"teas"` array. Every tea (homepage featured section + shop page + cart) renders from this one file — no HTML editing required.

```json
{
  "id": "tea-example-blend",
  "handle": "example-blend",
  "title": "Example Blend",
  "category": "teas",
  "blendType": "Morning Blend",
  "ingredients": "List key ingredients here",
  "description": "One or two sentences describing the blend.",
  "icon": "leaf-teacup",
  "image": "assets/products/example-blend.jpg",
  "featured": false,
  "price": 1800,
  "currency": "USD",
  "sku": "DB-TEA-004",
  "inStock": true,
  "variants": [
    { "size": "Loose Leaf Pouch, 2oz", "price": 1800, "sku": "DB-TEA-004-2OZ" }
  ]
}
```

- `price` is in **cents** (Stripe convention) — `1800` = $18.00.
- Set `"featured": true` to also show it in the homepage's Featured section.
- `sku` and `variants` map directly onto Shopify variants or Stripe Prices when you connect real checkout.

## Notes

- No build step or framework — open `index.html` in a browser, or deploy the folder as-is to any static host.
- Fonts (Fraunces + Manrope) load from Google Fonts via CDN.
- All pages are responsive (tested at mobile/tablet/desktop widths), use semantic HTML, and include per-page SEO meta tags.
- Real contact info is wired in throughout: divinebloom313@gmail.com, Instagram @divine.bloom313, Boston MA, www.divinebloomofficial.com.
