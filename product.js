/* ================================================================
   product.js — Renders individual product detail page
   URL format: product.html?id=12k
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const id     = params.get('id');
  const p      = PRODUCTS.find(prod => prod.id === id);
  const el     = document.getElementById('product-detail-content');

  if (!p) {
    el.innerHTML = `
      <div style="text-align:center;padding:80px 20px">
        <h2 style="color:var(--blue-dark);margin-bottom:12px">Product Not Found</h2>
        <p style="color:var(--text-muted);margin-bottom:24px">We couldn&rsquo;t find that product. Browse our full catalog below.</p>
        <a href="products.html" class="btn btn-primary">Shop All Products</a>
      </div>`;
    return;
  }

  // Update page title and meta description
  document.title = `${p.name} — ${CONFIG.brand.name}`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.content = `${p.name} — ${p.coverage}, ${p.seer} SEER. Only $${p.depot.price.toLocaleString()} — save $${p.mrcool.price - p.depot.price} vs. retail. ${p.description}`;
  }

  const savings = p.mrcool.price - p.depot.price;
  const pct     = Math.round((savings / p.mrcool.price) * 100);

  // Specs rows
  const specRows = Object.entries(p.specs)
    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`)
    .join('');

  // Included items
  const included = p.includedItems
    .map(item => `<li>${item}</li>`)
    .join('');

  el.innerHTML = `
    <div class="product-detail-layout">

      <!-- Image -->
      <div class="product-detail-img-box" id="detail-img-box">
        <div class="img-placeholder">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <path d="M21 15l-5-5L5 21"/>
          </svg>
          <span>Image Coming Soon</span>
        </div>
      </div>

      <!-- Info -->
      <div class="product-detail-body">

        <div class="product-detail-badges-row">
          ${p.popular ? '<span class="badge badge-popular">Most Popular</span>' : ''}
          <span class="badge badge-gen">${p.generation}</span>
          ${p.plugIn ? '<span class="badge badge-plugin">115V Plug-In</span>' : ''}
          <span class="badge badge-info">${p.btu.toLocaleString()} BTU</span>
          <span class="badge badge-feature">${p.coverage}</span>
          <span class="badge badge-feature">${p.seer} SEER</span>
          ${makeUrgencyBadge(p.stock)}
        </div>

        <h1>${p.name}</h1>
        <div class="best-for" style="margin-bottom:16px;font-size:0.9rem">Best for: <strong>${p.bestFor}</strong></div>

        <p class="product-detail-desc">${p.description}</p>

        ${p.plugIn ? `
        <div class="plugin-callout" style="margin-bottom:16px">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
          No electrician required &mdash; plugs into any standard 115V / 20A household outlet
        </div>` : ''}

        <div class="product-price-block">
            <div style="font-size:0.85rem;color:var(--text-muted);text-decoration:line-through;margin-bottom:2px">$${p.mrcool.price.toLocaleString()} MRCOOL retail</div>
          <div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">
            <span class="product-price-big">$${p.depot.price.toLocaleString()}</span>
            <span style="font-size:1rem;font-weight:700;color:var(--green)">Save $${savings} (${pct}% off)</span>
          </div>
        </div>

        <div class="product-cta-group">
          <div class="product-qty-row">
            <label for="detail-qty">Qty:</label>
            <div class="cart-qty-group">
              <button class="cart-qty-btn" id="qty-dec" type="button" aria-label="Decrease">&#8722;</button>
              <input type="number" id="detail-qty" class="cart-qty-input" value="1" min="1" max="99" aria-label="Quantity" />
              <button class="cart-qty-btn" id="qty-inc" type="button" aria-label="Increase">&#43;</button>
            </div>
          </div>
          <button class="btn btn-primary btn-lg btn-full" id="detail-add-cart" data-id="${p.id}">Add to Cart</button>
          <a href="cart.html" class="btn btn-outline" id="detail-go-cart" style="display:none">View Cart &rarr;</a>
          <a href="comparison.html" class="btn btn-outline">See Full Price Comparison</a>
        </div>

        ${makeTrustBadges()}

        <div class="product-specs">
          <h3>Specifications</h3>
          <table class="specs-table">
            ${specRows}
          </table>
        </div>

        <div class="whats-included">
          <h3>What&rsquo;s Included</h3>
          <ul>${included}</ul>
        </div>

      </div>
    </div>`;

  // Qty controls + Add to Cart
  const qtyInput  = document.getElementById('detail-qty');
  const addBtn    = document.getElementById('detail-add-cart');
  const goCartBtn = document.getElementById('detail-go-cart');

  document.getElementById('qty-dec').addEventListener('click', () => {
    const v = parseInt(qtyInput.value, 10) || 1;
    if (v > 1) qtyInput.value = v - 1;
  });
  document.getElementById('qty-inc').addEventListener('click', () => {
    const v = parseInt(qtyInput.value, 10) || 1;
    qtyInput.value = Math.min(v + 1, 99);
  });

  addBtn.addEventListener('click', () => {
    const qty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
    if (typeof Cart !== 'undefined') Cart.add(p.id, qty);
    addBtn.textContent = 'Added ✓';
    addBtn.classList.add('btn-added');
    goCartBtn.style.display = 'inline-flex';
    setTimeout(() => {
      addBtn.textContent = 'Add to Cart';
      addBtn.classList.remove('btn-added');
    }, 1800);
  });

  // Try to load the product image
  const imgBox = document.getElementById('detail-img-box');
  const img    = document.createElement('img');
  img.src = p.depot.image;
  img.alt = p.name;
  img.addEventListener('load',  () => { imgBox.innerHTML = ''; imgBox.appendChild(img); });
  img.addEventListener('error', () => { /* placeholder stays */ });

  // Product JSON-LD
  const schema = {
    '@context':   'https://schema.org',
    '@type':      'Product',
    'name':       p.name,
    'description': p.description,
    'brand': { '@type': 'Brand', 'name': 'MRCOOL' },
    'offers': {
      '@type':         'Offer',
      'priceCurrency': 'USD',
      'price':         p.depot.price,
      'availability':  p.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'url':           `${CONFIG.brand.domain}/product.html?id=${p.id}`,
    },
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);

  // Related products
  const related = PRODUCTS.filter(prod => prod.id !== p.id);
  if (related.length) {
    const section = document.getElementById('related-section');
    const grid    = document.getElementById('related-grid');
    section.style.display = 'block';

    related.slice(0, 4).forEach(r => {
      const card    = document.createElement('div');
      card.className = 'product-card';
      const imgWrap = imgWithFallback(r.depot.image, r.name, 'product-img-wrap');
      card.innerHTML = `
        <div class="product-card-body">
          <div class="product-card-name">${r.name}</div>
          <div class="best-for">Best for: <strong>${r.bestFor}</strong></div>
          <div class="product-card-meta" style="margin-top:6px">
            <span class="badge badge-info">${r.btu.toLocaleString()} BTU</span>
            <span class="badge badge-feature">${r.coverage}</span>
          </div>
          <div class="product-card-badges" style="margin-top:8px">
            ${makeUrgencyBadge(r.stock)}
          </div>
          <div class="product-card-price">
            <span class="price-current">$${r.mrcool.price.toLocaleString()}</span>
          </div>
          <div class="cart-discount-note">Save $${r.mrcool.price - r.depot.price} &mdash; Your price: <strong>$${r.depot.price.toLocaleString()}</strong></div>
          <div class="product-card-actions">
            <a href="product.html?id=${r.id}" class="btn btn-outline btn-sm btn-full">View Details</a>
          </div>
        </div>`;
      card.prepend(imgWrap);
      grid.appendChild(card);
    });
  }
});
