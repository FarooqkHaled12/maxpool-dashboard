/**
 * WhatsApp Integration Module
 * Handles all WhatsApp-related functionality for Max Pool Egypt
 * 
 * Extracted from main.js for better modularity and maintainability
 */

// ── Central WhatsApp number — updated from API if available ──────────
window.WA_NUMBER = '201006205650';

// ── Central WhatsApp opener — ONE function for all use cases ─────────
window.openWhatsApp = (message) => {
  const number  = window.WA_NUMBER || '201006205650';
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${number}?text=${encoded}`, '_blank', 'noopener,noreferrer');
};

// ── Message builders — one place for all message templates ───────────
window.buildGeneralMessage = () => {
  return document.documentElement.lang === 'ar'
    ? 'مرحباً، أريد الاستفسار عن منتجاتكم'
    : 'Hello, I want to inquire about your swimming pool products';
};

window.buildProductMessage = (productName) => {
  return document.documentElement.lang === 'ar'
    ? `مرحباً، أنا مهتم بـ: ${productName}`
    : `Hi, I'm interested in: ${productName}`;
};

window.buildDetailedProductMessage = (product) => {
  const name     = product.name || product.title || '';
  const category = product.category || '';
  return document.documentElement.lang === 'ar'
    ? `مرحباً ماكس بول،\n\nأريد الاستفسار عن هذا المنتج:\n\nالاسم: ${name}\nالفئة: ${category}\n\nيرجى إرسال السعر والتفاصيل. شكراً.`
    : `Hello Max Pool,\n\nI want to inquire about this product:\n\nName: ${name}\nCategory: ${category}\n\nPlease send me the price and details. Thank you.`;
};

window.buildCartMessage = (cartItems, name, phone) => {
  const isAr      = document.documentElement.lang === 'ar';
  const itemsList = cartItems.map((item, i) => `${i + 1}. ${item.title}`).join('\n');
  return isAr
    ? `مرحباً ماكس بول،\n\nأرغب في طلب عرض سعر للمنتجات التالية:\n\n${itemsList}\n\nاسم العميل: ${name}\nالهاتف: ${phone}\n\nيرجى التواصل معي بالأسعار والتوافر. شكراً.`
    : `Hello Max Pool,\n\nI would like to request a quotation for the following products:\n\n${itemsList}\n\nClient Name: ${name}\nPhone: ${phone}\n\nPlease contact me with pricing and availability. Thank you.`;
};

// ── Product card WhatsApp handler — called from rendered card HTML ────
window.handleProductWhatsApp = (productName) => {
  if (typeof window.trackWhatsAppLead === 'function') {
    window.trackWhatsAppLead('product', { message: productName });
  }
  window.openWhatsApp(window.buildProductMessage(productName));
};

// ── Product detail page WhatsApp handler ─────────────────────────────
window.initProductWhatsApp = (product) => {
  const btn = document.getElementById('productWhatsAppBtn');
  if (!btn || btn.dataset.waInit) return; // guard against double-init
  btn.dataset.waInit = '1';
  btn.onclick = () => {
    if (typeof window.trackWhatsAppLead === 'function') {
      window.trackWhatsAppLead('product_detail', {
        message:   product.name || product.title || '',
        productId: product._id  || product.id,
      });
    }
    window.openWhatsApp(window.buildDetailedProductMessage(product));
  };
};