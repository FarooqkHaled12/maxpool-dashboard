/**
 * layout.js — Max Pool Centralized Layout Injection
 * CREATE: New file. No prior version existed.
 *
 * Single source of truth for navbar and footer across all pages.
 * Path-aware: works from root (/), /ar/, /blog/, /pricing/ directories.
 *
 * Usage in HTML — replace the hardcoded <nav> and <footer> blocks with:
 *   <div id="navbar-placeholder"></div>
 *   <div id="footer-placeholder"></div>
 *   <script src="[path-to-root]/js/layout.js"></script>
 *
 * The script auto-detects the base path and language from the current URL.
 */
(function () {
  'use strict';

  // ── Path & language detection ─────────────────────────────────────────
  var path  = window.location.pathname;
  var BASE  = (path.includes('/ar/') || path.includes('/blog/') || path.includes('/pricing/')) ? '../' : '';
  var IS_AR = path.includes('/ar/');

  // ── Active page detection ─────────────────────────────────────────────
  var activePage = (path.split('/').pop().replace('.html', '') || 'index');
  if (activePage === '') activePage = 'index';

  // ── Nav link builder ──────────────────────────────────────────────────
  function navLink(href, icon, labelEn, labelAr, pageKey) {
    var label  = IS_AR ? labelAr : labelEn;
    var active = (activePage === pageKey) ? ' class="active"' : '';
    return '<a href="' + BASE + href + '"' + active + '>'
      + '<i class="fa-solid ' + icon + '" aria-hidden="true"></i>'
      + '<span>' + label + '</span>'
      + '</a>';
  }

  // ── Language toggle ───────────────────────────────────────────────────
  function langToggle() {
    var file = path.split('/').pop() || 'index.html';
    if (!file || file === '/') file = 'index.html';
    if (IS_AR) {
      return '<a href="../' + file + '" style="font-size:12px;opacity:0.7;border:1px solid currentColor;padding:3px 8px;border-radius:12px;" aria-label="Switch to English">EN</a>';
    }
    return '<a href="ar/' + file + '" style="font-size:12px;opacity:0.7;border:1px solid currentColor;padding:3px 8px;border-radius:12px;" aria-label="التبديل إلى العربية">AR</a>';
  }

  // ── NAVBAR ────────────────────────────────────────────────────────────
  function buildNavbar() {
    var ariaLabel = IS_AR ? 'التنقل الرئيسي' : 'Main Navigation';
    var toggleLabel = IS_AR ? 'فتح القائمة' : 'Toggle Navigation';
    return '<nav class="navbar" role="navigation" aria-label="' + ariaLabel + '">'
      + '<div class="container navbar-inner">'
      + '<a href="' + BASE + (IS_AR ? 'ar/index.html' : 'index.html') + '" class="navbar-brand" style="display:flex;align-items:center;" aria-label="Max Pool Home">'
      + '<img src="' + BASE + 'assets/images/logo.png" alt="Max Pool Logo" style="height:48px;object-fit:contain;" width="48" height="48">'
      + '</a>'
      + '<div class="navbar-links" id="navbar-links-menu" role="menubar">'
      + navLink(IS_AR ? 'ar/index.html'    : 'index.html',    'fa-house',      'Home',      'الرئيسية',   'index')
      + navLink(IS_AR ? 'ar/products.html' : 'products.html', 'fa-cube',        'Equipment', 'المعدات',    'products')
      + navLink(IS_AR ? 'ar/services.html' : 'services.html', 'fa-wrench',      'Services',  'الخدمات',    'services')
      + navLink(IS_AR ? 'ar/about.html'    : 'about.html',    'fa-circle-info', 'About Us',  'من نحن',     'about')
      + navLink(IS_AR ? 'ar/contact.html'  : 'contact.html',  'fa-envelope',    'Contact',   'تواصل معنا', 'contact')
      + langToggle()
      + '</div>'
      + '<button class="navbar-toggle" aria-label="' + toggleLabel + '" aria-expanded="false" aria-controls="navbar-links-menu">'
      + '<span></span><span></span><span></span>'
      + '</button>'
      + '</div>'
      + '</nav>';
  }

  // ── FOOTER ────────────────────────────────────────────────────────────
  function buildFooter() {
    if (IS_AR) {
      return '<footer class="footer" role="contentinfo">'
        + '<div class="container footer-inner">'
        + '<div class="footer-brand">'
        + '<img src="' + BASE + 'assets/images/logo.png" alt="شعار ماكس بول" style="height:60px;margin-bottom:16px;object-fit:contain;" width="60" height="60" loading="lazy">'
        + '<p>بنية تحتية متميزة للمسابح، معدات ومواد كيميائية وفق أعلى المعايير الأوروبية.</p>'
        + '</div>'
        + '<div class="footer-links"><h4>شركتنا</h4>'
        + '<a href="' + BASE + 'ar/index.html">الرئيسية</a>'
        + '<a href="' + BASE + 'ar/products.html">كتالوج المعدات</a>'
        + '<a href="' + BASE + 'ar/services.html">الخدمات</a>'
        + '<a href="' + BASE + 'ar/about.html">من نحن</a>'
        + '<a href="' + BASE + 'ar/contact.html">تواصل معنا</a>'
        + '</div>'
        + '<div class="footer-links"><h4>المدونة</h4>'
        + '<a href="' + BASE + 'blog/green-pool-water.html">علاج المياه الخضراء</a>'
        + '<a href="' + BASE + 'blog/cloudy-pool-water.html">علاج المياه العكرة</a>'
        + '<a href="' + BASE + 'blog/how-to-clean-pool.html">كيفية تنظيف المسبح</a>'
        + '<a href="' + BASE + 'blog/pool-pump-not-working.html">إصلاح طلمبة المسبح</a>'
        + '</div>'
        + '<div class="footer-links"><h4>أدلة الأسعار</h4>'
        + '<a href="' + BASE + 'pricing/pool-pump-price.html">سعر طلمبة حمام سباحة</a>'
        + '<a href="' + BASE + 'pricing/pool-maintenance-cost.html">تكلفة صيانة المسبح</a>'
        + '<a href="' + BASE + 'pricing/pool-construction-cost.html">تكلفة إنشاء حمام سباحة</a>'
        + '</div>'
        + '<div class="footer-contact"><h4>معلومات التواصل</h4>'
        + '<p><i class="fa-solid fa-phone" aria-hidden="true"></i> <a href="tel:01006205650" style="color:inherit;text-decoration:none;">0100 620 5650</a></p>'
        + '<p><i class="fa-solid fa-globe" aria-hidden="true"></i> www.max-pool-eg.com</p>'
        + '<div class="social-links"><a href="https://www.facebook.com/maxpoool" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook" aria-hidden="true"></i> @maxpool</a></div>'
        + '</div>'
        + '</div>'
        + '<div class="container footer-bottom"><p>&copy; 2026 ماكس بول. جميع الحقوق محفوظة. &nbsp;·&nbsp; <a href="https://wa.me/201006205650?text=Hi%2C%20I%20saw%20your%20work%20on%20Max%20Pool%20website%20and%20I%27m%20interested%20in%20a%20similar%20system" target="_blank" rel="noopener" style="color:inherit;opacity:0.6;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:1px;" onmouseover="this.style.opacity=\'1\'" onmouseout="this.style.opacity=\'0.6\'">Farooq</a> &mdash; Lead Systems &amp; Web Dev</p></div>'
        + '</footer>';
    }

    // English footer
    return '<footer class="footer" role="contentinfo">'
      + '<div class="container footer-inner">'
      + '<div class="footer-brand">'
      + '<img src="' + BASE + 'assets/images/logo.png" alt="Max Pool Logo" style="height:60px;margin-bottom:16px;object-fit:contain;" width="60" height="60" loading="lazy">'
      + '<p>Premium pool infrastructure, equipment, and chemical treatments meeting the highest European Standards.</p>'
      + '</div>'
      + '<div class="footer-links"><h4>Our Company</h4>'
      + '<a href="' + BASE + 'index.html">Home</a>'
      + '<a href="' + BASE + 'products.html">Equipment Catalog</a>'
      + '<a href="' + BASE + 'services.html">Services</a>'
      + '<a href="' + BASE + 'about.html">About Us</a>'
      + '<a href="' + BASE + 'contact.html">Contact Us</a>'
      + '<a href="' + BASE + 'ar/index.html" style="opacity:0.6;font-size:12px;">🇪🇬 النسخة العربية</a>'
      + '</div>'
      + '<div class="footer-links"><h4>Pool Blog</h4>'
      + '<a href="' + BASE + 'blog/green-pool-water.html">Green Pool Water</a>'
      + '<a href="' + BASE + 'blog/cloudy-pool-water.html">Cloudy Pool Water</a>'
      + '<a href="' + BASE + 'blog/how-to-clean-pool.html">How to Clean a Pool</a>'
      + '<a href="' + BASE + 'blog/pool-pump-not-working.html">Pool Pump Not Working</a>'
      + '</div>'
      + '<div class="footer-links"><h4>Pricing Guides</h4>'
      + '<a href="' + BASE + 'pricing/pool-pump-price.html">Pool Pump Price Egypt</a>'
      + '<a href="' + BASE + 'pricing/pool-maintenance-cost.html">Pool Maintenance Cost</a>'
      + '<a href="' + BASE + 'pricing/pool-construction-cost.html">Pool Construction Cost</a>'
      + '</div>'
      + '<div class="footer-contact"><h4>Contact Information</h4>'
      + '<p><i class="fa-solid fa-globe" aria-hidden="true"></i> www.max-pool-eg.com</p>'
      + '<p><i class="fa-solid fa-phone" aria-hidden="true"></i> <a href="tel:01006205650" style="color:inherit;text-decoration:none;">0100 620 5650</a></p>'
      + '<div class="social-links"><a href="https://www.facebook.com/maxpoool" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i class="fa-brands fa-facebook" aria-hidden="true"></i> @maxpool2019</a></div>'
      + '</div>'
      + '</div>'
      + '<div class="container footer-bottom"><p>&copy; 2026 Max Pool. All rights reserved. &nbsp;·&nbsp; Built by <a href="https://wa.me/201006205650?text=Hi%2C%20I%20saw%20your%20work%20on%20Max%20Pool%20website%20and%20I%27m%20interested%20in%20a%20similar%20system" target="_blank" rel="noopener" style="color:inherit;opacity:0.6;text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.2);padding-bottom:1px;" onmouseover="this.style.opacity=\'1\'" onmouseout="this.style.opacity=\'0.6\'">Farooq</a> &mdash; Lead Systems &amp; Web Dev</p></div>'
      + '</footer>';
  }

  // ── Injection ─────────────────────────────────────────────────────────
  function inject() {
    // Apply lang/dir to <html> if not set
    var html = document.documentElement;
    if (!html.getAttribute('lang')) {
      html.setAttribute('lang', IS_AR ? 'ar' : 'en');
      html.setAttribute('dir',  IS_AR ? 'rtl' : 'ltr');
    }

    var navEl    = document.getElementById('navbar-placeholder');
    var footerEl = document.getElementById('footer-placeholder');

    if (navEl)    navEl.outerHTML    = buildNavbar();
    if (footerEl) footerEl.outerHTML = buildFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
