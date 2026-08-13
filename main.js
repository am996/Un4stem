function restorePageTransitionState() {
  document.body.classList.remove("fade-out");
  document.body.classList.add("loaded");
  document.body.style.overflow = "";
}

window.addEventListener("pageshow", restorePageTransitionState);

document.addEventListener("DOMContentLoaded", () => {
  // Fade IN on load
  requestAnimationFrame(() => {
    restorePageTransitionState();
  });

  // Scroll Reveal Observer
  // We target specific content blocks instead of whole sections to prevent
  // empty background "voids" (blue space) before the reveal triggers.
  const revealElements = document.querySelectorAll(".card, .stat-card, .course-card, .mentor-card, .sdg-banner, .detail-panel, .statement-strip > h2, .statement-strip > p, .image-frame:not(.hero-image)");

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });

  // Navbar background change on scroll
  const nav = document.querySelector(".nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  // Mobile Navigation Toggle
  const mobileToggle = document.querySelector(".mobile-nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("active");
      mobileToggle.classList.toggle("active");
      // Prevent background scrolling when menu is open
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close menu when clicking a link (important for anchor navigation)
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", (e) => {
        const isDropdownTrigger = link.parentElement.classList.contains("dropdown") || 
                                 link.parentElement.classList.contains("category-parent");

        // On mobile, if it's a dropdown trigger, toggle the menu instead of closing/navigating
        if (window.innerWidth <= 900 && isDropdownTrigger) {
          e.preventDefault();
          e.stopPropagation();
          link.parentElement.classList.toggle("active");
          return;
        }

        navLinks.classList.remove("active");
        mobileToggle.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // Carousel functionality
  const carouselTrack = document.getElementById("carouselTrack");
  const carouselPrev = document.getElementById("carouselPrev");
  const carouselNext = document.getElementById("carouselNext");
  const carouselDotsContainer = document.getElementById("carouselDots");

  if (carouselTrack && carouselPrev && carouselNext && carouselDotsContainer) {
    const originalSlides = Array.from(carouselTrack.querySelectorAll(".carousel-slide"));
    const firstClone = originalSlides[0].cloneNode(true);
    const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
    [firstClone, lastClone].forEach((clone) => {
      clone.classList.add("carousel-slide--clone");
      clone.setAttribute("aria-hidden", "true");
      clone.querySelectorAll("img").forEach((image) => image.alt = "");
    });
    carouselTrack.prepend(lastClone);
    carouselTrack.append(firstClone);
    const slides = Array.from(carouselTrack.querySelectorAll(".carousel-slide"));
    let currentIndex = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoAdvanceInterval;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Create pagination dots
    originalSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (index === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.setAttribute("data-index", index);
      dot.addEventListener("click", () => goToSlide(index));
      carouselDotsContainer.appendChild(dot);
    });

    const dots = carouselDotsContainer.querySelectorAll(".carousel-dot");

    function updateDots(activeSlideIndex = currentIndex + 1) {
      dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
        dot.setAttribute("aria-current", index === currentIndex ? "true" : "false");
      });
      slides.forEach((slide, index) => {
        slide.classList.toggle("is-active", index === activeSlideIndex);
      });
    }

    function scrollToPhysicalSlide(index, behavior) {
      slides[index].scrollIntoView({
        behavior,
        block: "nearest",
        inline: "center"
      });
    }

    function goToSlide(index) {
      if (isAnimating || index === currentIndex) return;

      isAnimating = true;
      const isWrappingForward = currentIndex === originalSlides.length - 1 && index === 0;
      const isWrappingBackward = currentIndex === 0 && index === originalSlides.length - 1;
      const targetSlideIndex = isWrappingForward ? slides.length - 1 : isWrappingBackward ? 0 : index + 1;
      scrollToPhysicalSlide(targetSlideIndex, reduceMotion.matches ? "auto" : "smooth");

      currentIndex = index;
      updateDots(targetSlideIndex);

      setTimeout(() => {
        // The edge clones provide a continuous visual loop. Once the motion ends,
        // jump invisibly to the matching real slide so the next move remains smooth.
        scrollToPhysicalSlide(index + 1, "auto");
        updateDots(index + 1);
        isAnimating = false;
      }, reduceMotion.matches ? 0 : 550);
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % slides.length;
      goToSlide(nextIndex);
    }

    function prevSlide() {
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      goToSlide(prevIndex);
    }

    carouselNext.addEventListener("click", nextSlide);
    carouselPrev.addEventListener("click", prevSlide);

    // Touch/swipe support
    carouselTrack.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carouselTrack.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Keyboard navigation
    carouselTrack.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSlide();
      }
    });

    // Keep the centered slide in sync with pointer/trackpad scrolling.
    let scrollTimeout;
    carouselTrack.addEventListener("scroll", () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (!isAnimating) {
          const trackCenter = carouselTrack.getBoundingClientRect().left + carouselTrack.clientWidth / 2;
          const physicalIndex = slides.reduce((closestIndex, slide, index) => {
            const rect = slide.getBoundingClientRect();
            const slideCenter = rect.left + rect.width / 2;
            const closestRect = slides[closestIndex].getBoundingClientRect();
            const closestCenter = closestRect.left + closestRect.width / 2;
            return Math.abs(slideCenter - trackCenter) < Math.abs(closestCenter - trackCenter) ? index : closestIndex;
          }, 0);
          const newIndex = (physicalIndex - 1 + originalSlides.length) % originalSlides.length;
          currentIndex = newIndex;
          updateDots(physicalIndex);
          if (physicalIndex === 0 || physicalIndex === slides.length - 1) {
            const realSlideIndex = physicalIndex === 0 ? originalSlides.length : 1;
            setTimeout(() => {
              scrollToPhysicalSlide(realSlideIndex, "auto");
              updateDots(realSlideIndex);
            }, 0);
          }
        }
      }, 100);
    }, { passive: true });

    function startAutoAdvance() {
      if (reduceMotion.matches || document.hidden) return;
      stopAutoAdvance();
      autoAdvanceInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoAdvance() {
      clearInterval(autoAdvanceInterval);
    }

    const carouselContainer = document.querySelector(".carousel-container");
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", stopAutoAdvance);
      carouselContainer.addEventListener("mouseleave", startAutoAdvance);
      carouselContainer.addEventListener("focusin", stopAutoAdvance);
      carouselContainer.addEventListener("focusout", startAutoAdvance);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopAutoAdvance();
      else startAutoAdvance();
    });

    requestAnimationFrame(() => {
      scrollToPhysicalSlide(1, "auto");
      updateDots(1);
    });
    startAutoAdvance();
  }

  // =========================
  // LIGHTBOX (Full-size Image Modal)
  // =========================
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");
  const lightboxBackdrop = document.getElementById("lightboxBackdrop");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const carouselSlides = document.querySelectorAll(".carousel-slide:not(.carousel-slide--clone) img[data-fullsrc]");

  let lightboxCurrentIndex = 0;
  let lightboxSlides = [];

  // Collect all lightbox-enabled images from carousel
  if (carouselSlides.length > 0) {
    lightboxSlides = Array.from(carouselSlides).map(img => ({
      src: img.dataset.fullsrc,
      alt: img.alt
    }));

    // Add click handlers to carousel images
    carouselSlides.forEach((img, index) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", () => openLightbox(index));
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openLightbox(index);
        }
      });
      // Make images focusable for keyboard access
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", `${img.alt} - Click to view full size`);
    });

    function openLightbox(index) {
      lightboxCurrentIndex = index;
      updateLightboxImage();
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      
      // Focus the close button for accessibility
      setTimeout(() => lightboxClose.focus(), 100);
    }

    function closeLightbox() {
      lightbox.hidden = true;
      document.body.style.overflow = "";
      lightboxImage.src = "";
      lightboxImage.alt = "";
    }

    function updateLightboxImage() {
      const slide = lightboxSlides[lightboxCurrentIndex];
      lightboxImage.src = slide.src;
      lightboxImage.alt = slide.alt;
      lightboxCounter.textContent = `${lightboxCurrentIndex + 1} / ${lightboxSlides.length}`;
    }

    function showPrevLightbox() {
      lightboxCurrentIndex = (lightboxCurrentIndex - 1 + lightboxSlides.length) % lightboxSlides.length;
      updateLightboxImage();
    }

    function showNextLightbox() {
      lightboxCurrentIndex = (lightboxCurrentIndex + 1) % lightboxSlides.length;
      updateLightboxImage();
    }

    // Event listeners
    lightboxClose.addEventListener("click", closeLightbox);
    lightboxBackdrop.addEventListener("click", closeLightbox);
    lightboxPrev.addEventListener("click", showPrevLightbox);
    lightboxNext.addEventListener("click", showNextLightbox);

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        showPrevLightbox();
      } else if (e.key === "ArrowRight") {
        showNextLightbox();
      }
    });

    // Touch/swipe support for lightbox
    let lightboxTouchStartX = 0;
    let lightboxTouchEndX = 0;

    lightbox.addEventListener("touchstart", (e) => {
      lightboxTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener("touchend", (e) => {
      lightboxTouchEndX = e.changedTouches[0].screenX;
      handleLightboxSwipe();
    }, { passive: true });

    function handleLightboxSwipe() {
      const swipeThreshold = 50;
      const diff = lightboxTouchStartX - lightboxTouchEndX;
      
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          showNextLightbox();
        } else {
          showPrevLightbox();
        }
      }
    }
  }

  // Fade OUT on navigation for internal links
  document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");

    // Only apply to internal links that are not anchors or external URLs
    if (!href || href.startsWith("#") || href.startsWith("http")) return;

    // Skip fade-out for mobile dropdown triggers
    if (window.innerWidth <= 900) {
      const isTrigger = link.parentElement.classList.contains("dropdown") || 
                        link.parentElement.classList.contains("category-parent");
      if (isTrigger) return;
    }

    link.addEventListener("click", (e) => {
      // Check if navigating to the same page (ignoring the hash).
      // If pathnames match, skip the fade transition to prevent a blank screen.
      if (link.hostname === window.location.hostname && 
          link.pathname === window.location.pathname) {
        return;
      }

      e.preventDefault();

      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = href;
      }, 250);
    });
  });
});
