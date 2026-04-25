/**
 * contact.js — Max Pool Contact Form Handler
 *
 * Handles contact form submission, validation, API call, and lead tracking.
 * Moved from inline <script> blocks in contact.html and ar/contact.html.
 * Requires: js/config.js, js/leadTracker.js loaded first.
 */
(function () {
  'use strict';

  var isAr = document.documentElement.lang === 'ar';

  var MESSAGES = {
    nameShort:    isAr ? 'من فضلك أدخل اسمك الكامل (على الأقل حرفان).'                    : 'Please enter your full name (at least 2 characters).',
    phoneInvalid: isAr ? 'من فضلك أدخل رقم هاتف صحيح.'                                     : 'Please enter a valid phone number (digits only, 7–15 characters).',
    emailInvalid: isAr ? 'من فضلك أدخل بريد إلكتروني صحيح.'                                : 'Please enter a valid email address (e.g. name@example.com).',
    msgShort:     isAr ? 'من فضلك اشرح كيف يمكننا مساعدتك (على الأقل 10 أحرف).'           : 'Please describe how we can help you (at least 10 characters).',
  };

  function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name    = document.getElementById('name').value.trim();
      var phone   = document.getElementById('phone').value.trim();
      var emailEl = document.getElementById('email');
      var email   = emailEl ? emailEl.value.trim() : '';
      var message = document.getElementById('inquiry').value.trim();

      if (!name || name.length < 2)                            { alert(MESSAGES.nameShort);    return; }
      if (!phone || !/^[\d\s\+\-\(\)]{7,15}$/.test(phone))    { alert(MESSAGES.phoneInvalid); return; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert(MESSAGES.emailInvalid); return; }
      if (!message || message.length < 10)                     { alert(MESSAGES.msgShort);     return; }

      var successEl  = document.getElementById('contact-success');

      function onDone() {
        clearTimeout(timeout);
        if (typeof window.trackContactLead === 'function') {
          window.trackContactLead({ name: name, phone: phone, email: email, message: message });
        }
        if (successEl) successEl.style.display = 'block';
        form.reset();
        setTimeout(function () { if (successEl) successEl.style.display = 'none'; }, 4000);
      }

      window.MaxPoolAPI.postMessage({ name: name, phone: phone, email: email, message: message })
      .then(function () { onDone(); })
      .catch(function () { onDone(); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
  } else {
    initContactForm();
  }

})();
