// ── Navbar scroll effect ──
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// ── Mobile slide-out drawer menu ──
const hamburger = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  if (mobileDrawer && hamburger && drawerOverlay) {
    mobileDrawer.classList.add('active');
    hamburger.classList.add('active');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
  }
}

function closeDrawer() {
  if (mobileDrawer && hamburger && drawerOverlay) {
    mobileDrawer.classList.remove('active');
    hamburger.classList.remove('active');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}

if (hamburger && mobileDrawer && drawerOverlay) {
  hamburger.addEventListener('click', () => {
    if (mobileDrawer.classList.contains('active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  drawerOverlay.addEventListener('click', closeDrawer);

  mobileDrawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

// ── Scroll-reveal ──
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
revealElements.forEach(el => revealObserver.observe(el));

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]:not(.open-chat-inbox)').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Chat inbox (StayNEP concierge) ──
const STAYNEP_BASE = 'http://localhost:3000';
const STAYNEP_HOTEL = 'aurelian-grand';

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
  if (chatInbox && chatToggle) {
    chatInbox.classList.add('open');
    chatInbox.setAttribute('aria-hidden', 'false');
    chatToggle.setAttribute('aria-expanded', 'true');
  }
  closeDrawer();
}

function closeChatInbox() {
  if (chatInbox && chatToggle) {
    chatInbox.classList.remove('open');
    chatInbox.setAttribute('aria-hidden', 'true');
    chatToggle.setAttribute('aria-expanded', 'false');
  }
}

function toggleChatInbox() {
  if (chatInbox && chatInbox.classList.contains('open')) {
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
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('active')) {
      closeDrawer();
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
      const duration = 1500; // ms
      const stepTime = 25;
      const increment = (target / duration) * stepTime;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        entry.target.textContent = Math.floor(current).toLocaleString('en-US') + suffix;
      }, stepTime);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
counters.forEach(c => counterObserver.observe(c));

// ── Parallax on hero background ──
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg');
  if (hero) {
    const scrolled = window.scrollY;
    hero.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
});

// ── Testimonials Carousel Slider ──
const track = document.querySelector('.testimonials-track');
const slides = Array.from(document.querySelectorAll('.testimonial-slide'));
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const dotsContainer = document.querySelector('.slider-dots');

if (track && slides.length > 0) {
  let currentIndex = 0;
  let autoSlideTimer;

  // Create dot indicators
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetAutoSlide();
    });
    dotsContainer?.appendChild(dot);
  });

  const dots = Array.from(document.querySelectorAll('.slider-dot'));

  function updateDots(index) {
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === index);
    });
  }

  function goToSlide(index) {
    if (index < 0) {
      currentIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateDots(currentIndex);
  }

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 6000);
  }

  function resetAutoSlide() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }

  prevBtn?.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
    resetAutoSlide();
  });

  nextBtn?.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
    resetAutoSlide();
  });

  // Swipe support for touch devices
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) {
      goToSlide(currentIndex + 1);
      resetAutoSlide();
    } else if (touchEndX - touchStartX > 50) {
      goToSlide(currentIndex - 1);
      resetAutoSlide();
    }
  });

  startAutoSlide();
}

// ── Accordion FAQ Toggles ──
document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const item = button.parentElement;
    const isActive = item.classList.contains('active');

    // Close all other FAQ items
    document.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('active');
    });

    if (!isActive) {
      item.classList.add('active');
    }
  });
});

// ── Simulated 360-degree virtual tour pan ──
const tourWrapper = document.getElementById('tourPanWrapper');
const panLeft = document.getElementById('panLeft');
const panRight = document.getElementById('panRight');

if (tourWrapper) {
  let currentPanPosition = 33; // initial focus percentage (middle)

  panLeft?.addEventListener('click', () => {
    currentPanPosition = Math.max(0, currentPanPosition - 15);
    tourWrapper.style.transform = `translateX(-${currentPanPosition}%)`;
  });

  panRight?.addEventListener('click', () => {
    currentPanPosition = Math.min(66, currentPanPosition + 15);
    tourWrapper.style.transform = `translateX(-${currentPanPosition}%)`;
  });
}

