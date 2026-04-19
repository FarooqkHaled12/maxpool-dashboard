/**
 * Max Pool — Dynamic Page Loader
 * Fetches page data from API and applies it to the HTML.
 * Handles: SEO meta tags, section content, settings.
 */
(function () {
  'use strict';

  const API   = (typeof API_BASE !== 'undefined') ? API_BASE : 'http://localhost:5001';
  const IS_AR = window.location.pathname.includes('/ar/');

  function getSlug() {
    const file = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    const map  = { 'index': 'home', '': 'home', 'home': 'home', 'about': 'about', 'services': 'services', 'contact': 'contact' };
    return map[file] || file;
  }

  function applySEO(page) {
    const title = IS_AR ? (page.metaTitleAr || page.titleAr) : (page.metaTitle || page.title);
    const desc  = IS_AR ? page.metaDescAr : page.metaDesc;
    if (title) document.title = title;
    if (desc) {
      let m = document.querySelector('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
      m.content = desc;
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc  = document.querySelector('meta[property="og:description"]');
    const ogImg   = document.querySelector('meta[property="og:image"]');
    if (ogTitle && title) ogTitle.content = title;
    if (ogDesc  && desc)  ogDesc.content  = desc;
    if (ogImg   && page.ogImage) ogImg.content = page.ogImage;
  }

  function t(c, enKey, arKey) {
    return IS_AR ? (c[arKey] || c[enKey] || '') : (c[enKey] || '');
  }

  function applySection(s) {
    const c = s.content;
    if (!c) return;

    switch (s.type) {
      case 'hero': {
        const badge = document.querySelector('.hero-badge span, [data-i18n="home.badge"]');
        const title = document.querySelector('.hero-title, [data-i18n="home.hero.title"]');
        const sub   = document.querySelector('.hero-subtitle, [data-i18n="home.hero.sub"]');
        const btn1  = document.querySelector('[data-i18n="home.hero.btn1"]');
        const btn2  = document.querySelector('[data-i18n="home.hero.btn2"]');
        if (badge) badge.textContent = t(c, 'badge', 'badgeAr');
        if (title) title.innerHTML   = t(c, 'title', 'titleAr');
        if (sub)   sub.textContent   = t(c, 'subtitle', 'subtitleAr');
        if (btn1)  btn1.textContent  = t(c, 'btn1Text', 'btn1TextAr');
        if (btn2)  btn2.textContent  = t(c, 'btn2Text', 'btn2TextAr');
        break;
      }
      case 'features': {
        const h = document.querySelector('[data-i18n="home.features.title"]');
        const p = document.querySelector('[data-i18n="home.features.sub"]');
        if (h) h.textContent = t(c, 'title', 'titleAr');
        if (p) p.textContent = t(c, 'subtitle', 'subtitleAr');
        if (c.items) c.items.forEach((item, i) => {
          const h3 = document.querySelector(`[data-i18n="home.f${i+1}.title"]`);
          const p2 = document.querySelector(`[data-i18n="home.f${i+1}.text"]`);
          if (h3) h3.textContent = t(item, 'title', 'titleAr');
          if (p2) p2.textContent = t(item, 'text',  'textAr');
        });
        break;
      }
      case 'cta': {
        const h2  = document.querySelector('[data-i18n="home.cta.title"],[data-i18n="about.cta.title"]');
        const btn = document.querySelector('[data-i18n="home.cta.btn"],[data-i18n="about.cta.btn"]');
        if (h2)  h2.textContent  = t(c, 'title',   'titleAr');
        if (btn) btn.textContent = t(c, 'btnText', 'btnTextAr');
        break;
      }
      case 'about_hero': {
        const ey = document.querySelector('[data-i18n="about.hero.eyebrow"]');
        const ti = document.querySelector('[data-i18n="about.hero.title"] span,[data-i18n="about.hero.title"]');
        const su = document.querySelector('[data-i18n="about.hero.sub"]');
        if (ey) ey.textContent = t(c, 'eyebrow', 'eyebrowAr');
        if (ti) ti.innerHTML   = t(c, 'title',   'titleAr');
        if (su) su.textContent = t(c, 'subtitle','subtitleAr');
        if (c.stats) c.stats.forEach((stat, i) => {
          const el = document.querySelector(`[data-i18n="about.stat${i+1}.label"]`);
          if (el) el.textContent = t(stat, 'label', 'labelAr');
        });
        break;
      }
      case 'values': {
        const ey = document.querySelector('[data-i18n="about.values.eyebrow"]');
        const ti = document.querySelector('[data-i18n="about.values.title"]');
        if (ey) ey.textContent = t(c, 'eyebrow', 'eyebrowAr');
        if (ti) ti.textContent = t(c, 'title',   'titleAr');
        if (c.items) c.items.forEach((item, i) => {
          const h4 = document.querySelector(`[data-i18n="about.val${i+1}.title"]`);
          const p  = document.querySelector(`[data-i18n="about.val${i+1}.text"]`);
          if (h4) h4.textContent = t(item, 'title', 'titleAr');
          if (p)  p.textContent  = t(item, 'text',  'textAr');
        });
        break;
      }
      case 'services_hero': {
        const ey = document.querySelector('[data-i18n="services.hero.eyebrow"]');
        const ti = document.querySelector('[data-i18n="services.hero.title"]');
        const su = document.querySelector('[data-i18n="services.hero.sub"]');
        if (ey) ey.textContent = t(c, 'eyebrow',  'eyebrowAr');
        if (ti) ti.textContent = t(c, 'title',    'titleAr');
        if (su) su.textContent = t(c, 'subtitle', 'subtitleAr');
        break;
      }
      case 'contact_hero': {
        const ti = document.querySelector('[data-i18n="contact.hero.title"],.hero-title');
        const su = document.querySelector('[data-i18n="contact.hero.sub"],.hero-subtitle');
        if (ti) ti.textContent = t(c, 'title',    'titleAr');
        if (su) su.textContent = t(c, 'subtitle', 'subtitleAr');
        break;
      }
      case 'contact_info': {
        if (c.phone) {
          document.querySelectorAll('a[href^="tel:"]').forEach(a => {
            a.href = `tel:${c.phone}`;
            if (!a.querySelector('i')) a.textContent = c.phone;
          });
        }
        if (c.whatsapp) {
          document.querySelectorAll('a[href*="wa.me"]').forEach(a => {
            a.href = a.href.replace(/wa\.me\/\d+/, `wa.me/${c.whatsapp}`);
          });
        }
        break;
      }
    }
  }

  async function loadPage() {
    const slug = getSlug();
    if (!['home', 'about', 'services', 'contact'].includes(slug)) return;
    try {
      const res  = await fetch(`${API}/api/pages/slug/${slug}`);
      const data = await res.json();
      if (!data.success || !data.data) return;
      const page = data.data;
      applySEO(page);
      if (page.sections) {
        page.sections
          .filter(s => s.visible !== false)
          .sort((a, b) => a.order - b.order)
          .forEach(applySection);
      }
    } catch (_) { /* fail silently — hardcoded HTML is the fallback */ }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadPage);
  } else {
    loadPage();
  }
})();
