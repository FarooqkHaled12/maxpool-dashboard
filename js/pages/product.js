/**
 * product.js — Max Pool Product Detail Page Logic
 *
 * Fetches product by ID, renders detail view, initializes WhatsApp,
 * injects sticky CTA bar, and loads related products.
 *
 * Moved from inline <script> blocks in product.html and ar/product.html.
 * Requires: js/config.js, js/main.js, js/modules/whatsapp.js, js/leadTracker.js
 */
(function () {
  'use strict';

  var isAr = document.documentElement.lang === 'ar';
  var BASE = window.BASE_PATH || '';

  function resolveImage(product) {
    var raw = Array.isArray(product.images) ? product.images[0] : (typeof product.images === 'string' ? product.images : null);
    if (!raw) return product.image ? '/' + product.image.replace(/^\//, '') : '/assets/images/logo.png';
    if (raw.startsWith('http')) return raw;
    if (raw.startsWith('/uploads') || raw.startsWith('/images')) return 'https://maxpool-production.up.railway.app' + raw;
    return '/' + raw.replace(/^\//, '');
  }

  function renderProduct(product) {
    var container = document.getElementById('productContainer');
    if (!container) return;

    var t   = product.name || product.title || '';
    var img = resolveImage(product);
    var pid = product._id || product.id;

    var defaultBenefits = isAr
      ? ['متوفر الآن', 'جودة عالية', 'مستخدم في المسابح التجارية']
      : ['Available now', 'High quality', 'Used in commercial pools'];
    var benefits = (window.extractBenefits || function () { return defaultBenefits; })(product.description, isAr);

    var benefitsHTML = benefits.map(function (b) {
      return '<li style="padding:6px 0;display:flex;align-items:center;gap:8px;' + (isAr ? 'flex-direction:row-reverse;' : '') + '">'
        + '<i class="fa-solid fa-check-circle" style="color:#25D366;"></i> ' + b + '</li>';
    }).join('');

    var quoteLabel  = isAr ? 'طلب عرض سعر' : 'Request Quote';
    var waLabel     = isAr ? 'واتساب'       : 'WhatsApp';
    var brandLabel  = isAr ? (product.brand || 'ماكس بول') : (product.brand || 'Max Pool Standard');
    var descBorder  = isAr ? 'border-right:4px solid #004b87;padding-right:15px;' : 'border-left:4px solid #004b87;padding-left:15px;';
    var trustAlign  = isAr ? 'justify-content:flex-end;' : '';
    var textAlign   = isAr ? 'text-align:right;' : '';

    var trustItems = isAr
      ? [['متوفر الآن', 'fa-circle-check', '#25D366', 'متوفر في مستودعنا بالقاهرة.'],
         ['جودة عالية', 'fa-medal', '#f59e0b', 'مختبر في ظروف الضغط القصوى.'],
         ['مستخدم في المسابح التجارية', 'fa-building', '#004b87', 'موثوق من المنتجعات والمقاولين.']]
      : [['Available now', 'fa-circle-check', '#25D366', 'In stock at our Cairo warehouse.'],
         ['High quality', 'fa-medal', '#f59e0b', 'Tested against extreme pressures.'],
         ['Used in commercial pools', 'fa-building', '#004b87', 'Trusted by resorts and contractors.']];

    var trustHTML = trustItems.map(function (item) {
      return '<div style="background:white;padding:25px;border-radius:15px;text-align:center;box-shadow:0 5px 15px rgba(0,0,0,0.05);">'
        + '<i class="fa-solid ' + item[1] + ' fa-2x" style="color:' + item[2] + ';margin-bottom:15px;"></i>'
        + '<h4>' + item[0] + '</h4>'
        + '<p style="color:#666;font-size:14px;">' + item[3] + '</p>'
        + '</div>';
    }).join('');

    var trustBadges = trustItems.map(function (item) {
      return '<span style="display:inline-flex;align-items:center;gap:6px;background:#f0f9ff;border:1px solid #bae6fd;border-radius:20px;padding:5px 12px;font-size:13px;font-weight:600;color:#0077b6;">'
        + '<i class="fa-solid ' + item[1] + '"></i> ' + item[0] + '</span>';
    }).join('');

    var benefitsLabel = isAr ? 'المزايا الرئيسية' : 'Key Benefits';
    var useCaseLabel  = isAr ? 'حالات الاستخدام'  : 'Use Cases';
    var useCaseText   = isAr ? 'مثالي للمسابح السكنية والتجارية' : 'Ideal for residential and commercial pools';

    document.title = t + (isAr ? ' — ماكس بول مصر' : ' — Max Pool');

    container.innerHTML =
      '<div style="display:flex;flex-wrap:wrap;gap:24px;background:white;padding:clamp(16px,4vw,40px);border-radius:20px;box-shadow:0 15px 30px rgba(0,0,0,0.05);">'
      + '<div style="flex:1;min-width:min(300px,100%);border-radius:15px;overflow:hidden;background:#f9f9f9;display:flex;justify-content:center;align-items:center;">'
      + '<img src="' + img + '" alt="' + t + '" loading="lazy" style="max-width:100%;max-height:500px;object-fit:contain;"></div>'
      + '<div style="flex:1;min-width:min(300px,100%);display:flex;flex-direction:column;justify-content:center;' + textAlign + '">'
      + '<span style="display:inline-block;background:rgba(0,75,135,0.1);color:#004b87;padding:5px 15px;border-radius:20px;font-weight:bold;font-size:14px;margin-bottom:15px;width:max-content;"><i class="fa-solid fa-tag"></i> ' + brandLabel + '</span>'
      + '<h1 style="font-size:clamp(28px,4vw,36px);color:#222;margin-bottom:16px;">' + t + '</h1>'
      + '<p style="font-size:16px;line-height:1.6;color:#555;margin-bottom:20px;' + descBorder + '">' + (product.description || '') + '</p>'
      + '<h3 style="margin-bottom:10px;font-size:16px;"><i class="fa-solid fa-star" style="color:#f59e0b;"></i> ' + benefitsLabel + '</h3>'
      + '<ul class="key-benefits-list" style="list-style:none;padding:0;margin-bottom:20px;">' + benefitsHTML + '</ul>'
      + '<h3 style="margin-bottom:8px;font-size:16px;"><i class="fa-solid fa-circle-info" style="color:#004b87;"></i> ' + useCaseLabel + '</h3>'
      + '<p style="color:#555;font-size:14px;margin-bottom:20px;">' + useCaseText + '</p>'
      + '<div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:24px;' + trustAlign + '">' + trustBadges + '</div>'
      + '<div style="display:flex;gap:12px;">'
      + '<button onclick="addToCart(\'' + pid + '\',\'' + t.replace(/'/g, "\\'") + '\')" class="btn btn-primary btn-lg" style="flex:2;font-size:16px;"><i class="fa-solid fa-cart-plus"></i> ' + quoteLabel + '</button>'
      + '<button id="productWhatsAppBtn" class="btn btn-outline btn-lg" style="flex:1;color:#25D366;border-color:#25D366;"><i class="fa-brands fa-whatsapp"></i> ' + waLabel + '</button>'
      + '</div></div></div>'
      + '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin-top:40px;">' + trustHTML + '</div>';

    if (typeof window.initProductWhatsApp === 'function') {
      window.initProductWhatsApp(product);
    }

    if (!document.getElementById('stickyCta')) {
      var stickyBar = document.createElement('div');
      stickyBar.id = 'stickyCta';
      stickyBar.className = 'sticky-cta-bar';
      if (isAr) {
        stickyBar.innerHTML =
          '<button onclick="handleProductWhatsApp(\'' + t.replace(/'/g, "\\'") + '\');" class="btn btn-outline" style="flex:1;color:#25D366;border-color:#25D366;"><i class="fa-brands fa-whatsapp"></i> واتساب</button>'
          + '<button onclick="addToCart(\'' + pid + '\',\'' + t.replace(/'/g, "\\'") + '\');" class="btn btn-primary" style="flex:1;"><i class="fa-solid fa-cart-plus"></i> طلب عرض سعر</button>';
      } else {
        stickyBar.innerHTML =
          '<button onclick="addToCart(\'' + pid + '\',\'' + t.replace(/'/g, "\\'") + '\'); this.textContent=\'✓ Added!\'; setTimeout(()=>this.innerHTML=\'<i class=\\\'fa-solid fa-cart-plus\\\'></i> Request Quote\',1500);" class="btn btn-primary" style="flex:1;"><i class="fa-solid fa-cart-plus"></i> Request Quote</button>'
          + '<button onclick="handleProductWhatsApp(\'' + t.replace(/'/g, "\\'") + '\');" class="btn btn-outline" style="flex:1;color:#25D366;border-color:#25D366;"><i class="fa-brands fa-whatsapp"></i> WhatsApp</button>';
      }
      document.body.appendChild(stickyBar);
    }

    if (product.category && window.renderRelatedProducts && window._RELATED_MAP_REF) {
      var relatedCats = window._RELATED_MAP_REF[product.category] || [];
      if (relatedCats.length > 0) {
        var apiBase = (typeof API_BASE !== 'undefined') ? API_BASE : 'https://maxpool-production.up.railway.app';
        window.MaxPoolAPI.getProducts({ category: relatedCats[0], limit: 4 })
          .then(function (result) { window.renderRelatedProducts(result.products); })
          .catch(function () {});
      }
    }
  }

  function init() {
    var container = document.getElementById('productContainer');
    if (!container) return;

    var params    = new URLSearchParams(window.location.search);
    var productId = params.get('id');
    var apiBase   = (typeof API_BASE !== 'undefined') ? API_BASE : 'https://maxpool-production.up.railway.app';

    if (!productId) {
      container.innerHTML = isAr
        ? "<h2 style='text-align:center;color:red;'>المنتج غير موجود</h2><p style='text-align:center;'><a href='products.html'>← العودة للمعدات</a></p>"
        : "<h2 style='text-align:center;color:red;'>Product Not Found</h2><p style='text-align:center;'><a href='products.html'>← Back to Products</a></p>";
      return;
    }

    window.MaxPoolAPI.getProductById(productId)
      .then(function (product) {
        if (!product || !product._id) {
          container.innerHTML = isAr
            ? "<h2 style='text-align:center;color:red;'>المنتج غير موجود في قاعدة البيانات</h2>"
            : "<h2 style='text-align:center;color:red;'>Product Not Found in Database</h2>";
          return;
        }
        renderProduct(product);
      })
      .catch(function () {
        container.innerHTML = isAr
          ? "<h2 style='text-align:center;color:red;'>تعذر الاتصال بالخادم.</h2>"
          : "<h2 style='text-align:center;color:red;'>Could not connect to server.</h2>";
      });
  }

  document.addEventListener('DOMContentLoaded', init);

})();
