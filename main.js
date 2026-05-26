/* ================================================================
   main.js — Nav, footer, announcement bar, scroll animations,
             sticky CTA, shared utils, SEO helpers
================================================================ */

// ── Google Font (with preconnect already in <head> on each page) ──
(function injectFont() {
  const link = document.createElement('link');
  link.rel  = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap';
  document.head.appendChild(link);
})();

// ── Shared image placeholder ───────────────────────────────────
const IMG_PLACEHOLDER_SVG = `
  <div class="img-placeholder">
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>
    <span>Image Coming Soon</span>
  </div>`;

// ── Announcement bar ────────────────────────────────────────────
function buildAnnouncementBar() {
  if (!CONFIG.announcement || !CONFIG.announcement.enabled) return '';
  const { text, highlight, linkText, linkHref } = CONFIG.announcement;
  return `
<div class="announcement-bar">
  <strong>${text}</strong> &nbsp;&bull;&nbsp;
  Same units, <strong>${highlight}</strong> &nbsp;&bull;&nbsp;
  <a href="${linkHref}">${linkText}</a>
</div>`;
}

// ── Nav builder ─────────────────────────────────────────────────
function buildNav() {
  const logoInner = CONFIG.brand.logo
    ? `<img src="${CONFIG.brand.logo}" alt="${CONFIG.brand.name} logo" class="logo-img" />`
    : `<div class="logo-mark" aria-hidden="true">${CONFIG.brand.logoIcon}</div>`;

  return `
<nav class="navbar">
  <div class="container nav-inner">
    <a href="index.html" class="nav-logo">
      ${logoInner}
      <span>${CONFIG.brand.name}</span>
    </a>
    <ul class="nav-links" id="nav-links" role="list">
      <li><a href="index.html">Home</a></li>
      <li><a href="comparison.html">Compare</a></li>
      <li><a href="products.html">Shop</a></li>
      <li><a href="faq.html">FAQ</a></li>
      <li><a href="about.html">About</a></li>
      <li><a href="contact.html" class="nav-cta-link">Contact</a></li>
    </ul>
    <a href="cart.html" class="nav-cart-btn" id="nav-cart" aria-label="View cart">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </svg>
      <span class="cart-count" id="cart-count" style="display:none">0</span>
    </a>
    <button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>`;
}

