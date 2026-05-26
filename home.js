/* ================================================================
   home.js — Featured products, urgency banner, testimonials
================================================================ */

function loadHome() {
  renderUrgencyBanner(PRODUCTS);
  renderFeatured(PRODUCTS);
  renderTestimonials();
}

function renderUrgencyBanner(products) {
  const low = products
    .filter(p => p.stock <= CONFIG.urgencyThreshold)
    .sort((a, b) => a.stock - b.stock);

  const banner = document.getElementById('urgency-banner');
  if (!banner || !low.length) return;

  const items = low.map(p =>
    `<span><strong>Only ${p.stock} left</strong> &mdash; ${p.name}</span>`
  ).join('<span class="sep"> &nbsp;|&nbsp; </span>');

  banner.innerHTML = `
    <div class="urgency-items">${items}</div>
    <div style="margin-top:5px;font-size:0.8rem;opacity:0.82">
      <a href="products.html">Check all availability &rarr;</a>
    </div>`;
  banner.style.display = 'block';
}

function buildProductCard(p, delayClass) {
  const card = document.createElement('div');
  card.className = 'product-card reveal ' + (delayClass || '');

  const imgWrap = imgWithFallback(p.depot.image, p.name, 'product-img-wrap');

  const pluginBadge = p.plugIn
    ? `<span class="badge badge-plugin" style="margin-left:4px">115V Plug-In</span>`
    : '';

  const pluginCallout = p.plugIn
    ? `<div class="plugin-callout">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        No electrician required — standard 115V outlet
       </div>`
    : '';

  card.innerHTML = `
    <div class="product-card-body">
      <div class="product-card-name">
        ${p.popular ? '<span class="badge badge-popular" style="margin-bottom:6px;display:inline-flex">Most Popular</span><br>' : ''}
        ${p.name}
      </div>
      <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;margin-bottom:4px">
        <span class="badge badge-gen">${p.generation}</span>
        ${pluginBadge}
      </div>
      <div class="best-for">Best for: <strong>${p.bestFor}</strong></div>
      ${pluginCallout}
      <div class="product-card-meta" style="margin-top:8px">
        <span class="badge badge-info">${p.btu.toLocaleString()} BTU</span>
        <span class="badge badge-feature">${p.coverage}</span>
        <span class="badge badge-feature">${p.seer} SEER</span>
      </div>
      <p class="product-card-desc">${p.description}</p>
      <div class="product-card-badges">
        ${makeUrgencyBadge(p.stock)}
      </div>
      <div class="product-card-price">
        <span class="price-current">$${p.mrcool.price.toLocaleString()}</span>
      </div>
      <div class="cart-discount-note">Save $${(p.mrcool.price - p.depot.price).toLocaleString()} &mdash; Your price: <strong>$${p.depot.price.toLocaleString()}</strong></div>
      <div class="product-card-actions">
        <button class="btn btn-primary btn-sm btn-full btn-add-cart" data-id="${p.id}">Add to Cart</button>
        <a href="product.html?id=${p.id}" class="btn btn-outline btn-sm btn-full">View Details</a>
      </div>
    </div>`;

  card.prepend(imgWrap);
  return card;
}

function renderFeatured(products) {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  const featured = products.filter(p => p.featured);
  const toShow   = featured.length >= 3 ? featured.slice(0, 3) : products.slice(0, 3);
  const delays   = ['reveal-d1', 'reveal-d2', 'reveal-d3'];

  toShow.forEach((p, i) => {
    grid.appendChild(buildProductCard(p, delays[i]));
  });
}

function renderTestimonials() {
  const grid = document.getElementById('testimonials-grid');
  if (!grid || !CONFIG.testimonials || !CONFIG.testimonials.length) return;

  const delayClasses = ['reveal-d1', 'reveal-d2', 'reveal-d3'];

  CONFIG.testimonials.forEach((t, i) => {
    const stars = '&#9733;'.repeat(t.stars || 5);
    const card = document.createElement('div');
    card.className = `testimonial-card reveal ${delayClasses[i % 3]}`;
    card.innerHTML = `
      <div class="testimonial-stars">${stars}</div>
      <p class="testimonial-quote">&ldquo;${t.quote}&rdquo;</p>
      <div class="testimonial-author">
        <strong>${t.name}</strong>
        <span>${t.location} &mdash; ${t.product}</span>
      </div>`;
    grid.appendChild(card);
  });

  document.querySelectorAll('.testimonial-card.reveal:not(.visible)').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    obs.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', loadHome);
