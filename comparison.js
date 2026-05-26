/* ================================================================
   comparison.js — Side-by-side MRCOOL vs. Mini Split Depot
================================================================ */

function loadComparison() {
  renderSavingsSummary();

  const grid = document.getElementById('comparison-grid');
  grid.innerHTML = '';

  // Show standard 230V products on the comparison page
  const compareProducts = PRODUCTS.filter(p => !p.plugIn);

  compareProducts.forEach(p => {
    const savings = p.mrcool.price - p.depot.price;
    const pct     = Math.round((savings / p.mrcool.price) * 100);

    const row = document.createElement('div');
    row.className = 'comparison-row reveal';

    // MRCOOL card
    const mrcoolCard = document.createElement('div');
    mrcoolCard.className = 'comp-card';
    mrcoolCard.innerHTML = `
      <div class="comp-card-mobile-label label-mrcool">MRCOOL — Retail</div>
      <div class="comp-body">
        <div class="comp-name">${p.name}</div>
        <div class="comp-badges">
          <span class="badge badge-info">${p.btu.toLocaleString()} BTU</span>
          <span class="badge badge-feature">${p.coverage}</span>
          <span class="badge badge-feature">${p.seer} SEER</span>
          <span class="badge badge-gen">${p.generation}</span>
        </div>
        <div class="best-for" style="margin:2px 0">Best for: <strong>${p.bestFor}</strong></div>
        <p class="comp-desc">${p.description}</p>
        <div class="comp-price">$${p.mrcool.price.toLocaleString()}</div>
        <div class="comp-actions">
          <a href="${p.mrcool.url}" class="btn btn-outline btn-sm btn-full" target="_blank" rel="noopener">
            View on MRCOOL &rarr;
          </a>
        </div>
      </div>`;
    mrcoolCard.prepend(buildCompImg(p.mrcool.image, p.name));

    // Depot card
    const depotCard = document.createElement('div');
    depotCard.className = 'comp-card comp-card-depot';
    depotCard.innerHTML = `
      <div class="comp-card-mobile-label label-depot">${CONFIG.brand.name}</div>
      <div class="comp-body">
        <div class="comp-name">
          ${p.popular ? '<span class="badge badge-popular" style="margin-bottom:4px;display:inline-flex">Most Popular</span><br>' : ''}
          ${p.name}
        </div>
        <div class="comp-badges">
          <span class="badge badge-info">${p.btu.toLocaleString()} BTU</span>
          <span class="badge badge-feature">${p.coverage}</span>
          <span class="badge badge-savings">Save $${savings} (${pct}% off)</span>
          ${p.stock <= CONFIG.urgencyThreshold ? `<span class="badge badge-urgency">&#128293; Only ${p.stock} left!</span>` : ''}
        </div>
        <div class="best-for" style="margin:2px 0">Best for: <strong>${p.bestFor}</strong></div>
        <p class="comp-desc">${p.description}</p>
        <div class="comp-price">$${p.depot.price.toLocaleString()}</div>
        <div class="comp-actions" style="display:flex;flex-direction:column;gap:8px">
          <a href="${p.depot.url}"          class="btn btn-primary btn-sm btn-full">Buy at ${CONFIG.brand.name}</a>
          <a href="product.html?id=${p.id}" class="btn btn-outline btn-sm btn-full">View Full Details</a>
        </div>
      </div>`;
    depotCard.prepend(buildCompImg(p.depot.image, p.name));

    row.appendChild(mrcoolCard);
    row.appendChild(depotCard);
    grid.appendChild(row);
  });

  // Re-run scroll observer on dynamically added rows
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.08 });
    obs.observe(el);
  });
}

function renderSavingsSummary() {
  const el = document.getElementById('savings-summary');
  if (!el) return;

  const standard    = PRODUCTS.filter(p => !p.plugIn);
  const totalRetail = standard.reduce((s, p) => s + p.mrcool.price, 0);
  const totalDepot  = standard.reduce((s, p) => s + p.depot.price,  0);
  const totalSaved  = totalRetail - totalDepot;
  const avgSaved    = Math.round(totalSaved / standard.length);

  el.innerHTML = `
    <div class="savings-summary-stat">
      <div class="num">$${totalSaved.toLocaleString()}</div>
      <div class="lbl">Total saved across all ${standard.length} standard units</div>
    </div>
    <div class="savings-summary-divider"></div>
    <div class="savings-summary-stat">
      <div class="num">$${avgSaved}</div>
      <div class="lbl">Average saving per unit</div>
    </div>
    <div class="savings-summary-divider"></div>
    <div class="savings-summary-stat">
      <div class="num">${Math.round((totalSaved / totalRetail) * 100)}%</div>
      <div class="lbl">Average savings vs. MRCOOL retail</div>
    </div>`;
  el.style.display = 'flex';
}

function buildCompImg(src, alt) {
  const wrap = document.createElement('div');
  wrap.className = 'comp-img';
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.addEventListener('error', () => { wrap.innerHTML = IMG_PLACEHOLDER_SVG; });
  wrap.appendChild(img);
  return wrap;
}

document.addEventListener('DOMContentLoaded', loadComparison);
