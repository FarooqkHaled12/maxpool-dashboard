document.addEventListener('DOMContentLoaded', () => {

  // ── Load site settings from API and apply dynamic content ──────────────
  const _base = (typeof API_BASE !== 'undefined') ? API_BASE : 'http://localhost:5001';
  const _isAr = window.location.pathname.includes('/ar/');
  fetch(`${_base}/api/settings`)
    .then(r => r.json())
    .then(({ data: s }) => {
      if (!s) return;
      // Phone number
      if (s.phone) {
        document.querySelectorAll('a[href^="tel:"]').forEach(a => { a.href = `tel:${s.phone}`; if (!a.querySelector('i')) a.textContent = s.phone; });
        document.querySelectorAll('.footer-contact p').forEach(p => {
          if (p.innerHTML.includes('fa-phone')) p.innerHTML = `<i class="fa-solid fa-phone"></i> ${s.phone}`;
        });
      }
      // WhatsApp
      if (s.whatsapp) {
        document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
          a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${s.whatsapp}`);
        });
      }
      // Facebook
      if (s.facebook_url) {
        document.querySelectorAll('a[href*="facebook.com"]').forEach(a => { a.href = s.facebook_url; });
      }
      // Hero title & subtitle
      const heroTitle = document.querySelector('.hero-title');
      const heroSub   = document.querySelector('.hero-subtitle');
      if (heroTitle) {
        const txt = _isAr ? s.hero_title_ar : s.hero_title_en;
        if (txt) heroTitle.innerHTML = txt;
      }
      if (heroSub) {
        const txt = _isAr ? s.hero_sub_ar : s.hero_sub_en;
        if (txt) heroSub.textContent = txt;
      }
    })
    .catch(() => {}); // Fail silently — hardcoded fallbacks remain

  // --- LANGUAGE TOGGLE (EN / AR) in Navbar ---
  const langBtn = document.createElement('button');
  langBtn.id = 'langToggleBtn';
  langBtn.setAttribute('aria-label', 'Toggle language');
  langBtn.style.cssText = `
    background: transparent;
    border: 1.5px solid #004b87;
    color: #004b87;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 6px 14px;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    margin-left: 12px;
    flex-shrink: 0;
  `;
  // Detect if we're in the /ar/ subfolder
  const isArabicPage = window.location.pathname.includes('/ar/');
  langBtn.innerHTML = `<i class="fa-solid fa-globe" style="margin-right:6px; font-size:12px;"></i><span id="langLabel">${isArabicPage ? 'EN' : 'AR'}</span>`;
  langBtn.onmouseover = () => { langBtn.style.background = '#004b87'; langBtn.style.color = 'white'; };
  langBtn.onmouseout  = () => { langBtn.style.background = 'transparent'; langBtn.style.color = '#004b87'; };

  const navbarInner = document.querySelector('.navbar-inner');
  if (navbarInner) navbarInner.appendChild(langBtn);

  langBtn.addEventListener('click', () => {
    const currentFile = window.location.pathname.split('/').pop() || 'index.html';
    const page = currentFile === '' ? 'index.html' : currentFile;
    if (isArabicPage) {
      // Go back to English version (one level up)
      window.location.href = '../' + page;
    } else {
      // Go to Arabic version
      window.location.href = 'ar/' + page;
    }
  });

  // --- FLOATING WHATSAPP WIDGET ---
  const waBtn = document.createElement('a');
  waBtn.href = "https://wa.me/201006205650";
  waBtn.target = "_blank";
  waBtn.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
  waBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 30px;
    background-color: #25D366;
    color: white;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36px;
    box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
    z-index: 9999;
    text-decoration: none;
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  `;
  waBtn.onmouseover = () => waBtn.style.transform = 'scale(1.15)';
  waBtn.onmouseout = () => waBtn.style.transform = 'scale(1)';
  document.body.appendChild(waBtn);

  // Mobile Navigation Toggle
  const navToggle = document.querySelector('.navbar-toggle');
  const navLinks = document.querySelector('.navbar-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
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
        position: fixed; bottom: 100px; left: 30px; background: #004b87; color: white;
        border-radius: 50%; width: 60px; height: 60px; display: flex; justify-content: center;
        align-items: center; font-size: 24px; box-shadow: 0 4px 15px rgba(0,75,135,0.4);
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
        const isArLang = document.documentElement.lang === 'ar';
        const msg = isArLang
          ? `مرحباً ماكس بول,%0A%0Aأرغب في طلب عرض سعر للمنتجات التالية:%0A%0A${itemsList}%0A%0Aاسم العميل: ${encodeURIComponent(name)}%0Aالهاتف: ${encodeURIComponent(phone)}%0A%0Aيرجى التواصل معي بالأسعار والتوافر. شكراً.`
          : `Hello Max Pool,%0A%0AI would like to request a quotation for the following products:%0A%0A${itemsList}%0A%0AClient Name: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}%0A%0APlease contact me with pricing and availability. Thank you.`;
        const waUrl = `https://wa.me/201006205650?text=${msg}`;

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
            <body onload="setTimeout(()=>window.print(), 500)">
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
        fetch(`${API_BASE}/api/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, items })
        }).catch(() => {});

        window.open(waUrl, '_blank');
        window.cartItems = [];
        updateCartUI();
        document.getElementById('cartModal').style.display = 'none';
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
      products.forEach(product => {
        const productId        = product._id || product.id;
        const productTitle     = product.name || product.title || '';
        const productDesc      = product.description || '';
        const productImage     = (product.images && product.images[0])
          ? (product.images[0].startsWith('http')
              ? product.images[0]
              : product.images[0].startsWith('/uploads')
                ? `${API_BASE}${product.images[0]}`
                : `/${product.images[0].replace(/^\//, '')}`)
          : (product.image ? `/${product.image.replace(/^\//, '')}` : `/assets/images/logo.png`);
        const productBrandName = product.brandName || product.brand || '';
        const addLabel = isAr ? 'أضف للعرض' : 'Add to Quote';
        catalogGrid.innerHTML += `
          <div class="card product-card mix show-block">
            <div class="card-image-wrap" style="cursor:pointer;" onclick="window.location.href='${BASE}product.html?id=${productId}'">
              <img src="${productImage}" alt="${productTitle}" loading="lazy" style="width:100%; height:100%; object-fit:cover; transition: transform 0.6s ease;">
              <div class="card-badge">${productBrandName}</div>
              <div class="card-overlay"></div>
            </div>
            <div class="card-content">
              <h3 style="cursor:pointer;" onclick="window.location.href='${BASE}product.html?id=${productId}'" onmouseover="this.style.color='#004b87'" onmouseout="this.style.color=''"> ${productTitle} </h3>
              <p>${productDesc}</p>
              <button class="btn btn-primary btn-sm add-to-cart-btn" onclick="addToCart('${productId}', '${productTitle.replace(/'/g, "\\'")}')" style="width:100%; margin-top:auto; display:flex; justify-content:center; align-items:center; gap:6px; padding:10px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                <i class="fa-solid fa-cart-plus"></i> ${addLabel}
              </button>
            </div>
          </div>
        `;
      });
      if (topBarText) topBarText.innerText = isAr
        ? `عرض ${products.length} منتج (صفحة ${currentPage} من ${totalPages})`
        : `Showing ${products.length} product${products.length > 1 ? 's' : ''} (page ${currentPage} of ${totalPages})`;
      renderPagination();
    };

    // ── Fetch from API with server-side filtering + pagination ──────────────
    const fetchProducts = () => {
      catalogGrid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:40px; color:#888;"><i class="fa-solid fa-spinner fa-spin" style="font-size:24px;"></i></div>`;
      const params = new URLSearchParams({ limit: PAGE_SIZE, page: currentPage });
      // data-filter now sends the slug directly (e.g. "cat-pumps") or "all"
      if (currentCategory !== 'all') params.set('category', currentCategory);
      if (currentBrand    !== 'all') params.set('brand',    currentBrand);
      if (currentSearch) params.set('search', currentSearch);
      fetch(`${API_BASE}/api/products?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          if (loader) loader.remove();
          const products = Array.isArray(data) ? data : (data.products || data.data || []);
          totalPages = (data.pagination && data.pagination.pages) ? data.pagination.pages : 1;
          renderCards(products);
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
