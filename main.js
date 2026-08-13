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
    carouselDotsContainer.style.setProperty("--carousel-slide-count", originalSlides.length);
    originalSlides.forEach((slide) => {
      const imagePath = slide.querySelector("img").getAttribute("src");
      slide.style.setProperty("--carousel-image", `url("${imagePath}")`);
    });
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
    let autoScrollFrame;
    let autoScrollLastTime;
    let autoScrollRemainder = 0;
    let autoResumeTimer;
    let isUserInteracting = false;
    let carouselIsVisible = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Create pagination dots
    originalSlides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = "carousel-dot" + (index === 0 ? " active" : "");
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.setAttribute("data-index", index);
      dot.addEventListener("click", () => {
        pauseForUserInteraction();
        goToSlide(index);
      });
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
      const slide = slides[index];
      const targetLeft = slide.offsetLeft - (carouselTrack.clientWidth - slide.offsetWidth) / 2;

      if (behavior === "auto") {
        // Overrides the CSS smooth-scroll rule for the invisible clone-to-real reset.
        // Without this, the browser visibly scrolls back through every photo at a loop edge.
        carouselTrack.style.scrollBehavior = "auto";
        carouselTrack.scrollLeft = targetLeft;
        requestAnimationFrame(() => {
          carouselTrack.style.scrollBehavior = "";
        });
        return;
      }

      carouselTrack.scrollTo({
        left: targetLeft,
        behavior
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

      let moveFinished = false;
      let fallbackTimer;
      const finishMove = () => {
        if (moveFinished) return;
        moveFinished = true;
        clearTimeout(fallbackTimer);
        carouselTrack.removeEventListener("scrollend", finishMove);
        // The edge clones provide a continuous visual loop. Once the motion ends,
        // jump invisibly to the matching real slide so the next move remains smooth.
        scrollToPhysicalSlide(index + 1, "auto");
        updateDots(index + 1);
        isAnimating = false;
      };

      if (reduceMotion.matches) {
        finishMove();
      } else {
        carouselTrack.addEventListener("scrollend", finishMove, { once: true });
        // Fallback for browsers without scrollend support.
        fallbackTimer = setTimeout(finishMove, 520);
      }
    }

    function nextSlide() {
      const nextIndex = (currentIndex + 1) % originalSlides.length;
      goToSlide(nextIndex);
    }

    function prevSlide() {
      const prevIndex = (currentIndex - 1 + originalSlides.length) % originalSlides.length;
      goToSlide(prevIndex);
    }

    carouselNext.addEventListener("click", () => {
      pauseForUserInteraction();
      nextSlide();
    });
    carouselPrev.addEventListener("click", () => {
      pauseForUserInteraction();
      prevSlide();
    });

    carouselTrack.addEventListener("pointerdown", pauseForUserInteraction, { passive: true });

    // Touch/swipe support
    carouselTrack.addEventListener("touchstart", (e) => {
      pauseForUserInteraction();
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
        pauseForUserInteraction();
        prevSlide();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        pauseForUserInteraction();
        nextSlide();
      }
    });

    // Keep the centered slide in sync with continuous, pointer, and trackpad scrolling.
    let scrollUpdateFrame;
    carouselTrack.addEventListener("scroll", () => {
      if (scrollUpdateFrame) return;
      scrollUpdateFrame = requestAnimationFrame(() => {
        scrollUpdateFrame = undefined;
        if (isAnimating) return;

        const trackCenter = carouselTrack.getBoundingClientRect().left + carouselTrack.clientWidth / 2;
        const physicalIndex = slides.reduce((closestIndex, slide, index) => {
          const rect = slide.getBoundingClientRect();
          const slideCenter = rect.left + rect.width / 2;
          const closestRect = slides[closestIndex].getBoundingClientRect();
          const closestCenter = closestRect.left + closestRect.width / 2;
          return Math.abs(slideCenter - trackCenter) < Math.abs(closestCenter - trackCenter) ? index : closestIndex;
        }, 0);
        const closestSlide = slides[physicalIndex];
        const closestRect = closestSlide.getBoundingClientRect();
        const centerDistance = Math.abs((closestRect.left + closestRect.width / 2) - trackCenter);
        
        // During continuous auto-scrolling, use a wider center zone (35% instead of 8%)
        // because slides move through the center quickly and never stay in the tight zone long enough.
        const isAutoScrolling = carouselTrack.classList.contains("is-auto-scrolling");
        const centerZone = closestRect.width * (isAutoScrolling ? 0.35 : 0.08);

        // Keep the current feature card highlighted until the next photo has
        // genuinely arrived at the middle, instead of swapping at the midpoint.
        if (centerDistance > centerZone) return;

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
      });
    }, { passive: true });

    function startAutoAdvance() {
      if (reduceMotion.matches || document.hidden || !carouselIsVisible || isUserInteracting) return;
      stopAutoAdvance();
      carouselTrack.classList.add("is-auto-scrolling");

      const pixelsPerSecond = 34;
      const autoScroll = (timestamp) => {
        if (document.hidden || !carouselIsVisible || isUserInteracting) {
          stopAutoAdvance();
          return;
        }

        if (autoScrollLastTime) {
          const elapsedSeconds = (timestamp - autoScrollLastTime) / 1000;
          autoScrollRemainder += pixelsPerSecond * elapsedSeconds;
          const wholePixels = Math.floor(autoScrollRemainder);
          if (wholePixels > 0) {
            carouselTrack.scrollLeft += wholePixels;
            autoScrollRemainder -= wholePixels;
          }
        }
        autoScrollLastTime = timestamp;
        autoScrollFrame = requestAnimationFrame(autoScroll);
      };

      autoScrollFrame = requestAnimationFrame(autoScroll);
    }
    
    function stopAutoAdvance() {
      cancelAnimationFrame(autoScrollFrame);
      autoScrollFrame = undefined;
      autoScrollLastTime = undefined;
      autoScrollRemainder = 0;
      carouselTrack.classList.remove("is-auto-scrolling");
    }

    function pauseForUserInteraction() {
      isUserInteracting = true;
      stopAutoAdvance();
      clearTimeout(autoResumeTimer);
      autoResumeTimer = setTimeout(() => {
        isUserInteracting = false;
        startAutoAdvance();
      }, 5000);
    }

    const carouselContainer = document.querySelector(".carousel-container");
    if (carouselContainer) {
      carouselContainer.addEventListener("mouseenter", stopAutoAdvance);
      carouselContainer.addEventListener("mouseleave", startAutoAdvance);
      carouselContainer.addEventListener("focusin", stopAutoAdvance);
      carouselContainer.addEventListener("focusout", startAutoAdvance);

      const carouselVisibilityObserver = new IntersectionObserver((entries) => {
        carouselIsVisible = entries[0].isIntersecting;
        if (carouselIsVisible) startAutoAdvance();
        else stopAutoAdvance();
      }, { threshold: 0.15 });
      carouselVisibilityObserver.observe(carouselContainer);
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

    function updateLightboxImage(direction) {
      const slide = lightboxSlides[lightboxCurrentIndex];
      lightboxImage.classList.remove("lightbox-image--next", "lightbox-image--prev");
      lightboxImage.src = slide.src;
      lightboxImage.alt = slide.alt;
      lightboxCounter.textContent = `${lightboxCurrentIndex + 1} / ${lightboxSlides.length}`;

      if (direction) {
        // Restart the directional animation whenever a lightbox control is used.
        void lightboxImage.offsetWidth;
        lightboxImage.classList.add(`lightbox-image--${direction}`);
      }
    }

    function showPrevLightbox() {
      lightboxCurrentIndex = (lightboxCurrentIndex - 1 + lightboxSlides.length) % lightboxSlides.length;
      updateLightboxImage("prev");
    }

    function showNextLightbox() {
      lightboxCurrentIndex = (lightboxCurrentIndex + 1) % lightboxSlides.length;
      updateLightboxImage("next");
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