// ── Simulated Interactive Maps Attractions Integration ──
const attractionItems = document.querySelectorAll('.attraction-item');
const mapMarkers = document.querySelectorAll('.map-marker:not(.hotel-marker)');

if (attractionItems.length > 0 && mapMarkers.length > 0) {
  function selectAttraction(id) {
    attractionItems.forEach(item => {
      item.classList.toggle('active', item.dataset.target === id);
    });

    mapMarkers.forEach(marker => {
      const isSelected = marker.dataset.id === id;
      marker.classList.toggle('active', isSelected);
      if (isSelected) {
        marker.style.transform = 'scale(1.4)';
        marker.style.backgroundColor = '#c9a96e';
      } else {
        marker.style.transform = 'scale(1)';
        marker.style.backgroundColor = '#601227';
      }
    });
  }

  attractionItems.forEach(item => {
    item.addEventListener('click', () => {
      selectAttraction(item.dataset.target);
    });
  });

  mapMarkers.forEach(marker => {
    marker.addEventListener('click', () => {
      selectAttraction(marker.dataset.id);
    });
  });
}

// ── Room filter and compare features ──
const filterButtons = document.querySelectorAll('.filter-btn');
const roomCards = document.querySelectorAll('.room-card');

if (filterButtons.length > 0 && roomCards.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;

      roomCards.forEach(card => {
        if (filterVal === 'all') {
          card.style.display = 'block';
        } else {
          const cat = card.dataset.category || '';
          if (cat.includes(filterVal)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
}

// ── Luxury Menu Tabs Showcase ──
const menuTabBtns = document.querySelectorAll('.menu-tab-btn');
const menuContents = document.querySelectorAll('.menu-content');

if (menuTabBtns.length > 0 && menuContents.length > 0) {
  menuTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      menuTabBtns.forEach(b => b.classList.remove('active'));
      menuContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetMenu = document.getElementById(btn.dataset.menu);
      if (targetMenu) {
        targetMenu.classList.add('active');
      }
    });
  });
}

// ── Video Showcase Modal ──
const videoPlay = document.getElementById('playShowcaseVideo');
const videoModal = document.getElementById('videoModal');
const videoModalClose = document.getElementById('videoModalClose');
const videoIframe = videoModal?.querySelector('iframe');

if (videoPlay && videoModal && videoModalClose) {
  videoPlay.addEventListener('click', () => {
    videoModal.classList.add('active');
    if (videoIframe) {
      // Autoplay on trigger
      const currentSrc = videoIframe.getAttribute('src') || '';
      if (!currentSrc.includes('autoplay=1')) {
        videoIframe.setAttribute('src', currentSrc + (currentSrc.includes('?') ? '&' : '?') + 'autoplay=1');
      }
    }
  });

  function closeVideoModal() {
    videoModal.classList.remove('active');
    if (videoIframe) {
      // Pause iframe by resetting src
      const currentSrc = videoIframe.getAttribute('src') || '';
      const normalSrc = currentSrc.replace('&autoplay=1', '').replace('?autoplay=1', '');
      videoIframe.setAttribute('src', normalSrc);
    }
  }

  videoModalClose.addEventListener('click', closeVideoModal);
  videoModal.addEventListener('click', (e) => {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });
}

// ── Interactive Booking System & Invoice Calculator ──
// Rates (in NPR)
const ROOM_PRICES = {
  deluxe: 43200,
  suite: 78300,
  penthouse: 162000
};

const PACKAGE_PRICES = {
  standard: 0,
  honeymoon: 15000,
  family: 12000,
  weekend: 8000,
  corporate: 10000
};

// Form selectors
const checkInInput = document.getElementById('bookingCheckin');
const checkOutInput = document.getElementById('bookingCheckout');
const roomSelect = document.getElementById('bookingRoom');
const guestSelect = document.getElementById('bookingGuests');
const packageSelect = document.getElementById('bookingPackage');
const promoInput = document.getElementById('bookingPromo');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const specialRequestsInput = document.getElementById('bookingRequests');

