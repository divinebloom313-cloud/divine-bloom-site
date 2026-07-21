/* =========================================================
   Divine Bloom — main.js
   Handles: mobile nav, scroll reveals, product card rendering,
   shop filters, newsletter + contact form feedback.
   ========================================================= */

/* ---- Icon library (inline SVG strings, reused across cards) ---- */
const ICONS = {
  "leaf-teacup": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10 28h38v8c0 10-8.5 18-19 18S10 46 10 36v-8z"/>
    <path d="M48 30h4a6 6 0 0 1 0 12h-3"/>
    <path d="M20 28c-1-6 1-9 4-12" stroke-dasharray="2 3"/>
    <path d="M30 28c-2-7 1-11 5-14" stroke-dasharray="2 3"/>
    <path d="M6 58h44"/>
  </svg>`,
  "sprig": `<svg viewBox="0 0 140 40" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
    <path d="M2 20c30 0 40-14 68-14s38 14 68 14"/>
    <path d="M40 12c-3 4-3 8 0 12M62 6c-3 5-3 9 0 14M78 6c3 5 3 9 0 14M100 12c3 4 3 8 0 12"/>
    <circle cx="70" cy="20" r="3"/>
  </svg>`,
  "leaf": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20c8-1 14-7 15-15C11 6 5 12 4 20z"/><path d="M4 20c3-4 6-7 11-10"/></svg>`,
  "heart": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7-4.5-9.5-9C1 8 2 4.5 5.5 3.5 8 2.8 10.5 4 12 6.5 13.5 4 16 2.8 18.5 3.5 22 4.5 23 8 21.5 11 19 15.5 12 20 12 20z"/></svg>`,
  "sprig-icon": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21V9"/><path d="M12 9C7 9 5 6 5 3c5 0 7 3 7 6z"/><path d="M12 13c5 0 7-3 7-6-5 0-7 3-7 6z"/></svg>`,
  "about-botanical": `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
    <path d="M100 180V70"/>
    <path d="M100 70C70 70 55 50 55 25c25 0 45 15 45 45z"/>
    <path d="M100 70c30 0 45-20 45-45-25 0-45 15-45 45z"/>
    <path d="M100 110c-22 0-34-14-34-34 22 0 34 14 34 34z"/>
    <path d="M100 110c22 0 34-14 34-34-22 0-34 14-34 34z"/>
    <circle cx="100" cy="150" r="5"/>
  </svg>`,
  "mail": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="m4 6 8 7 8-7"/></svg>`,
  "phone": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>`,
  "pin": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>`,
  "globe": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.5 6 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-6-3.5-9s1-6.5 3.5-9z"/></svg>`,
  "instagram": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1"/></svg>`,
  "pinterest": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M9 17c1-3 1.8-6 2.4-8.6A2.6 2.6 0 0 1 14 6.5c1.7 0 2.8 1.2 2.8 3 0 2.6-1.4 5-3.6 5-.8 0-1.4-.4-1.7-1"/></svg>`,
  "facebook": `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M14 8.5h-1.5A1.5 1.5 0 0 0 11 10v9M9 13.5h4"/></svg>`
};

function currency(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

/* ---- Mobile nav toggle ---- */
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

/* ---- Footer year ---- */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---- Scroll reveal ---- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => io.observe(el));
}

/* ---- Botanical sprig dividers ---- */
function initSprigs() {
  document.querySelectorAll(".sprig-divider").forEach((el) => {
    el.innerHTML = ICONS.sprig;
  });
}

/* ---- Product card markup ---- */
function productCard(product) {
  const media = product.image
    ? `<div class="product-media teas has-photo"><span class="tag">${product.blendType}</span><img src="${product.image}" alt="${product.title} packaging" loading="lazy"></div>`
    : `<div class="product-media teas"><span class="tag">${product.blendType}</span>${ICONS["leaf-teacup"]}</div>`;
  return `
    <article class="product-card reveal">
      ${media}
      <div class="product-body">
        <h3>${product.title}</h3>
        <p class="ingredients">${product.ingredients}</p>
        <p class="desc">${product.description}</p>
        <div class="product-footer">
          <span class="price">${currency(product.price)}</span>
          <button class="btn btn-secondary btn-small" type="button" data-add-to-cart="${product.sku}">Add to Cart</button>
        </div>
      </div>
    </article>`;
}

