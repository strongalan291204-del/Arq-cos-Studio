/* ============================================================ */
/* SCRIPT.JS — Arq-cos Studio                                   */
/* ============================================================ */

// ============================================================
// PRELOADER
// ============================================================
const preloader = document.getElementById('preloader');
const preloaderProgress = document.getElementById('preloaderProgress');
const preloaderPercent = document.getElementById('preloaderPercent');

if (preloader && typeof gsap !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const preloaderLogo = preloader.querySelector('.preloader-logo');
  const preloaderText = preloader.querySelector('.preloader-text');

  const tl = gsap.timeline();

  tl.to(preloaderLogo, { opacity: 1, y: 0, duration: 0.65, ease: 'power3.out' })
    .to(preloaderText, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .to({ v: 0 }, {
      v: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: function () {
        const val = Math.floor(this.targets()[0].v);
        if (preloaderProgress) preloaderProgress.style.width = val + '%';
        if (preloaderPercent) preloaderPercent.textContent = val + '%';
      }
    }, '-=0.2')
    .to(preloader, { yPercent: -105, duration: 0.85, ease: 'power4.inOut', delay: 0.15 })
    .set(preloader, { display: 'none' })
    .call(initPageAnimations);

} else {
  if (typeof gsap !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  initPageAnimations();
}

// ============================================================
// CURSOR
// ============================================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

if (cursor && cursorFollower) {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  (function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.35;
    cursorY += (mouseY - cursorY) * 0.35;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    requestAnimationFrame(animateCursor);
  })();

  document.querySelectorAll('a, button, .gallery-item, .process-card, .stat-item, .plan-card, .project-card, .value-card, .location-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorFollower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorFollower.classList.remove('hover');
    });
  });
}

// ============================================================
// NAVIGATION SCROLL EFFECT
// ============================================================
const nav = document.getElementById('nav');

if (nav && !nav.classList.contains('scrolled')) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  });
}

// ============================================================
// MOBILE MENU
// ============================================================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuToggle && mobileMenu) {
  mobileLinks.forEach((link, i) => {
    link.style.transitionDelay = `${0.08 + i * 0.07}s`;
  });

  menuToggle.addEventListener('click', () => {
    const isActive = menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ============================================================
// PAGE ANIMATIONS — called after preloader or immediately
// ============================================================
function initPageAnimations() {

  // Stagger reveal for hero items
  const heroItems = document.querySelectorAll('.hero-left .reveal-item, .hero-right.reveal-item');
  heroItems.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    setTimeout(() => {
      el.style.transition = `opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)`;
      el.style.transitionDelay = el.style.transitionDelay || `${i * 0.12}s`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 80);
  });

  // Intersection Observer for scroll reveals
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-item').forEach(el => {
    if (!el.closest('.hero-left') && !el.classList.contains('hero-right')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(40px)';
      el.style.transition = `opacity 0.75s cubic-bezier(0.16,1,0.3,1) ${el.style.transitionDelay || '0s'}, transform 0.75s cubic-bezier(0.16,1,0.3,1) ${el.style.transitionDelay || '0s'}`;
      observer.observe(el);
    }
  });

  // Counter animation
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
          current = Math.min(current + increment, target);
          el.textContent = Math.floor(current);
          if (current >= target) clearInterval(timer);
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  // Gallery modal
  initModal();

  // Projects filter
  initFilter();

  // Contact form
  initContactForm();
}

// ============================================================
// GALLERY MODAL
// ============================================================
function initModal() {
  const modal = document.getElementById('projectModal');
  const modalClose = document.getElementById('modalClose');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDesc = document.getElementById('modal-description');

  const projectData = [
    { title: "Casa Moderna", category: "Residencial", desc: "Proyecto de vivienda moderna con espacios abiertos y diseño minimalista." },
    { title: "Casa Moderna", category: "Residencial", desc: "Diseño contemporáneo con áreas integradas y materiales premium." },
    { title: "Espacio Interior", category: "Interiores", desc: "Interior elegante con iluminación natural y materiales de primera calidad." },
    { title: "Unidad Accesoria", category: "ADU", desc: "Espacio compacto independiente ideal para renta o uso adicional." },
    { title: "Diseño Interior", category: "Interiores", desc: "Ambiente interior diseñado para maximizar confort y funcionalidad." },
    { title: "Espacio Comercial", category: "Comercial", desc: "Local comercial optimizado para flujo de clientes y estética atractiva." },
    { title: "Espacio Comercial", category: "Comercial", desc: "Diseño comercial contemporáneo con materiales modernos." }
  ];

  if (!modal) return;

  document.querySelectorAll('.gallery-item').forEach((item, i) => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const data = projectData[i] || projectData[0];
      if (modalImg) modalImg.src = img.src;
      if (modalTitle) modalTitle.textContent = data.title;
      if (modalCategory) modalCategory.textContent = data.category;
      if (modalDesc) modalDesc.textContent = data.desc;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  };

  if (modalClose) modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

// ============================================================
// PROJECT FILTER
// ============================================================
function initFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.style.transition = 'opacity 0.4s, transform 0.4s';
        if (show) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.display = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (btn.dataset.filter !== filter) return;
            card.style.display = 'none';
          }, 400);
        }
      });
    });
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const fileInput = document.getElementById('file');
  const fileName = document.getElementById('fileName');

  if (fileInput && fileName) {
    fileInput.addEventListener('change', e => {
      fileName.textContent = e.target.files.length ? e.target.files[0].name : '';
    });
  }

  if (form && formSuccess) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const orig = btn.innerHTML;
      btn.innerHTML = '<span>Enviando...</span>';
      btn.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.style.display = 'block';
        form.reset();
        if (fileName) fileName.textContent = '';
        btn.innerHTML = orig;
        btn.disabled = false;
      }, 1400);
    });
  }
}

console.log('Arq-cos Studio scripts loaded ✓');