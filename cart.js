/* ================================================================
   cart.js — Shopping cart engine (loaded on all product pages)
   Storage keys: msd_cart, msd_po_seq, msd_orders
================================================================ */

const CART_KEY   = 'msd_cart';
const PO_SEQ_KEY = 'msd_po_seq';
const ORDERS_KEY = 'msd_orders';

const Cart = {

  // ── Persistence ──────────────────────────────────────────────

  get() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
    catch { return []; }
  },

  _save(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },

  // ── CRUD ─────────────────────────────────────────────────────

  add(id, qty = 1) {
    const items = Cart.get();
    const found = items.find(i => i.id === id);
    if (found) {
      found.qty = Math.min(found.qty + qty, 99);
    } else {
      items.push({ id, qty: Math.min(qty, 99) });
    }
    Cart._save(items);
  },

  remove(id) {
    Cart._save(Cart.get().filter(i => i.id !== id));
  },

  setQty(id, qty) {
    const n = parseInt(qty, 10);
    if (!n || n < 1) { Cart.remove(id); return; }
    const items = Cart.get();
    const found = items.find(i => i.id === id);
    if (found) { found.qty = Math.min(n, 99); Cart._save(items); }
  },

  clear() {
    localStorage.removeItem(CART_KEY);
    document.dispatchEvent(new CustomEvent('cart:updated'));
  },

  // ── Computed ─────────────────────────────────────────────────

  count() {
    return Cart.get().reduce((n, i) => n + i.qty, 0);
  },

  lines() {
    return Cart.get()
      .map(i => ({
        qty:     i.qty,
        product: (typeof PRODUCTS !== 'undefined') ? PRODUCTS.find(p => p.id === i.id) : null,
      }))
      .filter(i => i.product);
  },

  subtotal() {
    return Cart.lines().reduce((s, i) => s + i.product.depot.price * i.qty, 0);
  },

  // ── PO / Order records ────────────────────────────────────────

  nextPONumber() {
    const n = parseInt(localStorage.getItem(PO_SEQ_KEY) || '1099', 10) + 1;
    localStorage.setItem(PO_SEQ_KEY, String(n));
    return n;
  },

  saveOrder(order) {
    let orders = [];
    try { orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch {}
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders.slice(0, 500)));
  },

  getOrders() {
    try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; }
    catch { return []; }
  },
};

// ── Global "Add to Cart" click delegation ─────────────────────
document.addEventListener('click', e => {
  const btn = e.target.closest('.btn-add-cart');
  if (!btn || !btn.dataset.id) return;
  Cart.add(btn.dataset.id, 1);
  const orig = btn.textContent;
  btn.textContent = 'Added ✓';
  btn.classList.add('btn-added');
  setTimeout(() => {
    btn.textContent = orig;
    btn.classList.remove('btn-added');
  }, 1800);
});
