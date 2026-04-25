/**
 * home.js — Max Pool Home Page Logic
 *
 * Handles:
 *   1. Pool cost calculator
 *   2. Equipment portfolio tab filtering + card rendering
 *   3. Quick inquiry form (cv2SubmitForm / cv2SubmitFormAr)
 *
 * Moved from inline <script> blocks in index.html and ar/index.html.
 * Requires: js/config.js loaded first (for API_BASE).
 */
(function () {
  'use strict';

  var RAILWAY = 'https://maxpool-production.up.railway.app';

  // ── 1. Pool Cost Calculator ──────────────────────────────────────────────
  function initCalculator() {
    var calcL      = document.getElementById('calcL');
    var calcW      = document.getElementById('calcW');
    var calcType   = document.getElementById('calcType');
    var calcResult = document.getElementById('calcResult');
    if (!calcL || !calcW || !calcType || !calcResult) return;

    function update() {
      var area  = (parseFloat(calcL.value) || 0) * (parseFloat(calcW.value) || 0);
      var rate  = parseFloat(calcType.value) || 0;
      calcResult.innerText = 'EGP ' + (area * rate).toLocaleString();
      calcResult.style.transform = 'scale(1.1)';
      calcResult.style.transition = '0.2s ease-out';
      setTimeout(function () { calcResult.style.transform = 'scale(1)'; }, 150);
    }

    calcL.addEventListener('input', update);
    calcW.addEventListener('input', update);
    calcType.addEventListener('change', update);
  }

  // ── 2. Equipment Portfolio — Tab Filtering + Card Rendering ─────────────
  function initPortfolio() {
    var grid = document.getElementById('catalogGrid');
    if (!grid) return;

    var isAr        = document.documentElement.lang === 'ar';
    var BASE        = window.BASE_PATH || '';
    var allProducts = [];
    var base        = (typeof API_BASE !== 'undefined') ? API_BASE : RAILWAY;

    function renderCards(products) {
      if (!products || !products.length) return;
      grid.innerHTML = products.map(function (p) {
        var id        = p._id || p.id || '';
        var title     = p.name || p.title || '';
        var imgRaw    = Array.isArray(p.images) ? p.images[0] : (typeof p.images === 'string' ? p.images : '');
        var img       = imgRaw
          ? (imgRaw.startsWith('http') ? imgRaw
            : (imgRaw.startsWith('/uploads') || imgRaw.startsWith('/images')) ? RAILWAY + imgRaw
            : '/' + imgRaw.replace(/^\//, ''))
          : '';
        var brand     = p.brandName || p.brand || '';
        var desc      = (p.description || '').slice(0, 90) + ((p.description || '').length > 90 ? '...' : '');
        var cat       = (p.category || '').toLowerCase();
        var detailUrl = BASE + 'product.html?id=' + id;
        var viewLabel = isAr ? 'عرض التفاصيل' : 'View Details';
        var arrow     = isAr ? 'fa-arrow-left' : 'fa-arrow-right';
        return '<div class="cv2-card" data-cat="' + cat + '" onclick="location.href=\'' + detailUrl + '\'">'
          + '<div class="cv2-card-img-wrap">'
          + (img ? '<img src="' + img + '" alt="' + title + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;">' : '<i class="fa-solid fa-box cv2-card-icon"></i>')
          + (brand ? '<div class="cv2-card-badge">' + brand + '</div>' : '')
          + '</div>'
          + '<div class="cv2-card-body">'
          + '<h3 class="cv2-card-title">' + title + '</h3>'
          + '<p class="cv2-card-desc">' + desc + '</p>'
          + '<a href="' + detailUrl + '" class="cv2-card-cta" onclick="event.stopPropagation()">'
          + viewLabel + ' <i class="fa-solid ' + arrow + '"></i></a>'
          + '</div></div>';
      }).join('');
    }

    function filterCards(cat) {
      if (!allProducts.length) return;
      var filtered = cat === 'all' ? allProducts : allProducts.filter(function (p) {
        return (p.category || '').toLowerCase() === cat;
      });
      renderCards(filtered.length ? filtered : allProducts);
    }

    window.MaxPoolAPI.getProducts({ limit: 50 })
      .then(function (result) {
        allProducts = result.products;
        renderCards(allProducts);
      })
      .catch(function () {});

    document.querySelectorAll('.cv2-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.cv2-tab').forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');
        filterCards(tab.dataset.cat);
      });
    });
  }

  // ── 3. Quick Inquiry Form ────────────────────────────────────────────────
  function cv2Submit(e) {
    e.preventDefault();
    var btn    = e.target.querySelector('.cv2-form-btn');
    var msgEl  = document.getElementById('cv2FormMsg') || document.getElementById('cv2FormMsgAr');
    var inputs = e.target.querySelectorAll('input, select, textarea');
    var name   = inputs[0].value.trim();
    var phone  = inputs[1].value.trim();
    var svc    = inputs[2].value;
    var msg    = inputs[3].value.trim() || svc;
    var isAr   = document.documentElement.lang === 'ar';

    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> ' + (isAr ? 'جاري الإرسال...' : 'Sending...');

    window.MaxPoolAPI.postLead({ name: name, phone: phone, message: msg || svc, service: svc })
    .finally(function () {
      btn.innerHTML = '<i class="fa-solid fa-check"></i> ' + (isAr ? 'تم الإرسال!' : 'Sent!');
      if (msgEl) {
        msgEl.style.display = 'block';
        msgEl.textContent = isAr
          ? '✓ استلمنا استفسارك وسنتواصل معك قريباً.'
          : '✓ We received your inquiry and will contact you shortly.';
      }
      e.target.reset();
      setTimeout(function () {
        btn.disabled = false;
        btn.innerHTML = isAr
          ? '<span>إرسال الاستفسار</span> <i class="fa-solid fa-arrow-left"></i>'
          : '<span>Send Inquiry</span> <i class="fa-solid fa-arrow-right"></i>';
        if (msgEl) msgEl.style.display = 'none';
      }, 4000);
    });
  }

  // Expose globally — referenced by onsubmit="cv2SubmitForm(event)" in HTML
  window.cv2SubmitForm   = cv2Submit;
  window.cv2SubmitFormAr = cv2Submit;

  // ── Init ─────────────────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initCalculator(); initPortfolio(); });
  } else {
    initCalculator();
    initPortfolio();
  }

})();