// Invoice selector elements
const invRoomName = document.getElementById('invRoomName');
const invNights = document.getElementById('invNights');
const invRoomRate = document.getElementById('invRoomRate');
const invPackageName = document.getElementById('invPackageName');
const invPackageRate = document.getElementById('invPackageRate');
const invSubtotal = document.getElementById('invSubtotal');
const invDiscountRow = document.getElementById('invDiscountRow');
const invDiscount = document.getElementById('invDiscount');
const invServiceCharge = document.getElementById('invServiceCharge');
const invVat = document.getElementById('invVat');
const invTotal = document.getElementById('invTotal');

let activeDiscountMultiplier = 0.0; // no discount default
let isPromoApplied = false;

function calculateNights(checkin, checkout) {
  if (!checkin || !checkout) return 1;
  const d1 = new Date(checkin);
  const d2 = new Date(checkout);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 1;
}

function updateInvoice() {
  if (!roomSelect) return;

  const roomType = roomSelect.value || 'deluxe';
  const packType = packageSelect ? packageSelect.value : 'standard';
  const guests = parseInt(guestSelect ? guestSelect.value : '2');

  const checkinVal = checkInInput ? checkInInput.value : '';
  const checkoutVal = checkOutInput ? checkOutInput.value : '';
  const nights = calculateNights(checkinVal, checkoutVal);

  const basePricePerNight = ROOM_PRICES[roomType];
  const totalRoomCost = basePricePerNight * nights;

  const packageOneTimeCost = PACKAGE_PRICES[packType] || 0;
  const totalPackageCost = packageOneTimeCost * guests;

  const subtotal = totalRoomCost + totalPackageCost;
  const discountAmount = subtotal * activeDiscountMultiplier;
  const discountedSubtotal = subtotal - discountAmount;

  // Hotel Tax Structure (10% Service Charge, then 13% VAT on top of subtotal + service charge)
  const serviceCharge = discountedSubtotal * 0.10;
  const taxableAmount = discountedSubtotal + serviceCharge;
  const vat = taxableAmount * 0.13;
  const grandTotal = taxableAmount + vat;

  // Update text values
  if (invRoomName) invRoomName.textContent = roomSelect.options[roomSelect.selectedIndex].text.split('—')[0].trim();
  if (invNights) invNights.textContent = `${nights} Night${nights > 1 ? 's' : ''}`;
  if (invRoomRate) invRoomRate.textContent = `NPR ${totalRoomCost.toLocaleString()}`;

  if (packageSelect && invPackageName && invPackageRate) {
    invPackageName.textContent = packageSelect.options[packageSelect.selectedIndex].text.split('+')[0].trim();
    invPackageRate.textContent = `NPR ${totalPackageCost.toLocaleString()}`;
  }

  if (invSubtotal) invSubtotal.textContent = `NPR ${subtotal.toLocaleString()}`;

  if (invDiscountRow) {
    if (activeDiscountMultiplier > 0) {
      invDiscountRow.style.display = 'flex';
      if (invDiscount) invDiscount.textContent = `- NPR ${discountAmount.toLocaleString()}`;
    } else {
      invDiscountRow.style.display = 'none';
    }
  }

  if (invServiceCharge) invServiceCharge.textContent = `NPR ${serviceCharge.toLocaleString()}`;
  if (invVat) invVat.textContent = `NPR ${vat.toLocaleString()}`;
  if (invTotal) invTotal.textContent = `NPR ${grandTotal.toLocaleString()}`;
}

// Attach event listeners for dynamic recalculation
if (roomSelect) {
  roomSelect.addEventListener('change', updateInvoice);
  if (packageSelect) packageSelect.addEventListener('change', updateInvoice);
  if (guestSelect) guestSelect.addEventListener('change', updateInvoice);
  if (checkInInput) {
    checkInInput.addEventListener('change', () => {
      // Set min check-out date to check-in + 1 day
      if (checkOutInput && checkInInput.value) {
        const nextDay = new Date(checkInInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkOutInput.min = nextDay.toISOString().split('T')[0];
        if (checkOutInput.value && new Date(checkOutInput.value) <= new Date(checkInInput.value)) {
          checkOutInput.value = checkOutInput.min;
        }
      }
      updateInvoice();
    });
  }
  if (checkOutInput) checkOutInput.addEventListener('change', updateInvoice);

  // Set default dates on load
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  if (checkInInput && !checkInInput.value) {
    checkInInput.min = today.toISOString().split('T')[0];
    checkInInput.value = today.toISOString().split('T')[0];
  }
  if (checkOutInput && !checkOutInput.value) {
    checkOutInput.min = tomorrow.toISOString().split('T')[0];
    checkOutInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Promo Code Handler
  applyPromoBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!promoInput) return;
    const code = promoInput.value.trim().toUpperCase();

    if (code === 'LUXURY20') {
      activeDiscountMultiplier = 0.20;
      isPromoApplied = true;
      alert('Promo code applied: 20% Discount active!');
      applyPromoBtn.textContent = 'Applied';
      applyPromoBtn.style.backgroundColor = '#4CAF50';
      applyPromoBtn.style.color = '#fff';
      promoInput.disabled = true;
      updateInvoice();
    } else if (code !== '') {
      alert('Invalid promo code. Try "LUXURY20".');
    }
  });

  // Initialize calculations
  updateInvoice();
}

