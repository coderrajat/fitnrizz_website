/**
 * FitnRizz Official Website - Interactive JS & Activity Simulator
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initActivitySimulator();
  initPhoneCarousel();
  initCurrentYear();
  initSmoothScroll();
});

/* --------------------------------------------------------------------------
   Single Phone Carousel Slider (track.jpeg <-> home.jpeg)
   -------------------------------------------------------------------------- */
function initPhoneCarousel() {
  const track = document.getElementById('phone-track');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const tabTrack = document.getElementById('tab-track-btn');
  const tabHome = document.getElementById('tab-home-btn');
  const dots = document.querySelectorAll('.carousel-dot');
  const phoneContainer = document.querySelector('.carousel-phone-container');

  if (!track) return;

  let currentSlide = 0;
  const totalSlides = 2;
  let autoplayInterval;

  function updateCarousel(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    
    // Slide transition
    track.style.transform = `translateX(-${currentSlide * 50}%)`;

    // Tabs update
    if (tabTrack && tabHome) {
      if (currentSlide === 0) {
        tabTrack.classList.add('active');
        tabHome.classList.remove('active');
      } else {
        tabHome.classList.add('active');
        tabTrack.classList.remove('active');
      }
    }

    // Dots update
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  // Navigation Click Handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateCarousel(currentSlide - 1);
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateCarousel(currentSlide + 1);
      resetAutoplay();
    });
  }

  if (tabTrack) {
    tabTrack.addEventListener('click', () => {
      updateCarousel(0);
      resetAutoplay();
    });
  }

  if (tabHome) {
    tabHome.addEventListener('click', () => {
      updateCarousel(1);
      resetAutoplay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      updateCarousel(idx);
      resetAutoplay();
    });
  });

  // Autoplay Logic (every 4.5s)
  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      updateCarousel(currentSlide + 1);
    }, 4500);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  if (phoneContainer) {
    phoneContainer.addEventListener('mouseenter', () => clearInterval(autoplayInterval));
    phoneContainer.addEventListener('mouseleave', () => startAutoplay());
  }

  startAutoplay();
}

/* --------------------------------------------------------------------------
   Sticky Navbar & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      document.body.classList.toggle('mobile-nav-active');
      const isExpanded = mobileBtn.getAttribute('aria-expanded') === 'true';
      mobileBtn.setAttribute('aria-expanded', !isExpanded);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        document.body.classList.remove('mobile-nav-active');
        mobileBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* --------------------------------------------------------------------------
   FAQ Accordion Component
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!questionBtn || !answer) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Interactive Activity & Territory Progress Simulator
   -------------------------------------------------------------------------- */
function initActivitySimulator() {
  const stepsSlider = document.getElementById('calc-steps-slider');
  const stepsInput = document.getElementById('calc-steps-input');
  const activityType = document.getElementById('calc-activity-type');
  
  const territoryDisplay = document.getElementById('calc-territory-result');
  const distanceDisplay = document.getElementById('calc-coins-result');
  const caloriesDisplay = document.getElementById('calc-calories-result');
  const rewardTierText = document.getElementById('calc-reward-tier');

  if (!stepsSlider || !stepsInput || !territoryDisplay) return;

  function updateEstimates() {
    let steps = parseInt(stepsSlider.value, 10);
    if (isNaN(steps)) steps = 10000;

    const activity = activityType ? activityType.value : 'walk';
    let hexMultiplier = 0.0012;
    let calorieMultiplier = 0.04;
    let distanceKm = (steps * 0.00075); // 10,000 steps ~ 7.5 km

    if (activity === 'run') {
      hexMultiplier = 0.0018;
      calorieMultiplier = 0.065;
      distanceKm = (steps * 0.0009);
    } else if (activity === 'cycle') {
      hexMultiplier = 0.0022;
      calorieMultiplier = 0.045;
      distanceKm = (steps * 0.0015);
    }

    const zonesCaptured = Math.max(1, Math.round(steps * hexMultiplier));
    const caloriesBurned = Math.round(steps * calorieMultiplier);
    const roundedKm = (Math.round(distanceKm * 10) / 10).toFixed(1);

    territoryDisplay.textContent = `${zonesCaptured} Zones`;
    caloriesDisplay.textContent = `${caloriesBurned} kcal`;
    if (distanceDisplay) distanceDisplay.textContent = `${roundedKm} km`;

    if (rewardTierText) {
      if (steps < 6000) {
        rewardTierText.innerHTML = `🌱 <strong>Daily Milestone:</strong> Good foundation for daily movement and stepping habits.`;
      } else if (steps < 12000) {
        rewardTierText.innerHTML = `⚡ <strong>Daily Milestone:</strong> Optimal consistency for cardiovascular wellness and habit streaks!`;
      } else {
        rewardTierText.innerHTML = `🔥 <strong>Daily Milestone:</strong> High endurance activity level with extensive territory coverage!`;
      }
    }
  }

  stepsSlider.addEventListener('input', (e) => {
    stepsInput.value = e.target.value;
    updateEstimates();
  });

  stepsInput.addEventListener('input', (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 0;
    if (val > 30000) val = 30000;
    stepsSlider.value = val;
    updateEstimates();
  });

  if (activityType) {
    activityType.addEventListener('change', updateEstimates);
  }

  // Initial calculation
  updateEstimates();
}

/* --------------------------------------------------------------------------
   Dynamic Year in Footer
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearEls = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearEls.forEach(el => {
    el.textContent = currentYear;
  });
}

/* --------------------------------------------------------------------------
   Smooth Scroll Anchor Links
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}
