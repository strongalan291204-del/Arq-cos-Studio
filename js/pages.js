/* ============================================================ */
/* PAGES.JS — animaciones de páginas interiores                 */
/* ============================================================ */

// Page header animation (runs on load for inner pages)
(function () {
  const pageHeader = document.querySelector('.page-header');
  if (!pageHeader) return;

  const tag = pageHeader.querySelector('.page-tag');
  const title = pageHeader.querySelector('.page-title');
  const subtitle = pageHeader.querySelector('.page-subtitle');

  [tag, title, subtitle].forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 60);
  });

  const filters = pageHeader.querySelector('.projects-filters');
  if (filters) {
    filters.style.opacity = '0';
    filters.style.transform = 'translateY(20px)';
    filters.style.transition = 'opacity 0.65s cubic-bezier(0.16,1,0.3,1) 0.36s, transform 0.65s cubic-bezier(0.16,1,0.3,1) 0.36s';
    setTimeout(() => {
      filters.style.opacity = '1';
      filters.style.transform = 'translateY(0)';
    }, 60);
  }
})();

console.log('Arq-cos Studio — pages.js loaded ✓');