// ── Contact Form & Booking Wizard Submit Handlers ──
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    if (btn) {
      const origText = btn.textContent;
      btn.textContent = "Thank you! We will get in touch shortly.";
      btn.style.background = 'linear-gradient(135deg, #4CAF50, #2E7D32)';
      setTimeout(() => {
        btn.textContent = origText;
        btn.style.background = '';
        contactForm.reset();
      }, 4000);
    }
  });
}

const wizardForm = document.getElementById('bookingWizardForm');
if (wizardForm) {
  wizardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = wizardForm.querySelector('button[type="submit"]');
    if (btn) {
      btn.textContent = "Processing luxury suite reservation...";
      btn.disabled = true;
      setTimeout(() => {
        // Render success page modal or redirect to dynamic invoice page
        alert('Reservation Successful!\n\nA luxury travel confirmation and invoice detail has been sent to your email. We look forward to welcoming you to the Aurelian Grand.');
        wizardForm.reset();
        if (checkInInput && checkOutInput) {
          const today = new Date().toISOString().split('T')[0];
          const tomorrow = new Date();
          tomorrow.setDate(new Date().getDate() + 1);
          checkInInput.value = today;
          checkOutInput.value = tomorrow.toISOString().split('T')[0];
        }
        if (promoInput) {
          promoInput.disabled = false;
          promoInput.value = '';
        }
        if (applyPromoBtn) {
          applyPromoBtn.textContent = 'Apply';
          applyPromoBtn.style.backgroundColor = '';
          applyPromoBtn.style.color = '';
        }
        activeDiscountMultiplier = 0.0;
        isPromoApplied = false;
        btn.textContent = "Confirm Luxury Reservation";
        btn.disabled = false;
        updateInvoice();
      }, 2000);
    }
  });
}

// ── Real-time Conversion Urgency Notifications ──
const URGENCY_MESSAGES = [
  "Only 3 luxury suites remaining for this upcoming weekend.",
  "A guest from London recently booked the Royal Penthouse.",
  "Popular choice: 18 travellers are browsing our special Honeymoon Package today.",
  "Book direct with code LUXURY20 to secure 20% off Spa services.",
  "Valet airport transfer bookings are filling up fast for this season."
];

const urgencyToast = document.getElementById('urgencyToast');
const urgencyText = document.getElementById('urgencyToastText');
const urgencyClose = document.getElementById('urgencyToastClose');

if (urgencyToast && urgencyText) {
  let toastTimer;

  function triggerUrgencyToast() {
    const randomMsg = URGENCY_MESSAGES[Math.floor(Math.random() * URGENCY_MESSAGES.length)];
    const pEl = urgencyText.querySelector('p');
    if (pEl) pEl.textContent = randomMsg;
    urgencyToast.classList.add('active');

    // Auto-dismiss after 6 seconds
    toastTimer = setTimeout(closeUrgencyToast, 6000);
  }

  function closeUrgencyToast() {
    urgencyToast.classList.remove('active');
    clearTimeout(toastTimer);
  }

  urgencyClose?.addEventListener('click', closeUrgencyToast);

  // Trigger first toast after 8 seconds, and then every 25 seconds
  setTimeout(triggerUrgencyToast, 8000);
  setInterval(triggerUrgencyToast, 35000);
}
