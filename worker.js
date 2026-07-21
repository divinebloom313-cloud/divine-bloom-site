/**
 * Divine Bloom™ — Worker
 *
 * Serves the static site (index.html, css, images, etc.) for every normal
 * page request, and handles ONE special route — /api/create-checkout-session —
 * which creates a real Stripe Checkout Session from the customer's cart and
 * sends them to Stripe's own secure payment page.
 *
 * The Stripe secret key is read from env.STRIPE_SECRET_KEY, which must be
 * set as an encrypted secret in the Cloudflare dashboard (Settings ->
 * Variables and Secrets). It is never stored in this file or in GitHub.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/create-checkout-session" && request.method === "POST") {
      return handleCreateCheckoutSession(request, env);
    }

    // Everything else (index.html, css, images, other pages) is served
    // directly from the static assets already uploaded to GitHub.
    return env.ASSETS.fetch(request);
  },
};

async function handleCreateCheckoutSession(request, env) {
  try {
    if (!env.STRIPE_SECRET_KEY) {
      return jsonResponse(
        { error: "Stripe is not connected yet. Add STRIPE_SECRET_KEY in Cloudflare settings." },
        503
      );
    }

    const { items, origin } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return jsonResponse({ error: "Cart is empty." }, 400);
    }

    // Basic validation so a tampered request can't check out with a fake price.
    const safeItems = items
      .filter((i) => i && typeof i.title === "string" && Number.isInteger(i.price) && i.price > 0 && Number.isInteger(i.qty) && i.qty > 0)
      .slice(0, 50);

    if (safeItems.length === 0) {
      return jsonResponse({ error: "Cart items are invalid." }, 400);
    }

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("success_url", `${origin}/?checkout=success`);
    params.append("cancel_url", `${origin}/?checkout=cancelled`);
    params.append("shipping_address_collection[allowed_countries][]", "US");
    params.append("phone_number_collection[enabled]", "true");

    safeItems.forEach((item, i) => {
      params.append(`line_items[${i}][price_data][currency]`, "usd");
      params.append(`line_items[${i}][price_data][product_data][name]`, item.title.slice(0, 120));
      params.append(`line_items[${i}][price_data][unit_amount]`, String(item.price));
      params.append(`line_items[${i}][quantity]`, String(item.qty));
    });

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      return jsonResponse({ error: session.error?.message || "Stripe declined the request." }, 502);
    }

    return jsonResponse({ url: session.url });
  } catch (err) {
    return jsonResponse({ error: "Unexpected error creating checkout session." }, 500);
  }
}

function jsonResponse(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