/* ---- Load + render products ---- */
let PRODUCT_CACHE = [];

async function loadProducts() {
  const res = await fetch("products.json");
  if (!res.ok) throw new Error("Could not load product data");
  const data = await res.json();
  PRODUCT_CACHE = data.teas;
  return data;
}

async function renderFeatured() {
  const teaTarget = document.querySelector("[data-featured='teas']");
  if (!teaTarget) return;
  try {
    const data = await loadProducts();
    teaTarget.innerHTML = data.teas.filter((p) => p.featured).map(productCard).join("");
    initReveal();
  } catch (err) {
    console.error(err);
  }
}

async function renderShop(category) {
  const target = document.querySelector("[data-shop-grid]");
  if (!target) return;
  try {
    const data = await loadProducts();
    const items = data.teas;
    const render = (list) => {
      target.innerHTML = list.length
        ? list.map(productCard).join("")
        : `<p style="color:var(--ink-soft)">No blends match that filter yet — more are on the way.</p>`;
      initReveal();
    };
    render(items);

    const filterBar = document.querySelector("[data-filter-bar]");
    if (filterBar) {
      filterBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const key = btn.dataset.filter;
        const filtered = key === "all" ? items : items.filter((p) => p.blendType === key);
        render(filtered);
      });
    }
  } catch (err) {
    console.error(err);
  }
}

/* ---- Newsletter form ---- */
function initNewsletter() {
  const form = document.querySelector("[data-newsletter-form]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = form.querySelector(".newsletter-success");
    const input = form.querySelector("input[type='email']");
    if (success) {
      success.textContent = `Thank you — a little wellness inspiration is headed to ${input.value}.`;
      success.classList.add("show");
    }
    form.reset();
  });
}

/* ---- Contact form ---- */
function initContactForm() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const success = form.querySelector(".form-success");
    if (success) success.classList.add("show");
    form.reset();
  });
}

/* ---- Fill decorative botanical SVGs by data attribute ---- */
function initDecorativeIcons() {
  document.querySelectorAll("[data-icon]").forEach((el) => {
    const key = el.getAttribute("data-icon");
    if (ICONS[key]) el.innerHTML = ICONS[key];
  });
}

/* =========================================================
   Cart
   Real, working client-side cart (add/remove/qty, persisted
   in localStorage across pages). There is no payment backend
   connected — see showCheckoutMessage() below.
   ========================================================= */
const CART_KEY = "divineBloomCart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (err) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  renderCart();
}
function addToCart(sku) {
  const cart = getCart();
  const existing = cart.find((i) => i.sku === sku);
  if (existing) existing.qty += 1;
  else cart.push({ sku, qty: 1 });
  saveCart(cart);
  openCart();
}
function updateQty(sku, delta) {
  const cart = getCart();
  const item = cart.find((i) => i.sku === sku);
  if (!item) return;
  item.qty += delta;
  saveCart(item.qty <= 0 ? cart.filter((i) => i.sku !== sku) : cart);
}
function removeFromCart(sku) {
  saveCart(getCart().filter((i) => i.sku !== sku));
}
function cartItemDetails(sku) {
  return PRODUCT_CACHE.find((p) => p.sku === sku);
}

