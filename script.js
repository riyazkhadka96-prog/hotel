// ── Navbar scroll effect ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ── Mobile menu toggle ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('active');
});
// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// ── Scroll-reveal ──
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]:not(.open-chat-inbox)').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Chat inbox (StayNEP concierge) ──
const STAYNEP_BASE = 'http://localhost:3000';
const STAYNEP_HOTEL = 'willow-hotel';

const chatInbox = document.getElementById('chatInbox');
const chatToggle = document.getElementById('chatInboxToggle');
const chatClose = document.getElementById('chatInboxClose');
let conciergeLoaded = false;

function loadConciergeEmbed() {
  if (conciergeLoaded || document.getElementById('staynep-embed-script')) return;
  conciergeLoaded = true;

  const script = document.createElement('script');
  script.id = 'staynep-embed-script';
  script.src = `${STAYNEP_BASE}/embed.js`;
  script.setAttribute('data-hotel', STAYNEP_HOTEL);
  script.setAttribute('data-base', STAYNEP_BASE);
  script.setAttribute('data-height', '100%');
  script.async = true;
  document.body.appendChild(script);
}

function openChatInbox() {
  loadConciergeEmbed();
  chatInbox.classList.add('open');
  chatInbox.setAttribute('aria-hidden', 'false');
  chatToggle.setAttribute('aria-expanded', 'true');
  navLinks.classList.remove('active');
  hamburger.classList.remove('active');
}

function closeChatInbox() {
  chatInbox.classList.remove('open');
  chatInbox.setAttribute('aria-hidden', 'true');
  chatToggle.setAttribute('aria-expanded', 'false');
}

function toggleChatInbox() {
  if (chatInbox.classList.contains('open')) {
    closeChatInbox();
  } else {
    openChatInbox();
  }
}

if (chatInbox && chatToggle) {
  chatToggle.addEventListener('click', toggleChatInbox);
  chatClose?.addEventListener('click', closeChatInbox);

  document.querySelectorAll('.open-chat-inbox').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openChatInbox();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatInbox.classList.contains('open')) {
      closeChatInbox();
    }
  });
}

// ── Counter animation for stats ──
const counters = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = +entry.target.dataset.count;
      const suffix = entry.target.dataset.suffix || '';
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        entry.target.textContent = Math.floor(current) + suffix;
      }, 25);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

// ── Form submit handler ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      form.reset();
    }, 3000);
  });
}

// ── Parallax on hero ──
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg');
  if (hero) {
    const scrolled = window.scrollY;
    hero.style.transform = `translateY(${scrolled * 0.35}px)`;
  }
});
