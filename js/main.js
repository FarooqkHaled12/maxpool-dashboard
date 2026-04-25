document.addEventListener('DOMContentLoaded', () => {

  // ── Load site settings from API and apply dynamic content ──────────────
  const _isAr = window.location.pathname.includes('/ar/');

  window.MaxPoolAPI.getSettings().then(s => {
    if (!s) return;
      // Phone number
      if (s.phone) {
        document.querySelectorAll('a[href^="tel:"]').forEach(a => { a.href = `tel:${s.phone}`; if (!a.querySelector('i')) a.textContent = s.phone; });
        document.querySelectorAll('.footer-contact p').forEach(p => {
          if (p.innerHTML.includes('fa-phone')) p.innerHTML = `<i class="fa-solid fa-phone"></i> ${s.phone}`;
        });
      }
      // WhatsApp — update central number; static links in blog/pricing/footer get patched
      if (s.whatsapp) {
        window.WA_NUMBER = s.whatsapp;
        // Patch static wa.me anchor links (blog posts, pricing pages, hero CTAs, footer)
        // Dynamic buttons (product cards, floating widget, cart) use window.WA_NUMBER via openWhatsApp()
        document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
          a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${s.whatsapp}`);
        });
      }
      // Facebook
      if (s.facebook_url) {
        document.querySelectorAll('a[href*="facebook.com"]').forEach(a => { a.href = s.facebook_url; });
      }
      // Hero title & subtitle — handled by page-loader.js (pages API)
      // main.js only updates from settings API as a fallback when page-loader is not active
      const heroTitle = document.querySelector('.hero-title');
      const heroSub   = document.querySelector('.hero-subtitle');
      if (heroTitle && !heroTitle.dataset.pageLoaded) {
        const txt = _isAr ? s.hero_title_ar : s.hero_title_en;
        if (txt && txt.length > 5) heroTitle.innerHTML = txt;
      }
      if (heroSub && !heroSub.dataset.pageLoaded) {
        const txt = _isAr ? s.hero_sub_ar : s.hero_sub_en;
        const current = heroSub.textContent || '';
        if (txt && txt.length >= current.length) heroSub.textContent = txt;
      }
    })
    .catch(() => {}); // Fail silently — hardcoded fallbacks remain

  // --- FLOATING WHATSAPP WIDGET ---
  const waBtn = document.createElement('button');
  waBtn.setAttribute('aria-label', 'Contact via WhatsApp');
  waBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
  waBtn.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 20px;
    background-color: #25D366;
    color: white;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
    z-index: 9999;
    border: none;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;
  waBtn.onmouseover = () => waBtn.style.transform = 'scale(1.15)';
  waBtn.onmouseout  = () => waBtn.style.transform = 'scale(1)';
  waBtn.onclick     = () => {
    if (typeof window.trackWhatsAppLead === 'function') {
      window.trackWhatsAppLead('float', null);
    }
    window.openWhatsApp(window.buildGeneralMessage());
  };
  document.body.appendChild(waBtn);

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.navbar-toggle');
  const navLinks = document.querySelector('.navbar-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Navbar scroll shadow
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  // Scroll fade-in
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
    });
  }, { root: null, rootMargin: '0px', threshold: 0.1 });
  document.querySelectorAll('section').forEach(s => { s.classList.add('fade-in-section'); observer.observe(s); });

  // ─────────────────────────────────────────────────────────────────────────
  // CART / QUOTATION SYSTEM
  // Defined at top level — works on ALL pages (products list AND product detail)
  // ─────────────────────────────────────────────────────────────────────────

  window.cartItems = [];

  window.addToCart = (id, title) => {
    window.cartItems.push({ id, title });
    updateCartUI();
  };

  window.openCartModal = () => {
    const modal = document.getElementById('cartModal');
    if (!modal) return;
    modal.style.display = 'flex';
    const list = document.getElementById('cartList');
    list.innerHTML = window.cartItems.map((item, index) => `
      <li style="padding:15px 0; border-bottom:1px solid #f5f5f5; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:500; font-size:15px;">${index + 1}. ${item.title}</span>
        <button type="button" onclick="removeFromCart(${index})" style="color:#e74c3c; background:rgba(231,76,60,0.1); border:none; width:30px; height:30px; border-radius:5px; cursor:pointer; transition:0.2s;"><i class="fa-solid fa-trash"></i></button>
      </li>
    `).join('');
    if (window.cartItems.length === 0) {
      list.innerHTML = `<li style='padding:20px; text-align:center; color:#999;'><i class='fa-solid fa-box-open' style='font-size:32px; display:block; margin-bottom:10px;'></i>${document.documentElement.lang === 'ar' ? 'لم يتم اختيار أي منتجات بعد.' : 'No items selected yet.'}</li>`;
    }
  };

  window.removeFromCart = (index) => {
    window.cartItems.splice(index, 1);
    updateCartUI();
    window.openCartModal();
  };

  const updateCartUI = () => {
    let cartIcon = document.getElementById('floatingCartBtn');
    if (!cartIcon) {
      cartIcon = document.createElement('div');
      cartIcon.id = 'floatingCartBtn';
      cartIcon.style.cssText = `
        position: fixed; bottom: 90px; right: 20px; background: #004b87; color: white;
        border-radius: 50%; width: 52px; height: 52px; display: flex; justify-content: center;
        align-items: center; font-size: 22px; box-shadow: 0 4px 15px rgba(0,75,135,0.4);
        z-index: 9998; cursor: pointer; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      `;
      cartIcon.onmouseover = () => cartIcon.style.transform = 'scale(1.15)';
      cartIcon.onmouseout = () => cartIcon.style.transform = 'scale(1)';
      cartIcon.onclick = window.openCartModal;
      document.body.appendChild(cartIcon);

      const badge = document.createElement('span');
      badge.id = 'cartCount';
      badge.style.cssText = `
        position: absolute; top: -5px; right: -5px; background: #E74C3C; color: white;
        font-size: 14px; font-weight: bold; width: 24px; height: 24px; border-radius: 50%;
        display: flex; justify-content: center; align-items: center; border: 2px solid white;
      `;
      cartIcon.innerHTML = '<i class="fa-solid fa-cart-shopping"></i>';
      cartIcon.appendChild(badge);

      // Inject modal once
      const isAr = document.documentElement.lang === 'ar';
      const modal = document.createElement('div');
      modal.id = 'cartModal';
      modal.style.cssText = `
        display:none; position:fixed; top:0; left:0; width:100%; height:100%;
        background:rgba(0,0,0,0.6); z-index:10000; justify-content:center; align-items:center; backdrop-filter: blur(5px);
      `;
      modal.innerHTML = `
        <div style="background:white; padding:30px; border-radius:16px; width:90%; max-width:500px; max-height:85vh; overflow-y:auto; position:relative; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
          <button onclick="document.getElementById('cartModal').style.display='none'" style="position:absolute; top:20px; right:20px; border:none; background:none; font-size:28px; cursor:pointer; color:#777;">&times;</button>
          <h2 style="margin-bottom:5px; color:#004b87; display:flex; align-items:center; gap:10px;"><i class="fa-solid fa-clipboard-list"></i> ${isAr ? 'طلب عرض سعر' : 'Quotation Request'}</h2>
          <p style="color:#666; font-size:14px; margin-bottom:20px;">${isAr ? 'راجع المنتجات وأرسلها إلى فريق المبيعات.' : 'Review your items and send them to sales.'}</p>
          <ul id="cartList" style="list-style:none; padding:0; margin:0 0 20px 0; border-top:1px solid #eee; border-bottom:1px solid #eee; min-height:80px; max-height:300px; overflow-y:auto;"></ul>
          <form id="checkoutForm" style="display:flex; flex-direction:column; gap:15px;">
            <input type="text" id="custName" placeholder="${isAr ? 'الاسم الكامل' : 'Full Name'}" required class="form-control" style="padding:12px; border-radius:8px; border:1px solid #ddd; outline:none;">
            <input type="tel" id="custPhone" placeholder="${isAr ? 'رقم الهاتف' : 'Phone Number'}" required class="form-control" style="padding:12px; border-radius:8px; border:1px solid #ddd; outline:none;">
            <button type="submit" class="btn btn-primary" style="padding:15px; width:100%; border-radius:8px; font-weight:bold; font-size:16px; background:#004b87;">${isAr ? 'إرسال الطلب إلى المبيعات' : 'Send Request to Sales'}</button>
          </form>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('checkoutForm').onsubmit = (e) => {
        e.preventDefault();
        const name  = document.getElementById('custName').value.trim();
        const phone = document.getElementById('custPhone').value.trim();
        const items = window.cartItems;
        if (items.length === 0) return alert(document.documentElement.lang === 'ar' ? 'قائمة العروض فارغة!' : 'Your quote list is empty!');
        if (!name || !phone) return alert(document.documentElement.lang === 'ar' ? 'يرجى إدخال الاسم ورقم الهاتف.' : 'Please fill in your name and phone number.');

        const itemsList = items.map((item, i) => `${i + 1}. ${item.title}`).join('%0A');

        // Open PDF quotation window
        const pdfWin = window.open('', '_blank');
        if (pdfWin) {
          pdfWin.document.write(`
            <html><head><title>Official Quotation - Max Pool</title>
            <style>
              body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
              .header { display: flex; justify-content: space-between; border-bottom: 3px solid #004b87; padding-bottom: 20px; margin-bottom: 30px; }
              .logo-text { color:#004b87; margin:0; font-size:32px; font-weight:900; letter-spacing:2px; }
              .details { margin-bottom: 30px; background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #004b87; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
              th, td { border: 1px solid #ddd; padding: 15px; text-align: left; }
              th { background: #004b87; color: white; font-weight:bold; }
              tr:nth-child(even) { background-color: #f2f2f2; }
            </style></head>
            <body>
              <div style="text-align:right; margin-bottom:20px;">
                <button onclick="window.print()" style="background:#004b87; color:white; border:none; padding:10px 24px; border-radius:8px; font-size:15px; font-weight:700; cursor:pointer;">🖨️ Print / Save PDF</button>
              </div>
              <div class="header">
                <div>
                  <h1 class="logo-text">MAX POOL</h1>
                  <p style="margin:5px 0; color:#666;">European Standards. Premium Equipment.</p>
                  <p style="margin:5px 0; color:#666;">Phone: 01006205650 | Web: max-pool-eg.com</p>
                </div>
                <div style="text-align:right;">
                  <h2 style="margin:0; color:#555;">QUOTATION REQUEST</h2>
                  <p style="color:#666;">Date: ${new Date().toLocaleDateString()}</p>
                  <p style="color:#666;">Ref: ${Date.now().toString().slice(-6)}</p>
                </div>
              </div>
              <div class="details">
                <h3 style="margin-top:0; color:#004b87;">Client Details:</h3>
                <p style="margin:5px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin:5px 0;"><strong>Phone:</strong> ${phone}</p>
              </div>
              <table>
                <tr><th style="width:10%">Item #</th><th>Product Description</th><th style="width:15%">Quantity</th></tr>
                ${items.map((item, i) => `<tr><td>${i + 1}</td><td><strong>${item.title}</strong></td><td>1 Unit</td></tr>`).join('')}
              </table>
              <div style="text-align:center; margin-top:50px;">
                <h3 style="color:#004b87;">Thank you for trusting Max Pool!</h3>
                <p style="font-size:13px; color:#888;">Our engineering sales team will contact you shortly with formal pricing and availability.</p>
              </div>
            </body></html>
          `);
          pdfWin.document.close();
        }

        // POST order to MongoDB — fire and forget
        window.MaxPoolAPI.postOrder({ name, phone, items });

        // Send WhatsApp message via central system
        window.openWhatsApp(window.buildCartMessage(items, name, phone));
        // Track cart lead — fire and forget
        if (typeof window.trackCartLead === 'function') {
          window.trackCartLead(items, name, phone);
        }
        window.cartItems = [];
        updateCartUI();
        document.getElementById('cartModal').style.display = 'none';
        // Fire real FOMO notification for other visitors
        if (items.length > 0) {
          var firstProduct = items[0].title;
          window.dispatchEvent(new CustomEvent('maxpool:order', { detail: { product: firstProduct } }));
        }
        e.target.reset();
      };
    }

    const countEl = document.getElementById('cartCount');
    if (countEl) {
      countEl.innerText = window.cartItems.length;
      countEl.style.transform = 'scale(1.5)';
      setTimeout(() => countEl.style.transform = 'scale(1)', 200);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RELATED / CROSS-SELL PRODUCTS SYSTEM
  // Reuses products already fetched — no new API calls
  // ─────────────────────────────────────────────────────────────────────────

  // Category relation map — defines which categories are related to each other
  const RELATED_MAP = {
    'cat-pumps':        ['cat-filters', 'cat-chemicals', 'cat-fittings'],
    'cat-filters':      ['cat-pumps', 'cat-chemicals', 'cat-cleaners'],
    'cat-chemicals':    ['cat-pumps', 'cat-filters', 'cat-testing'],
    'cat-lights':       ['cat-fittings', 'cat-controls', 'cat-transformers'],
    'cat-fittings':     ['cat-pumps', 'cat-lights', 'cat-spareparts'],
    'cat-cleaners':     ['cat-filters', 'cat-chemicals', 'cat-testing'],
    'cat-testing':      ['cat-chemicals', 'cat-cleaners', 'cat-filters'],
    'cat-jacuzzi':      ['cat-pumps', 'cat-lights', 'cat-heaters'],
    'cat-heaters':      ['cat-pumps', 'cat-controls', 'cat-jacuzzi'],
    'cat-ladders':      ['cat-fittings', 'cat-cleaners', 'cat-spareparts'],
    'cat-waterfalls':   ['cat-pumps', 'cat-lights', 'cat-fittings'],
    'cat-spareparts':   ['cat-pumps', 'cat-filters', 'cat-fittings'],
    'cat-controls':     ['cat-pumps', 'cat-lights', 'cat-transformers'],
    'cat-pipeless':     ['cat-pumps', 'cat-filters', 'cat-chemicals'],
    'cat-transformers': ['cat-lights', 'cat-controls', 'cat-fittings'],
  };

  // Expose RELATED_MAP globally so product detail pages can reference it
  window._RELATED_MAP_REF = RELATED_MAP;

  // Pure function — no DOM manipulation
  window.getRelatedProducts = (currentCategory, allProducts) => {
    if (!currentCategory || currentCategory === 'all' || !allProducts) return [];
    const relatedCategories = RELATED_MAP[currentCategory] || [];
    return allProducts
      .filter(p => relatedCategories.includes(p.category))
      .slice(0, 4);
  };

  // Render related products into #relatedProducts container
  window.renderRelatedProducts = (products) => {
    const container = document.getElementById('relatedProducts');
    if (!container) return;
    const section = container.closest('.related-section');
    if (!products || products.length === 0) {
      if (section) section.style.display = 'none';
      return;
    }
    if (section) section.style.display = '';
    const isAr = document.documentElement.lang === 'ar';
    const BASE = window.BASE_PATH || '';
    container.innerHTML = products.map(p => {
      const pid   = p._id || p.id;
      const title = p.name || p.title || '';
      const img   = (() => {
        const raw = Array.isArray(p.images) ? p.images[0] : (typeof p.images === 'string' ? p.images : null);
        if (!raw) return p.image ? `/${p.image.replace(/^\//, '')}` : `/assets/images/logo.png`;
        if (raw.startsWith('http')) return raw;
        if (raw.startsWith('/uploads') || raw.startsWith('/images')) return 'https://maxpool-production.up.railway.app' + raw;
        return `/${raw.replace(/^\//, '')}`;
      })();
      const quoteLabel = isAr ? 'طلب عرض سعر' : 'Request Quote';
      const waLabel    = isAr ? 'واتساب' : 'WhatsApp';
      return `
        <div class="card product-card">
          <div class="card-image-wrap" style="cursor:pointer;" onclick="window.location.href='${BASE}product.html?id=${pid}'">
            <img src="${img}" alt="${title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;">
            <div class="card-badge">${p.brandName || p.brand || ''}</div>
            <div class="card-overlay"></div>
          </div>
          <div class="card-content">
            <h3 style="cursor:pointer;" onclick="window.location.href='${BASE}product.html?id=${pid}'">${title}</h3>
            <div class="product-card-actions">
              <button class="btn btn-primary btn-sm" onclick="addToCart('${pid}', '${title.replace(/'/g, "\\'")}')">
                <i class="fa-solid fa-cart-plus"></i> ${quoteLabel}
              </button>
              <button class="btn btn-outline btn-sm" onclick="handleProductWhatsApp('${title.replace(/'/g, "\\'")}')">
                <i class="fa-brands fa-whatsapp"></i> ${waLabel}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  };

  // ─────────────────────────────────────────────────────────────────────────
  // CATALOG FILTERING, SEARCH & PAGINATION (products.html only)
  // ─────────────────────────────────────────────────────────────────────────

  const catBtnGroup   = document.getElementById('categoryFilters');
  const brandBtnGroup = document.getElementById('brandFilters');
  const catalogGrid   = document.getElementById('catalogGrid');
  const noResultMsg   = document.getElementById('no-results-msg');
  const loader        = document.getElementById('loader');

  if (catalogGrid) {
    let currentCategory = 'all';
    let currentBrand    = 'all';
    let currentSearch   = '';
    let currentPage     = 1;
    const PAGE_SIZE     = 12;
    let totalPages      = 1;

    // ── Pagination controls ─────────────────────────────────────────────────
    const renderPagination = () => {
      let paginationEl = document.getElementById('catalogPagination');
      if (!paginationEl) {
        paginationEl = document.createElement('div');
        paginationEl.id = 'catalogPagination';
        paginationEl.style.cssText = 'display:flex; justify-content:center; align-items:center; gap:8px; margin-top:32px; flex-wrap:wrap;';
        catalogGrid.parentElement.appendChild(paginationEl);
      }
      if (totalPages <= 1) { paginationEl.innerHTML = ''; return; }
      let html = `<button onclick="window._goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} style="padding:8px 16px; border-radius:8px; border:1px solid #ddd; background:white; cursor:pointer; font-size:13px; ${currentPage === 1 ? 'opacity:0.4;' : ''}"><i class="fa-solid fa-chevron-left"></i></button>`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<button onclick="window._goPage(${i})" style="padding:8px 14px; border-radius:8px; border:1px solid ${i === currentPage ? '#004b87' : '#ddd'}; background:${i === currentPage ? '#004b87' : 'white'}; color:${i === currentPage ? 'white' : '#333'}; cursor:pointer; font-size:13px; font-weight:${i === currentPage ? '700' : '400'};">${i}</button>`;
      }
      html += `<button onclick="window._goPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} style="padding:8px 16px; border-radius:8px; border:1px solid #ddd; background:white; cursor:pointer; font-size:13px; ${currentPage === totalPages ? 'opacity:0.4;' : ''}"><i class="fa-solid fa-chevron-right"></i></button>`;
      paginationEl.innerHTML = html;
    };

    window._goPage = (page) => {
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      fetchProducts();
      window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    // ── Render cards ────────────────────────────────────────────────────────
    const BASE = window.BASE_PATH || '';

    // ── Benefit map: category → solution-selling text (EN + AR) ─────────
    const benefitMap = {
      en: {
        'cat-pumps':        'Keep your pool water clean 24/7',
        'cat-filters':      'Crystal-clear water all season long',
        'cat-chemicals':    'Eliminate green water and bacteria for good',
        'cat-lights':       'Transform your pool into a stunning night experience',
        'cat-heaters':      'Enjoy your pool year-round regardless of weather',
        'cat-cleaners':     'Save all your manual cleaning time',
        'cat-jacuzzi':      'Add a luxury relaxation experience to your home',
        'cat-fittings':     'Install your pool correctly the first time',
        'cat-testing':      'Know your water quality before it becomes a problem',
        'cat-controls':     'Control your entire pool from one place',
        'cat-spareparts':   'Fix pool issues fast and at lower cost',
        'cat-waterfalls':   'Add a premium aesthetic touch to your pool',
        'cat-ladders':      'Safe entry and exit for the whole family',
        'cat-pipeless':     'Complete filtration system without installation complexity',
        'cat-transformers': 'Full protection for your pool equipment from power fluctuations',
        'default':          'Complete solution for your pool'
      },
      ar: {
        'cat-pumps':        'حافظ على نظافة مياه مسبحك على مدار الساعة',
        'cat-filters':      'مياه صافية وخالية من الشوائب طوال الموسم',
        'cat-chemicals':    'تخلص من المياه الخضراء والبكتيريا نهائيًا',
        'cat-lights':       'حوّل مسبحك لتجربة ليلية مذهلة',
        'cat-heaters':      'استمتع بمسبحك طوال العام بغض النظر عن الطقس',
        'cat-cleaners':     'وفّر وقت التنظيف اليدوي بالكامل',
        'cat-jacuzzi':      'أضف تجربة الاسترخاء الفاخرة لمنزلك',
        'cat-fittings':     'ركّب مسبحك بشكل صحيح من أول مرة',
        'cat-testing':      'اعرف حالة مياهك قبل أن تصبح مشكلة',
        'cat-controls':     'تحكم في مسبحك بالكامل من مكان واحد',
        'cat-spareparts':   'أصلح عطل مسبحك بسرعة وبتكلفة أقل',
        'cat-waterfalls':   'أضف لمسة جمالية فاخرة لمسبحك',
        'cat-ladders':      'دخول وخروج آمن لجميع أفراد العائلة',
        'cat-pipeless':     'نظام ترشيح متكامل بدون تعقيدات التركيب',
        'cat-transformers': 'حماية كاملة لمعدات مسبحك من تقلبات الكهرباء',
        'default':          'حل متكامل لمسبحك'
      }
    };

    function getBenefitText(category, lang) {
      const map = benefitMap[lang] || benefitMap['en'];
      return map[category] || map['default'];
    }

    // ── Helper: truncate description to 80 chars ─────────────────────────
    const truncateDesc = (description, maxLen = 80) => {
      if (!description) return '';
      return description.length > maxLen ? description.slice(0, maxLen) + '...' : description;
    };

    // ── Helper: extract 3 benefit bullets from description ───────────────
    const extractBenefits = (description, isAr = false) => {
      const defaults = isAr
        ? ['متوفر الآن', 'جودة عالية', 'مستخدم في المسابح التجارية']
        : ['Available now', 'High quality', 'Used in commercial pools'];
      if (!description || description.trim().length < 10) return defaults;
      const parts = description.split(/[.,،]/).map(s => s.trim()).filter(s => s.length > 5);
      return parts.length >= 3 ? parts.slice(0, 3) : defaults;
    };

    // Expose helpers globally for product detail pages
    window.truncateDesc = truncateDesc;
    window.extractBenefits = extractBenefits;

    const renderCards = (products) => {
      catalogGrid.innerHTML = '';
      const topBarText = document.querySelector('.catalog-top-bar p');
      if (!products || products.length === 0) {
        if (noResultMsg) noResultMsg.style.display = 'block';
        if (topBarText) topBarText.innerText = document.documentElement.lang === 'ar' ? 'عرض 0 منتجات' : 'Showing 0 products';
        renderPagination();
        return;
      }
      if (noResultMsg) noResultMsg.style.display = 'none';
      const isAr = document.documentElement.lang === 'ar';
      const cardsHTML = products.map(product => {
        const productId        = product._id || product.id;
        const productTitle     = product.name || product.title || '';
        const productImage     = (() => {
          const raw = Array.isArray(product.images) ? product.images[0] : (typeof product.images === 'string' ? product.images : null);
          if (!raw) return product.image ? `/${product.image.replace(/^\//, '')}` : `/assets/images/logo.png`;
          if (raw.startsWith('http')) return raw;
          if (raw.startsWith('/uploads') || raw.startsWith('/images')) return 'https://maxpool-production.up.railway.app' + raw;
          return `/${raw.replace(/^\//, '')}`;
        })();
        const productBrandName = product.brandName || product.brand || '';
        const quoteLabel = isAr ? 'أضف إلى السلة' : 'Add to Cart';
        const waLabel    = isAr ? 'تحدث مع خبير' : 'Talk to an Expert';
        return `
          <div class="card product-card mix show-block">
            <div class="card-image-wrap" style="cursor:pointer;" onclick="window.location.href='${BASE}product.html?id=${productId}'">
              <img src="${productImage}" alt="${productTitle}" loading="lazy" style="width:100%; height:100%; object-fit:cover; transition: transform 0.6s ease;">
              <div class="card-badge">${productBrandName}</div>
              <div class="card-overlay"></div>
            </div>
            <div class="card-content">
              <h3 style="cursor:pointer;" onclick="window.location.href='${BASE}product.html?id=${productId}'" onmouseover="this.style.color='#004b87'" onmouseout="this.style.color=''"> ${productTitle} </h3>
              <p>${getBenefitText(product.category, isAr ? 'ar' : 'en')}</p>
              <div class="product-card-actions">
                <button class="btn btn-primary btn-sm add-to-cart-btn" onclick="addToCart('${productId}', '${productTitle.replace(/'/g, "\\'")}')">
                  <i class="fa-solid fa-cart-plus"></i> ${quoteLabel}
                </button>
                <button class="btn btn-outline btn-sm" onclick="handleProductWhatsApp('${productTitle.replace(/'/g, "\\'")}')">
                  <i class="fa-brands fa-whatsapp"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
      catalogGrid.innerHTML = cardsHTML;
      if (topBarText) topBarText.innerText = isAr
        ? `عرض ${products.length} منتج (صفحة ${currentPage} من ${totalPages})`
        : `Showing ${products.length} product${products.length > 1 ? 's' : ''} (page ${currentPage} of ${totalPages})`;
      renderPagination();
    };

    // ── Fetch from API with server-side filtering + pagination ──────────────
    const fetchProducts = () => {
      const _isArLang = document.documentElement.lang === 'ar';
      catalogGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:#888;">
  <i class="fa-solid fa-spinner fa-spin" style="font-size:28px; display:block; margin-bottom:12px;"></i>
  <p style="font-size:14px; margin:0;">${_isArLang ? 'جارٍ تحميل المنتجات...' : 'Loading products...'}</p>
  <p id="retryHint" style="font-size:12px; color:#bbb; margin:6px 0 0;"></p>
</div>`;
      setTimeout(function() {
        var hint = document.getElementById('retryHint');
        if (hint) hint.textContent = _isArLang ? 'السيرفر بيصحى، ثواني...' : 'Server waking up, please wait...';
      }, 5000);
      window.MaxPoolAPI.getProducts({
        limit: PAGE_SIZE, page: currentPage,
        category: currentCategory, brand: currentBrand, search: currentSearch,
      }).then(({ products, pagination }) => {
          if (loader) loader.remove();
          totalPages = (pagination && pagination.pages) ? pagination.pages : 1;
          renderCards(products);
          if (!window._productCache) window._productCache = {};
          products.forEach(p => { if (p.category) window._productCache[p._id || p.id] = p; });
          const cachedAll = Object.values(window._productCache);
          window.renderRelatedProducts(window.getRelatedProducts(currentCategory, cachedAll));
        })
        .catch(() => {
          if (loader) loader.remove();
          const isAr = document.documentElement.lang === 'ar';
          catalogGrid.innerHTML = `<div style="grid-column:1/-1; padding:40px; text-align:center; color:#888;">
            <i class="fa-solid fa-circle-exclamation" style="font-size:32px; margin-bottom:12px; display:block;"></i>
            ${isAr ? 'تعذر تحميل المنتجات. تأكد من تشغيل الخادم.' : 'Could not load products. Make sure the backend server is running.'}
          </div>`;
        });
    };

    fetchProducts();

    if (catBtnGroup) {
      catBtnGroup.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          catBtnGroup.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
          e.target.classList.add('active');
          currentCategory = e.target.getAttribute('data-filter');
          currentPage = 1;
          fetchProducts();
        }
      });
    }

    if (brandBtnGroup) {
      brandBtnGroup.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
          brandBtnGroup.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
          e.target.classList.add('active');
          currentBrand = e.target.getAttribute('data-filter');
          currentPage = 1;
          fetchProducts();
        }
      });
    }

    // Search input listener
    const searchInput = document.getElementById('catalogSearch');
    if (searchInput) {
      let searchTimer;
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          currentSearch = searchInput.value.trim();
          currentPage = 1;
          fetchProducts();
        }, 400);
      });
    }
  }

});
