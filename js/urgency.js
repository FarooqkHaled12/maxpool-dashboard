/**
 * urgency.js — Max Pool Urgency & Conversion Triggers
 *
 * Components: UrgencyBar, ViewerCounter, ScarcityBadge, ResponseTimer,
 *             FOMOTicker, ExitPrompt, ScrollCTA, TimeSensitiveCTAs
 *
 * Loaded with defer on all pages. No external dependencies.
 * Uses window.WA_NUMBER and window.openWhatsApp() from whatsapp.js.
 */
(function () {
  'use strict';

  // ── Page detection ────────────────────────────────────────────────────────
  var _path         = window.location.pathname;
  var _isAr         = _path.includes('/ar/');
  var _page         = _path.split('/').pop().replace('.html', '') || 'index';
  var _isBlog       = _path.includes('/blog/');
  var _is404        = _page === '404';
  var _reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Mutual exclusion ──────────────────────────────────────────────────────
  var _activeUrgencyEl = null;

  function _showUrgency(el) {
    if (_activeUrgencyEl && _activeUrgencyEl !== el) return false;
    _activeUrgencyEl = el;
    return true;
  }

  function _hideUrgency(el) {
    if (_activeUrgencyEl === el) _activeUrgencyEl = null;
  }

  // ── WA helper ─────────────────────────────────────────────────────────────
  function _openWA(msg) {
    if (typeof window.openWhatsApp === 'function') {
      window.openWhatsApp(msg);
    } else {
      var num = window.WA_NUMBER || '201006205650';
      window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    }
  }

  // ── 1. UrgencyBar ─────────────────────────────────────────────────────────
  var _urgencyBarMessages = {
    en: [
      '⚡ Response within hours — Contact us now',
      '🔥 High demand for summer equipment — Book your consultation',
      '✅ Available for immediate supply — Ask about stock',
    ],
    ar: [
      '⚡ استجابة خلال ساعات — تواصل معنا الآن',
      '🔥 طلب مرتفع على معدات الصيف — احجز استشارتك',
      '✅ متاح للتوريد الفوري — اسأل عن المخزون',
    ],
  };

  function initUrgencyBar() {
    if (sessionStorage.getItem('urgencyBarDismissed') === 'true') return;

    var msgs   = _isAr ? _urgencyBarMessages.ar : _urgencyBarMessages.en;
    var waMsg  = _isAr ? 'مرحباً ماكس بول، أريد الاستفسار عن منتجاتكم' : 'Hello Max Pool, I want to inquire about your products';
    var waText = _isAr ? 'واتساب' : 'WhatsApp';
    var idx    = 0;

    var bar = document.createElement('div');
    bar.id  = 'urgency-bar';
    bar.innerHTML =
      '<span id="urgency-bar-msg">' + msgs[0] + '</span>' +
      '<a id="urgency-bar-wa" href="#" role="button">' + waText + '</a>' +
      '<button id="urgency-bar-close" aria-label="Close">&times;</button>';

    var nav = document.querySelector('nav, .navbar');
    if (nav) {
      document.body.insertBefore(bar, nav);
    } else {
      document.body.insertBefore(bar, document.body.firstChild);
    }

    // Offset body so content isn't hidden under bar
    var barH = bar.offsetHeight || 40;
    document.body.style.paddingTop = (parseInt(document.body.style.paddingTop || '0') + barH) + 'px';

    var msgEl = document.getElementById('urgency-bar-msg');

    if (!_reducedMotion) {
      setInterval(function () {
        bar.classList.add('fading');
        setTimeout(function () {
          idx = (idx + 1) % msgs.length;
          msgEl.textContent = msgs[idx];
          bar.classList.remove('fading');
        }, 300);
      }, 6000);
    }

    document.getElementById('urgency-bar-wa').addEventListener('click', function (e) {
      e.preventDefault();
      _openWA(waMsg);
    });

    document.getElementById('urgency-bar-close').addEventListener('click', function () {
      bar.remove();
      document.body.style.paddingTop = (parseInt(document.body.style.paddingTop || '0') - barH) + 'px';
      sessionStorage.setItem('urgencyBarDismissed', 'true');
    });
  }

  // ── 2. FOMOTicker ─────────────────────────────────────────────────────────
  var _fomoMessages = {
    en: [
      '✅ Client from Cairo requested a quote on a Hayward pump 12 minutes ago',
      '✅ Contractor from Alexandria inquired about a sand filter 28 minutes ago',
      '✅ Villa owner from Sheikh Zayed requested a chemicals quote 45 minutes ago',
      '✅ North Coast resort requested LED lighting quote 1 hour ago',
    ],
    ar: [
      '✅ عميل من القاهرة طلب عرض سعر على طلمبة Hayward منذ 12 دقيقة',
      '✅ مقاول من الإسكندرية استفسر عن فلتر رملي منذ 28 دقيقة',
      '✅ صاحب فيلا من الشيخ زايد طلب عرض سعر على كيماويات منذ 45 دقيقة',
      '✅ منتجع في الساحل الشمالي طلب عرض سعر على إضاءة LED منذ ساعة',
    ],
  };

  function initFOMOTicker() {
    if (_isBlog || _is404) return;

    var msgs  = _isAr ? _fomoMessages.ar : _fomoMessages.en;
    var idx   = 0;
    var ticker = document.createElement('div');
    ticker.id  = 'fomo-ticker';
    document.body.appendChild(ticker);

    function showNext() {
      if (!_showUrgency('fomo')) return;
      ticker.textContent = msgs[idx];
      if (!_reducedMotion) {
        ticker.classList.add('fomo-visible');
      } else {
        ticker.style.display = 'block';
      }
      setTimeout(function () {
        ticker.classList.remove('fomo-visible');
        ticker.style.display = 'none';
        idx = (idx + 1) % msgs.length;
        _hideUrgency('fomo');
      }, 4000);
    }

    // Start after 3s delay, then every 5s
    setTimeout(function () {
      showNext();
      setInterval(showNext, 5000);
    }, 3000);
  }

  // ── Real-time order notification ─────────────────────────────────────────
  function initRealOrderNotification() {
    window.addEventListener('maxpool:order', function(e) {
      var product = (e.detail && e.detail.product) ? e.detail.product : 'a product';
      var msg = _isAr
        ? '✅ عميل طلب للتو عرض سعر على: ' + product
        : '✅ A client just requested a quote on: ' + product;

      var ticker = document.getElementById('fomo-ticker');
      if (!ticker) {
        ticker = document.createElement('div');
        ticker.id = 'fomo-ticker';
        document.body.appendChild(ticker);
      }
      ticker.textContent = msg;
      ticker.classList.add('fomo-visible');
      setTimeout(function() {
        ticker.classList.remove('fomo-visible');
        ticker.style.display = 'none';
      }, 5000);
    });
  }

  // ── 3. ViewerCounter ──────────────────────────────────────────────────────
  function initViewerCounter() {
    var container = document.getElementById('productContainer');
    if (!container) return;

    var count = Math.floor(Math.random() * 10) + 3;
    var label = _isAr
      ? ' أشخاص يشاهدون هذا المنتج الآن 👁'
      : ' people viewing this product now';

    var el = document.createElement('div');
    el.id  = 'viewer-counter';
    el.innerHTML = '👁 <span id="viewer-count">' + count + '</span>' + label;

    // Wait for h1 to be rendered (product.js renders it dynamically)
    var obs = new MutationObserver(function () {
      var h1 = container.querySelector('h1');
      if (h1 && !document.getElementById('viewer-counter')) {
        h1.insertAdjacentElement('afterend', el);
      }
    });
    obs.observe(container, { childList: true, subtree: true });

    // Also try immediately
    var h1 = container.querySelector('h1');
    if (h1) h1.insertAdjacentElement('afterend', el);

    function scheduleUpdate() {
      var delay = Math.floor(Math.random() * 25000) + 20000;
      setTimeout(function () {
        var delta = Math.random() < 0.5 ? -1 : 1;
        count = Math.max(1, count + delta);
        var countEl = document.getElementById('viewer-count');
        if (countEl) countEl.textContent = count;
        scheduleUpdate();
      }, delay);
    }
    scheduleUpdate();
  }

  // ── 4. ScarcityBadge ──────────────────────────────────────────────────────
  function initScarcityBadge() {
    var grid = document.getElementById('catalogGrid');
    if (!grid) return;

    var badgeText = _isAr ? '🔥 الأكثر طلباً' : '🔥 High Demand';

    function applyBadges() {
      var cards = grid.querySelectorAll('.product-card');
      var count = 0;
      for (var i = 0; i < cards.length && count < 3; i++) {
        var wrap = cards[i].querySelector('.card-image-wrap');
        if (wrap && !wrap.querySelector('.scarcity-badge')) {
          var badge = document.createElement('span');
          badge.className   = 'scarcity-badge';
          badge.textContent = badgeText;
          wrap.appendChild(badge);
          count++;
        }
      }
    }

    var obs = new MutationObserver(function () {
      applyBadges();
    });
    obs.observe(grid, { childList: true, subtree: true });
    applyBadges();
  }

  // ── 5. ResponseTimer ──────────────────────────────────────────────────────
  function initResponseTimer() {
    var text = _isAr
      ? '<i class="fa-regular fa-clock"></i> ⏱ متوسط وقت الرد: أقل من ساعتين'
      : '<i class="fa-regular fa-clock"></i> ⏱ Average response time: under 2 hours';

    function inject() {
      if (document.querySelector('.response-timer')) return;
      // Try to find WhatsApp button area
      var waBtn = document.querySelector('#productWhatsAppBtn, .whatsapp-cta, [id*="whatsapp"], [class*="whatsapp"]');
      if (!waBtn) return;
      var p = document.createElement('p');
      p.className   = 'response-timer';
      p.innerHTML   = text;
      waBtn.parentElement.insertAdjacentElement('afterend', p);
    }

    // Try immediately and also watch for dynamic content
    inject();
    var obs = new MutationObserver(inject);
    var container = document.getElementById('productContainer') || document.body;
    obs.observe(container, { childList: true, subtree: true });
  }

  // ── 6. TimeSensitiveCTAs ──────────────────────────────────────────────────
  function initTimeSensitiveCTAs() {
    var container = document.getElementById('productContainer');
    if (!container) return;

    var hintText   = _isAr ? '⚡ عادةً ما نرد خلال ساعتين' : '⚡ We usually respond within 2 hours';
    var onlineText = _isAr ? 'متاح الآن للرد' : 'Available now to respond';

    function inject() {
      // Inject urgency hint after CTA buttons
      if (!container.querySelector('.urgency-hint')) {
        var ctaDiv = container.querySelector('[style*="display:flex"][style*="gap"]');
        if (ctaDiv) {
          var hint = document.createElement('p');
          hint.className   = 'urgency-hint';
          hint.textContent = hintText;
          ctaDiv.insertAdjacentElement('afterend', hint);
        }
      }
      // Inject online indicator near WhatsApp button
      if (!container.querySelector('.online-indicator')) {
        var waBtn = container.querySelector('#productWhatsAppBtn');
        if (waBtn) {
          var indicator = document.createElement('div');
          indicator.className = 'online-indicator';
          indicator.innerHTML = '<span class="online-dot"></span>' + onlineText;
          waBtn.insertAdjacentElement('afterend', indicator);
        }
      }
    }

    inject();
    var obs = new MutationObserver(inject);
    obs.observe(container, { childList: true, subtree: true });
  }

  // ── 7. ExitPrompt ─────────────────────────────────────────────────────────
  function initExitPrompt() {
    if (window.innerWidth < 768) return;
    if (sessionStorage.getItem('exitPromptShown') === 'true') return;

    var heading = _isAr
      ? 'انتظر! هل تحتاج مساعدة في اختيار المعدات المناسبة؟'
      : 'Wait! Need help choosing the right equipment?';
    var subtext = _isAr
      ? 'خبراؤنا التقنيون جاهزون للرد على استفساراتك الآن.'
      : 'Our technical experts are ready to answer your questions now.';
    var btnText = _isAr ? 'تحدث مع خبير الآن' : 'Talk to an expert now';
    var closeText = _isAr ? 'لا شكراً، سأتصفح لاحقاً' : 'No thanks, I\'ll browse later';
    var waMsg   = _isAr
      ? 'مرحباً ماكس بول، أحتاج مساعدة في اختيار المعدات المناسبة'
      : 'Hello Max Pool, I need help choosing the right equipment';

    var overlay = document.createElement('div');
    overlay.id  = 'exit-overlay';
    overlay.innerHTML =
      '<div id="exit-modal">' +
        '<h3>' + heading + '</h3>' +
        '<p>' + subtext + '</p>' +
        '<button id="exit-modal-wa"><i class="fa-brands fa-whatsapp"></i> ' + btnText + '</button>' +
        '<br><button id="exit-modal-close">' + closeText + '</button>' +
      '</div>';
    document.body.appendChild(overlay);

    function closeOverlay() {
      overlay.classList.remove('exit-visible');
      _hideUrgency('exit');
    }

    document.getElementById('exit-modal-wa').addEventListener('click', function () {
      _openWA(waMsg);
      closeOverlay();
    });
    document.getElementById('exit-modal-close').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeOverlay();
    });

    var _triggered = false;
    document.addEventListener('mouseleave', function (e) {
      if (e.clientY > 10 || _triggered) return;
      if (sessionStorage.getItem('exitPromptShown') === 'true') return;
      setTimeout(function () {
        if (!_showUrgency('exit')) return;
        _triggered = true;
        sessionStorage.setItem('exitPromptShown', 'true');
        overlay.classList.add('exit-visible');
      }, 300);
    });
  }

  // ── 8. ScrollCTA ──────────────────────────────────────────────────────────
  function initScrollCTA() {
    var btnText = _isAr ? 'احصل على عرض سعر الآن' : 'Get a Quote Now';
    var waMsg   = _isAr
      ? 'مرحباً ماكس بول، أريد الحصول على عرض سعر'
      : 'Hello Max Pool, I\'d like to get a quote';

    var btn = document.createElement('button');
    btn.id  = 'scroll-cta';
    btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> ' + btnText;
    document.body.appendChild(btn);

    btn.addEventListener('click', function () {
      _openWA(waMsg);
    });

    var _visible = false;
    window.addEventListener('scroll', function () {
      var total = document.body.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      var ratio = window.scrollY / total;
      if (ratio > 0.4 && !_visible) {
        _visible = true;
        btn.classList.add('visible');
      } else if (ratio < 0.2 && _visible) {
        _visible = false;
        btn.classList.remove('visible');
      }
    }, { passive: true });
  }

  // ── Init ──────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initUrgencyBar();

    if (!_isBlog && !_is404) {
      initFOMOTicker();
      initRealOrderNotification();
    }

    if (_page === 'product') {
      initViewerCounter();
      initTimeSensitiveCTAs();
      initResponseTimer();
    }

    if (_page === 'contact') {
      initResponseTimer();
    }

    if (_page === 'products') {
      initScarcityBadge();
    }

    if (_page === 'index' || _page === 'products') {
      initScrollCTA();
    }

    if (window.innerWidth >= 768) {
      initExitPrompt();
    }
  });

})();
