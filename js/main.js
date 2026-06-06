/* ========== DOM Ready ========== */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenuOverlay();
  initContactForm();
  initTestimonialCarousel();
  initBackToTop();
  initParallax();

  if (document.querySelector('.menu-tabs')) initMenuTabs();
});

document.addEventListener('cms:loaded', () => {
  initScrollAnimations();
  initCountUp();
  initRevealImages();
});

/* ========== Navigation ========== */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  const nav = document.querySelector('.nav');

  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        toggle.classList.remove('active');
        navLinks.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        navLinks.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ========== Scroll Animations (Intersection Observer) ========== */
function initScrollAnimations() {
  const animateElements = document.querySelectorAll('.animate, .animate-fade-in, .animate-scale');

  if (!('IntersectionObserver' in window)) {
    animateElements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animateElements.forEach(el => observer.observe(el));
}

/* ========== Mobile Menu Overlay ========== */
function initMobileMenuOverlay() {
  if (!document.querySelector('.nav-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);

    overlay.addEventListener('click', () => {
      const toggle = document.querySelector('.nav-toggle');
      const navLinks = document.querySelector('.nav-links');
      if (toggle) toggle.classList.remove('active');
      if (navLinks) navLinks.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
}

/* ========== Menu Tabs ========== */
function initMenuTabs() {
  const tabs = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('.menu-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const target = tab.dataset.tab;
      sections.forEach(section => {
        if (section.id === target) {
          section.style.display = 'block';
          setTimeout(() => section.classList.add('visible'), 10);
        } else {
          section.style.display = 'none';
          section.classList.remove('visible');
        }
      });

      // Re-observe animations for visible section
      setTimeout(() => initScrollAnimations(), 100);
    });
  });

  // Show first tab by default
  if (tabs.length > 0) {
    tabs[0].click();
  }
}

/* ========== Contact Form ========== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea');

  // Real-time validation
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group && group.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) isValid = false;
    });

    if (!isValid) return;

    // Simulate submission
    const submitBtn = form.querySelector('.form-submit .btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Senden...';
    submitBtn.disabled = true;

    setTimeout(() => {
      form.querySelector('.contact-form').style.display = 'none';
      form.querySelector('.form-success').classList.add('show');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  });
}

/* ========== Testimonial Carousel ========== */
function initTestimonialCarousel() {
  const carousel = document.querySelector('.testimonials-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const dotsContainer = carousel.querySelector('.carousel-dots');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const slides = carousel.querySelectorAll('.testimonial-slide');
  if (!track || slides.length === 0) return;

  let currentIndex = 0;
  let intervalId = null;
  const autoplayDelay = 4000;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Bewertung ${i + 1} von ${slides.length}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });

  function getSlideWidth() {
    return slides[0].offsetWidth + 24;
  }

  function goToSlide(index) {
    const maxIndex = slides.length - getVisibleSlides();
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    const offset = currentIndex * getSlideWidth();
    track.style.transform = `translateX(-${offset}px)`;

    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function getVisibleSlides() {
    return window.innerWidth <= 768 ? 1 : 3;
  }

  function nextSlide() {
    const maxIndex = slides.length - getVisibleSlides();
    goToSlide(currentIndex < maxIndex ? currentIndex + 1 : 0);
  }

  function prevSlide() {
    const maxIndex = slides.length - getVisibleSlides();
    goToSlide(currentIndex > 0 ? currentIndex - 1 : maxIndex);
  }

  function startAutoplay() {
    stopAutoplay();
    intervalId = setInterval(nextSlide, autoplayDelay);
  }

  function stopAutoplay() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  // Events
  prevBtn.addEventListener('click', () => { prevSlide(); startAutoplay(); });
  nextBtn.addEventListener('click', () => { nextSlide(); startAutoplay(); });

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => goToSlide(currentIndex), 150);
  });

  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { prevSlide(); startAutoplay(); }
    if (e.key === 'ArrowRight') { nextSlide(); startAutoplay(); }
  });

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) { nextSlide(); startAutoplay(); }
      else { prevSlide(); startAutoplay(); }
    }
  }, { passive: true });

  // Make carousel focusable
  carousel.setAttribute('tabindex', '0');

  startAutoplay();
}

function validateField(input) {
  const group = input.closest('.form-group');
  if (!group) return true;

  const value = input.value.trim();
  let isValid = true;

  group.classList.remove('error', 'success');

  if (input.hasAttribute('required') && !value) {
    isValid = false;
    group.classList.add('error');
  } else if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      group.classList.add('error');
    }
  } else if (input.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\-+()]{7,}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      group.classList.add('error');
    }
  }

  if (isValid && value) {
    group.classList.add('success');
  }

  return isValid;
}

/* ========== Count-Up Animation ========== */
function initCountUp() {
  const counters = document.querySelectorAll('[data-count-to]');

  if (!counters.length) return;

  if (!('IntersectionObserver' in window)) {
    counters.forEach(el => {
      el.textContent = el.dataset.countTo;
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.countTo, 10);
        const duration = parseInt(el.dataset.countDuration, 10) || 1500;
        const suffix = el.dataset.countSuffix || '';
        const prefix = el.dataset.countPrefix || '';
        animateCount(el, target, duration, prefix, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCount(el, target, duration, prefix, suffix) {
  let start = 0;
  const startTime = performance.now();

  function tick(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = prefix + current + suffix;

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = prefix + target + suffix;
    }
  }

  requestAnimationFrame(tick);
}

/* ========== Back to Top ========== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ========== Parallax ========== */
function initParallax() {
  const parallaxElements = document.querySelectorAll('.parallax');

  if (!parallaxElements.length || window.innerWidth < 768) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallaxSpeed) || 0.3;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const offset = scrollY * speed;
        el.style.transform = `translateY(${offset}px)`;
      }
    });
  }, { passive: true });
}

/* ========== Image Reveal ========== */
function initRevealImages() {
  const reveals = document.querySelectorAll('.reveal');

  if (!reveals.length) return;

  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}