// ── Footer builder ───────────────────────────────────────────────
function buildFooter() {
  const logoInner = CONFIG.brand.logo
    ? `<img src="${CONFIG.brand.logo}" alt="${CONFIG.brand.name} logo" class="logo-img" />`
    : `<div class="logo-mark" aria-hidden="true">${CONFIG.brand.logoIcon}</div>`;

  const discountPct = Math.round(CONFIG.discount * 100);

  const socialLinks = CONFIG.brand.socialLinks || {};
  const socialIcons = {
    facebook:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
    instagram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
    youtube:   `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>`,
  };

  const socialHtml = Object.entries(socialLinks)
    .filter(([, url]) => url)
    .map(([platform, url]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${CONFIG.brand.name} on ${platform}" class="footer-social-link">${socialIcons[platform] || ''}</a>`)
    .join('');

  const phoneHtml = CONFIG.brand.phone
    ? `<li><a href="tel:${CONFIG.brand.phone.replace(/\D/g, '')}">${CONFIG.brand.phone}</a></li>`
    : '';

  return `
<footer class="footer">
  <div class="container">
    <div class="footer-top">

      <div class="footer-about">
        <div class="footer-brand">
          ${logoInner}
          <span>${CONFIG.brand.name}</span>
        </div>
        <p>${CONFIG.brand.tagline}<br>Authorized MRCOOL partner. Complete systems shipped direct &mdash; air handler &amp; condenser included.</p>
        ${socialHtml ? `<div class="footer-social">${socialHtml}</div>` : ''}
      </div>

      <div class="footer-col">
        <h4>Pages</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="comparison.html">Price Comparison</a></li>
          <li><a href="products.html">Shop</a></li>
          <li><a href="faq.html">FAQ</a></li>
          <li><a href="about.html">About</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4>Support</h4>
        <ul>
          <li><a href="faq.html">BTU Sizing Guide</a></li>
          <li><a href="faq.html">Installation Help</a></li>
          <li><a href="shipping.html">Shipping Policy</a></li>
          <li><a href="returns.html">Returns &amp; Refunds</a></li>
          ${phoneHtml}
          <li><a href="contact.html">Contact Us</a></li>
          <li><a href="privacy.html">Privacy Policy</a></li>
        </ul>
      </div>

    </div>

    <div class="footer-bottom">
      <p class="footer-bottom-copy">&copy; ${new Date().getFullYear()} ${CONFIG.brand.name}. All rights reserved.</p>
      <span class="footer-trust">Authorized MRCOOL Partner &bull; Free Shipping &bull; 7-Year Warranty</span>
      <div class="footer-bottom-links">
        <a href="shipping.html">Shipping</a>
        <a href="returns.html">Returns</a>
        <a href="privacy.html">Privacy Policy</a>
        <a href="contact.html">Contact</a>
      </div>
    </div>
  </div>
</footer>`;
}

// ── Sticky mobile CTA ──────────────────────────────────────────
function buildStickyCTA() {
  const lowestPrice = Math.min(...PRODUCTS.map(p => p.depot.price));
  return `
<div class="sticky-cta" id="sticky-cta">
  <div class="sticky-cta-text">
    <strong>Ready to save?</strong>
    Single-zone units from $${lowestPrice.toLocaleString()}
  </div>
  <a href="products.html" class="btn btn-primary btn-sm">Shop Now</a>
</div>`;
}

// ── Trust badges ───────────────────────────────────────────────
function makeTrustBadges() {
  const discountPct = Math.round(CONFIG.discount * 100);
  const badges = [
    {
      svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>`,
      text: 'Free Shipping',
    },
    {
      svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      text: 'Secure Checkout',
    },
    {
      svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
      text: '7-Year Warranty',
    },
    {
      svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>`,
      text: `${CONFIG.policies.returnDays}-Day Returns`,
    },
    {
      svg: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`,
      text: 'Authorized Partner',
    },
  ];
  return `<div class="trust-badges">${badges.map(b => `<div class="trust-badge">${b.svg}<span>${b.text}</span></div>`).join('')}</div>`;
}

// ── Shared badge builders ──────────────────────────────────────
function makeSavingsBadge(mrcoolPrice, depotPrice) {
  const saved = mrcoolPrice - depotPrice;
  const pct   = Math.round((saved / mrcoolPrice) * 100);
  return `<span class="badge badge-savings">Save $${saved} (${pct}% off)</span>`;
}

function makeUrgencyBadge(stock) {
  if (stock <= CONFIG.urgencyThreshold) {
    return `<span class="badge badge-urgency">&#128293; Only ${stock} left!</span>`;
  }
  return '';
}

function imgWithFallback(src, alt, wrapClass) {
  const wrap = document.createElement('div');
  wrap.className = wrapClass || 'product-img-wrap';
  const img = document.createElement('img');
  img.src     = src;
  img.alt     = alt;
  img.loading = 'lazy';
  img.addEventListener('error', () => { wrap.innerHTML = IMG_PLACEHOLDER_SVG; });
  wrap.appendChild(img);
  return wrap;
}

// ── Inject Organization JSON-LD ────────────────────────────────
function injectOrgSchema() {
  const schema = {
    '@context':   'https://schema.org',
    '@type':      'Organization',
    'name':       CONFIG.brand.name,
    'url':        CONFIG.brand.domain,
    'email':      CONFIG.brand.email,
    'description': CONFIG.brand.tagline,
  };
  if (CONFIG.brand.phone) schema.telephone = CONFIG.brand.phone;
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
}

// ── Scroll reveal ──────────────────────────────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Update page title with brand name from CONFIG
  document.title = document.title.replace('Mini Split Depot', CONFIG.brand.name);

  // Inject announcement bar
  const annSlot = document.getElementById('announcement-placeholder');
  if (annSlot) annSlot.outerHTML = buildAnnouncementBar();

  // Inject nav
  const navSlot = document.getElementById('nav-placeholder');
  if (navSlot) navSlot.outerHTML = buildNav();

  // Inject footer
  const footerSlot = document.getElementById('footer-placeholder');
  if (footerSlot) footerSlot.outerHTML = buildFooter();

  // Inject sticky CTA
  if (typeof PRODUCTS !== 'undefined') {
    document.body.insertAdjacentHTML('beforeend', buildStickyCTA());
  }

  // Highlight active nav link
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // Mobile nav toggle with ARIA
  document.addEventListener('click', e => {
    const toggle = document.getElementById('nav-toggle');
    const links  = document.getElementById('nav-links');
    if (!toggle || !links) return;
    if (toggle.contains(e.target)) {
      const isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen);
    } else if (!links.contains(e.target)) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Scroll reveal
  initScrollReveal();

  // Organization schema
  injectOrgSchema();

  // Cart badge (works on every page without cart.js)
  function refreshCartBadge() {
    const badge = document.getElementById('cart-count');
    if (!badge) return;
    try {
      const cart = JSON.parse(localStorage.getItem('msd_cart')) || [];
      const n    = cart.reduce((s, i) => s + (i.qty || 0), 0);
      badge.textContent = n;
      badge.style.display = n > 0 ? 'flex' : 'none';
    } catch { badge.style.display = 'none'; }
  }
  refreshCartBadge();
  document.addEventListener('cart:updated', refreshCartBadge);
});
