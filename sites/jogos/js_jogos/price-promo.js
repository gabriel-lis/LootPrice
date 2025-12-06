// Gerencia renderização de preços promocionais nos cards de plataforma
(function () {
  function parseDateIfAny(s) {
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
  }

  function parsePrice(str) {
    if (!str) return NaN;
    const cleaned = String(str).replace(/[^0-9.,-]/g, '').trim();
    if (!cleaned) return NaN;
    const normalized = cleaned.replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(normalized);
  }

  function computeDiscount(originalStr, saleStr) {
    const o = parsePrice(originalStr);
    const s = parsePrice(saleStr);
    if (isNaN(o) || isNaN(s) || o === 0) return '';
    const pct = Math.round((1 - (s / o)) * 100);
    return pct > 0 ? ('-' + pct + '%') : '';
  }

  function renderCard(card) {
    if (!card) return;
    const meta = card.querySelector('.platform-meta');
    if (!meta) return;
    const priceEl = meta.querySelector('.platform-price');
    if (!priceEl) return;

    const original = card.dataset.originalPrice || priceEl.textContent.trim();
    const sale = card.dataset.salePrice || '';
    let discount = card.dataset.discount || '';
    const saleEnds = parseDateIfAny(card.dataset.saleEnds);

    if (saleEnds && (new Date()) > saleEnds) {
      card.classList.remove('on-sale');
      card.dataset.onSale = 'false';
    }

    const isOnSale = card.classList.contains('on-sale') || card.dataset.onSale === 'true';

    if (isOnSale && sale) {
      if (!discount) {
        discount = computeDiscount(original, sale);
      }
      priceEl.innerHTML = '' +
        '<span class="old-price">' + original + '</span>' +
        '<span class="new-price">' + sale + (discount ? (' <span class="discount">' + discount + '</span>') : '') + '</span>';
    } else {
      priceEl.innerHTML = '<span class="normal-price">' + original + '</span>';
    }
  }

  function init() {
    const cards = Array.from(document.querySelectorAll('.platform-card')).filter(c => c.dataset.originalPrice);
    cards.forEach(renderCard);
  }

  function setPlatformSale(selectorOrEl, on) {
    const el = (typeof selectorOrEl === 'string') ? document.querySelector(selectorOrEl) : selectorOrEl;
    if (!el) return false;
    if (on) {
      el.classList.add('on-sale');
      el.dataset.onSale = 'true';
    } else {
      el.classList.remove('on-sale');
      el.dataset.onSale = 'false';
    }
    renderCard(el);
    return true;
  }

  // expõe a API global
  window.setPlatformSale = setPlatformSale;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
