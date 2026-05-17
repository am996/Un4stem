document.addEventListener("DOMContentLoaded", () => {
  // Fade IN on load
  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });

  // View Switcher Logic
  const viewToggles = document.querySelectorAll(".view-toggle-link");
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  
  // MIGRATION: One-time clear of stuck views for version 1.1.1
  const currentVersion = "1.1.1";
  if (localStorage.getItem("view-logic-version") !== currentVersion) {
    localStorage.removeItem("forced-view");
    localStorage.setItem("view-logic-version", currentVersion);
  }

  const updateViewUI = (isForced) => {
    viewToggles.forEach(btn => {
      if (window.innerWidth <= 900) {
        btn.textContent = isForced ? "Swap to Mobile" : "Swap to Computer";
      } else {
        btn.textContent = isForced ? "Swap to Computer" : "Swap to Mobile";
      }
    });
  };

  const applyView = () => {
    const forcedView = localStorage.getItem("forced-view");
    if (forcedView === "mobile" && window.innerWidth > 900) {
      document.body.classList.add("forced-mobile");
      updateViewUI(true);
    } else if (forcedView === "desktop" && window.innerWidth <= 900) {
      // Removed fixed width scaling that caused "zoomed in" feel
      updateViewUI(true);
    } else {
      document.body.classList.remove("forced-mobile");
      updateViewUI(false);
    }
  };

  viewToggles.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const current = localStorage.getItem("forced-view");
      localStorage.setItem("forced-view", current === "mobile" || current === "desktop" ? "default" : (window.innerWidth > 900 ? "mobile" : "desktop"));
      applyView();
    });
  });
  applyView();

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