function renderCart() {
  const cart = getCart();
  const itemsEl = document.querySelector("[data-cart-items]");
  const footerEl = document.querySelector("[data-cart-footer]");
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    el.textContent = totalQty;
    el.setAttribute("data-empty", totalQty === 0 ? "true" : "false");
  });
  if (!itemsEl || !footerEl) return;

  if (!cart.length) {
    itemsEl.innerHTML = `<p class="cart-empty">Your cart is empty. Explore our herbal teas to get started.</p>`;
    footerEl.innerHTML = `
      <div class="cart-subtotal"><span>Subtotal</span><span>$0.00</span></div>
      <button class="btn btn-primary cart-checkout-btn" type="button" disabled style="opacity:0.5; cursor:not-allowed;">Checkout</button>
      <p class="cart-note">Shipping &amp; taxes calculated at checkout.</p>`;
    return;
  }

  let subtotal = 0;
  itemsEl.innerHTML = cart
    .map((item) => {
      const p = cartItemDetails(item.sku);
      if (!p) return "";
      subtotal += p.price * item.qty;
      const media = p.image
        ? `<img src="${p.image}" alt="${p.title}">`
        : ICONS["leaf-teacup"];
      return `
      <div class="cart-item">
        <div class="cart-item-media">${media}</div>
        <div class="cart-item-body">
          <h4>${p.title}</h4>
          <div class="cart-item-price">${currency(p.price)}</div>
          <div class="cart-item-controls">
            <button class="cart-qty-btn" type="button" data-cart-decrease="${item.sku}" aria-label="Decrease quantity">&minus;</button>
            <span>${item.qty}</span>
            <button class="cart-qty-btn" type="button" data-cart-increase="${item.sku}" aria-label="Increase quantity">+</button>
            <button class="cart-item-remove" type="button" data-cart-remove="${item.sku}">Remove</button>
          </div>
        </div>
      </div>`;
    })
    .join("");

  footerEl.innerHTML = `
    <div class="cart-subtotal"><span>Subtotal</span><span>${currency(subtotal)}</span></div>
    <button class="btn btn-primary cart-checkout-btn" type="button" data-cart-checkout>Checkout</button>
    <p class="cart-note">Shipping &amp; taxes calculated at checkout.</p>`;
}

function openCart() {
  document.querySelector("[data-cart-drawer]")?.classList.add("is-open");
  document.querySelector("[data-cart-overlay]")?.classList.add("is-open");
}
function closeCart() {
  document.querySelector("[data-cart-drawer]")?.classList.remove("is-open");
  document.querySelector("[data-cart-overlay]")?.classList.remove("is-open");
}

/* Payment is NOT connected. This hands the order off to email
   instead of pretending a purchase succeeded. Replace this with
   a real Stripe Checkout redirect once that's set up. */
function showCheckoutMessage() {
  const footerEl = document.querySelector("[data-cart-footer]");
  if (!footerEl) return;
  footerEl.innerHTML = `
    <div class="cart-checkout-message">
      Online payment isn't connected yet. To complete this order, email
      <a href="mailto:divinebloom313@gmail.com">divinebloom313@gmail.com</a> with the items in your cart and we'll follow up to complete your purchase directly.
    </div>
    <button class="btn btn-secondary cart-checkout-btn" type="button" data-cart-close>Continue Browsing</button>`;
}

function initCart() {
  document.querySelectorAll("[data-cart-toggle]").forEach((btn) => btn.addEventListener("click", openCart));
  document.querySelector("[data-cart-overlay]")?.addEventListener("click", closeCart);
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-cart-close]")) closeCart();
    const addBtn = e.target.closest("[data-add-to-cart]");
    if (addBtn) addToCart(addBtn.dataset.addToCart);
    const inc = e.target.closest("[data-cart-increase]");
    if (inc) updateQty(inc.dataset.cartIncrease, 1);
    const dec = e.target.closest("[data-cart-decrease]");
    if (dec) updateQty(dec.dataset.cartDecrease, -1);
    const rem = e.target.closest("[data-cart-remove]");
    if (rem) removeFromCart(rem.dataset.cartRemove);
    if (e.target.closest("[data-cart-checkout]")) showCheckoutMessage();
  });
  loadProducts().then(() => renderCart());
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initYear();
  initSprigs();
  initDecorativeIcons();
  initNewsletter();
  initContactForm();
  initCart();
  renderFeatured();
  renderShop(document.body.dataset.shop);
  initReveal();
});
