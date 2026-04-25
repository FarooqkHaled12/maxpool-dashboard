/**
 * api.js — Max Pool Centralized API Layer
 *
 * Single source of truth for ALL backend communication.
 * Every fetch call in the project goes through this file.
 *
 * Rules:
 *   - No DOM manipulation here
 *   - No UI logic here
 *   - All functions return Promises
 *   - All functions fail silently (catch returns null)
 *   - Timeout: 8s mutations, 6s settings, none for products
 */

(function () {
  'use strict';

  var BASE = (typeof API_BASE !== 'undefined')
    ? API_BASE
    : 'https://maxpool-production.up.railway.app';

  // ── In-memory cache (5 min TTL) ───────────────────────────────────────────
  var _cache = {};
  var CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  function _getCached(key) {
    var entry = _cache[key];
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL) { delete _cache[key]; return null; }
    return entry.value;
  }

  function _setCached(key, value) {
    _cache[key] = { value: value, ts: Date.now() };
  }

  // ── Internal helper ───────────────────────────────────────────────────────
  function _fetch(url, options, timeoutMs) {
    var controller = new AbortController();
    var timer = timeoutMs ? setTimeout(function () { controller.abort(); }, timeoutMs) : null;
    var opts = Object.assign({}, options || {}, { signal: controller.signal });
    return fetch(url, opts)
      .then(function (res) {
        if (timer) clearTimeout(timer);
        return res.json();
      })
      .catch(function () {
        if (timer) clearTimeout(timer);
        return null;
      });
  }

  // ── Retry wrapper (handles Railway cold start delays) ─────────────────────
  /**
   * Wraps _fetch with automatic retry on null/failed responses.
   * @param {string} url
   * @param {object} options
   * @param {number} timeoutMs - per-attempt timeout
   * @param {number} retries - max attempts (default 3)
   * @param {number} delayMs - delay between attempts in ms (default 3000)
   */
  function _fetchWithRetry(url, options, timeoutMs, retries, delayMs) {
    retries  = retries  !== undefined ? retries  : 3;
    delayMs  = delayMs  !== undefined ? delayMs  : 3000;
    return _fetch(url, options, timeoutMs).then(function (data) {
      if (data !== null) return data;
      if (retries <= 1) return null;
      return new Promise(function (resolve) {
        setTimeout(function () {
          resolve(_fetchWithRetry(url, options, timeoutMs, retries - 1, delayMs));
        }, delayMs);
      });
    });
  }

  // ── GET /api/settings ─────────────────────────────────────────────────────
  /**
   * Fetch site-wide settings (phone, whatsapp, facebook, hero text).
   * @returns {Promise<object|null>}
   */
  function getSettings() {
    var cached = _getCached('settings');
    if (cached) return Promise.resolve(cached);
    return _fetch(BASE + '/api/settings', {}, 6000)
      .then(function (data) {
        var result = (data && data.data) ? data.data : null;
        if (result) _setCached('settings', result);
        return result;
      });
  }

  // ── GET /api/products ─────────────────────────────────────────────────────
  /**
   * Fetch paginated + filtered product catalog.
   * @param {{ category?, brand?, search?, page?, limit? }} params
   * @returns {Promise<{ products: Array, pagination: object }>}
   */
  function getProducts(params) {
    var qs = new URLSearchParams();
    if (params) {
      if (params.limit)                              qs.set('limit',    params.limit);
      if (params.page)                               qs.set('page',     params.page);
      if (params.category && params.category !== 'all') qs.set('category', params.category);
      if (params.brand    && params.brand    !== 'all') qs.set('brand',    params.brand);
      if (params.search)                             qs.set('search',   params.search);
    }
    return _fetchWithRetry(BASE + '/api/products?' + qs.toString(), {}, 25000)
      .then(function (data) {
        if (!data) return { products: [], pagination: { pages: 1 } };
        return {
          products:   Array.isArray(data) ? data : (data.products || data.data || []),
          pagination: (data && data.pagination) ? data.pagination : { pages: 1 },
        };
      });
  }

  // ── GET /api/products/id/:id ──────────────────────────────────────────────
  /**
   * Fetch a single product by MongoDB ID.
   * @param {string} id
   * @returns {Promise<object|null>}
   */
  function getProductById(id) {
    return _fetchWithRetry(BASE + '/api/products/id/' + id, {}, 25000)
      .then(function (data) {
        if (!data) return null;
        return data.data || data;
      });
  }

  // ── GET /api/pages/slug/:slug ─────────────────────────────────────────────
  /**
   * Fetch CMS page data by slug (home, about, services, contact).
   * @param {string} slug
   * @returns {Promise<object|null>}
   */
  function getPage(slug) {
    var cacheKey = 'page_' + slug;
    var cached = _getCached(cacheKey);
    if (cached) return Promise.resolve(cached);
    return _fetch(BASE + '/api/pages/slug/' + slug)
      .then(function (data) {
        if (!data || !data.success || !data.data) return null;
        _setCached(cacheKey, data.data);
        return data.data;
      });
  }

  // ── GET /api/settings/pricing ─────────────────────────────────────────────
  /**
   * Fetch construction pricing data from settings.
   * @returns {Promise<object|null>}
   */
  function getPricing() {
    var cached = _getCached('pricing');
    if (cached) return Promise.resolve(cached);
    return _fetch(BASE + '/api/settings', {}, 6000)
      .then(function (data) {
        if (!data || !data.data) return null;
        var settings = data.data;
        var result = {};
        settings.forEach(function(s) {
          if (s.key && s.key.startsWith('price_')) result[s.key] = s.value;
        });
        if (Object.keys(result).length > 0) _setCached('pricing', result);
        return result;
      });
  }

  // ── POST /api/orders ──────────────────────────────────────────────────────
  /**
   * Submit a cart quotation order. Fire-and-forget.
   * @param {{ name: string, phone: string, items: Array }} payload
   * @returns {Promise<void>}
   */
  function postOrder(payload) {
    return _fetch(BASE + '/api/orders', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    }, 8000);
  }

  // ── POST /api/leads ───────────────────────────────────────────────────────
  /**
   * Submit a lead (WhatsApp click, quick inquiry). Fire-and-forget.
   * @param {{ name: string, phone: string, source: string, message?: string }} payload
   * @returns {Promise<void>}
   */
  function postLead(payload) {
    return _fetch(BASE + '/api/leads', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    }, 8000);
  }

  // ── POST /api/messages ────────────────────────────────────────────────────
  /**
   * Submit a contact form message. Fire-and-forget.
   * @param {{ name: string, phone: string, email?: string, message: string }} payload
   * @returns {Promise<void>}
   */
  function postMessage(payload) {
    return _fetch(BASE + '/api/messages', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    }, 8000);
  }

  // ── GET /api/settings/construction_pricing ────────────────────────────────
  function getConstructionPricing() {
    return _fetch(BASE + '/api/settings', {}, 6000)
      .then(function (data) {
        var list = (data && data.data) ? data.data : [];
        var entry = list.find(function(s) { return s.key === 'construction_pricing'; });
        if (!entry || !entry.value) return null;
        try { return JSON.parse(entry.value); } catch { return null; }
      });
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.MaxPoolAPI = {
    getSettings:    getSettings,
    getProducts:    getProducts,
    getProductById: getProductById,
    getPage:        getPage,
    postOrder:      postOrder,
    postLead:       postLead,
    postMessage:             postMessage,
    getPricing:              getPricing,
    getConstructionPricing:  getConstructionPricing,
  };

})();
