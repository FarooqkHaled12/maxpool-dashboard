/**
 * products-solutions.js
 * Handles solution card click → category filter activation + scroll to catalog
 */
(function () {
  'use strict';

  function initSolutionCards() {
    const cards = document.querySelectorAll('.solution-card');
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        const categories = (card.dataset.categories || '').trim().split(/\s+/);
        const primaryCat = categories[0];
        if (!primaryCat) return;

        // تفعيل الفلتر في الشريط الجانبي
        const filterBtn = document.querySelector(
          '#categoryFilters button[data-filter="' + primaryCat + '"]'
        );
        if (filterBtn) {
          filterBtn.click();
        }

        // انتقال سلس إلى الكتالوج
        const grid = document.getElementById('catalogGrid');
        if (grid) {
          grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSolutionCards);
  } else {
    initSolutionCards();
  }
})();
