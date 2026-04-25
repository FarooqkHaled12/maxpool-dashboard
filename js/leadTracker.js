/**
 * leadTracker.js — Max Pool Lead Tracking Module
 *
 * Captures Real Leads (Intent + Identity) only:
 *   - WhatsApp button clicks
 *   - Contact form submissions
 *   - Cart quotation submissions
 *
 * All tracking is fire-and-forget — never blocks UX.
 * Load this script after js/main.js on pages that need lead tracking.
 */
(function () {
  'use strict';

  // Resolve API base URL from config or fallback
  function _apiBase() {
    if (typeof window.API_BASE !== 'undefined' && window.API_BASE) return window.API_BASE;
    if (typeof API_BASE !== 'undefined' && API_BASE) return API_BASE;
    return 'https://maxpool-production.up.railway.app';
  }

  /**
   * window.trackLead(data)
   * Central function — sends POST /api/leads, appends current page URL.
   * Requires data.name and data.phone to be non-empty.
   * Fails silently on any error.
   */
  window.trackLead = function (data) {
    if (!data || !data.name || !data.phone) return;
    var payload = Object.assign({}, data, { page: window.location.href });
    window.MaxPoolAPI.postLead(payload);
  };

  /**
   * window.trackWhatsAppLead(type, context)
   * Maps WhatsApp button type to source enum value, then calls trackLead.
   *
   * type values:
   *   'float'          → source: 'whatsapp_float'
   *   'product'        → source: 'whatsapp_product'
   *   'product_detail' → source: 'whatsapp_product'
   *   'cart'           → source: 'whatsapp_cart'
   *   anything else    → source: 'whatsapp'
   *
   * context: optional object with extra fields (message, productId, etc.)
   * Uses placeholder identity: name='WhatsApp Visitor', phone='via-whatsapp'
   */
  window.trackWhatsAppLead = function (type, context) {
    var sourceMap = {
      'float':          'whatsapp_float',
      'product':        'whatsapp_product',
      'product_detail': 'whatsapp_product',
      'cart':           'whatsapp_cart',
    };
    var source = sourceMap[type] || 'whatsapp';
    var base   = { name: 'WhatsApp Visitor', phone: 'via-whatsapp', source: source };
    window.trackLead(Object.assign(base, context || {}));
  };

  /**
   * window.trackContactLead(data)
   * Tracks a contact form submission.
   * data must include name and phone (real user identity).
   */
  window.trackContactLead = function (data) {
    window.trackLead(Object.assign({ source: 'contact_form' }, data));
  };

  /**
   * window.trackCartLead(items, name, phone)
   * Tracks a cart quotation submission.
   * items: array of { title } objects
   * name, phone: real user identity from checkout form
   */
  window.trackCartLead = function (items, name, phone) {
    var message = (items || []).map(function (item, i) {
      return (i + 1) + '. ' + (item.title || '');
    }).join('\n');
    window.trackLead({
      source:  'cart_submission',
      name:    name,
      phone:   phone,
      message: message,
    });
  };

})();
