/* ================================================================
   calculator.js — Interactive BTU Room Size Calculator
================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const slider    = document.getElementById('calc-slider');
  const sqftDisplay = document.getElementById('calc-sqft');
  const options   = document.querySelectorAll('.calc-option');
  const result    = document.getElementById('calc-result');

  if (!slider) return;

  let condition = 'normal';

  function getRecommendation(sqft, cond) {
    let adjusted = sqft;
    if (cond === 'sunny') adjusted = Math.ceil(sqft * 1.1);
    if (cond === 'high')  adjusted = Math.ceil(sqft * 1.15);

    return PRODUCTS.find(p => {
      const maxSqft = parseInt(p.coverage.replace(/\D/g, ''));
      return maxSqft >= adjusted;
    }) || PRODUCTS[PRODUCTS.length - 1];
  }

  function update() {
    const sqft = parseInt(slider.value);
    sqftDisplay.textContent = sqft.toLocaleString() + ' sq ft';

    const p       = getRecommendation(sqft, condition);
    const savings = p.mrcool.price - p.depot.price;

    document.getElementById('calc-result-name').textContent    = p.name;
    document.getElementById('calc-result-sub').textContent     = `${p.coverage} · ${p.seer} SEER · Best for: ${p.bestFor}`;
    document.getElementById('calc-result-price').textContent   = '$' + p.depot.price.toLocaleString();
    document.getElementById('calc-result-compare').textContent = '$' + p.mrcool.price.toLocaleString();
    document.getElementById('calc-result-savings').textContent = `You save $${savings} vs. retail`;
    document.getElementById('calc-result-link').href           = `product.html?id=${p.id}`;
    document.getElementById('calc-result-order').href         = p.depot.url;

    result.style.display = 'block';
  }

  slider.addEventListener('input', update);

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      condition = opt.dataset.condition;
      update();
    });
  });

  // Run on load
  update();
});
