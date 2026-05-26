/* ================================================================
   products.js — Product grid with BTU filters, best-for labels
================================================================ */

function loadProducts() {
  buildFilterTabs();
  renderGrid(PRODUCTS);
}

function buildFilterTabs() {
  const row = document.getElementById('filter-row');
  if (!row) return;

  function setActive(btn) {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  // All
  const allBtn = document.createElement('button');
  allBtn.className   = 'filter-tab active';
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', () => { setActive(allBtn); renderGrid(PRODUCTS); });
  row.appendChild(allBtn);

  // 115V Plug-In
  const plugBtn = document.createElement('button');
  plugBtn.className   = 'filter-tab filter-tab-plugin';
  plugBtn.innerHTML   = '&#9889; 115V Plug-In';
  plugBtn.addEventListener('click', () => { setActive(plugBtn); renderGrid(PRODUCTS.filter(p => p.plugIn)); });
  row.appendChild(plugBtn);

  // Unique BTU sizes (deduplicated, sorted)
  const btus = [...new Set(PRODUCTS.map(p => p.btu))].sort((a, b) => a - b);
  btus.forEach(btu => {
    const btn = document.createElement('button');
    btn.className   = 'filter-tab';
    btn.textContent = btu.toLocaleString() + ' BTU';
    btn.addEventListener('click', () => { setActive(btn); renderGrid(PRODUCTS.filter(p => p.btu === btu)); });
    row.appendChild(btn);
  });
}

function renderGrid(products) {
  const grid = document.getElementById('products-grid');
  grid.innerHTML = '';

  products.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'product-card reveal reveal-d' + ((i % 3) + 1);

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
        <div class="product-card-features">
          ${p.features.map(f => `<span class="badge badge-feature">${f}</span>`).join('')}
        </div>
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
    grid.appendChild(card);
  });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', loadProducts);
