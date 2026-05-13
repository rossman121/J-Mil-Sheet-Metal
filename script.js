/* J-Mil Sheet Metal — main script */

(function () {
  'use strict';

  /* ── HEADER scroll shadow ── */
  const header = document.getElementById('site-header');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when a link is tapped
  document.querySelectorAll('.mobile-nav-link, .mobile-quote-btn').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  /* ── ACTIVE NAV LINK (intersection observer) ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--header-h')} 0px 0px 0px` }
  );
  sections.forEach(s => sectionObserver.observe(s));

  /* ── FOOTER YEAR ── */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── CONTACT FORM ── */

  // ↓↓↓ PASTE YOUR FORMSPREE URL BETWEEN THE QUOTES BELOW (Step 2 of setup guide)
  const FORMSPREE_URL = 'https://formspree.io/f/xojrbrza';
  // Example once set up: 'https://formspree.io/f/xabcd1234'

  const form = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = form ? form.querySelector('[type="submit"]') : null;

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();

      // Basic validation — highlight empty required fields in red
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      requiredFields.forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#dc2626';
          valid = false;
        }
      });
      if (!valid) return;

      // Disable button while sending
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      const formData = new FormData(form);

      if (FORMSPREE_URL && FORMSPREE_URL !== 'YOUR_FORMSPREE_URL_HERE') {
        // ── Send via Formspree (works once you paste your URL above) ──
        try {
          const res = await fetch(FORMSPREE_URL, {
            method: 'POST',
            body: formData,
            headers: { Accept: 'application/json' },
          });
          if (res.ok) {
            form.style.display = 'none';
            successMsg.classList.add('visible');
          } else {
            alert('Something went wrong — please email bids@jmilmetal.com directly or call 972-681-9600.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Quote Request';
          }
        } catch {
          alert('Could not send — please email bids@jmilmetal.com directly or call 972-681-9600.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Quote Request';
        }
      } else {
        // ── Fallback: open email client until Formspree is set up ──
        const name    = formData.get('name') || '';
        const company = formData.get('company') || 'N/A';
        const email   = formData.get('email') || '';
        const phone   = formData.get('phone') || 'N/A';
        const service = formData.get('service') || 'Not specified';
        const message = formData.get('message') || '';
        const subject = encodeURIComponent(`Quote Request from ${name}${company !== 'N/A' ? ' – ' + company : ''}`);
        const body    = encodeURIComponent(
          `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nDetails:\n${message}`
        );
        window.location.href = `mailto:bids@jmilmetal.com?subject=${subject}&body=${body}`;
        form.style.display = 'none';
        successMsg.classList.add('visible');
      }
    });
  }

  /* ── SCROLL ANIMATIONS (IntersectionObserver) ── */
  const animTargets = [
    '.service-card',
    '.portfolio-card',
    '.why-point',
    '.contact-detail',
  ];

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.animationDelay = `${(el.dataset.delay || 0) * 100}ms`;
          el.classList.add('fade-up');
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(animTargets.join(',')).forEach((el, i) => {
    el.dataset.delay = i % 4;
    revealObserver.observe(el);
  });

  /* ── SMOOTH SCROLL for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
