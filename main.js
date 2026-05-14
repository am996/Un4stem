document.addEventListener("DOMContentLoaded", () => {
  // Fade IN on load
  requestAnimationFrame(() => {
    document.body.classList.add("loaded");
  });

  // Fade OUT on navigation for internal links
  document.querySelectorAll("a").forEach(link => {
    const href = link.getAttribute("href");

    // Only apply to internal links that are not anchors or external URLs
    if (!href || href.startsWith("#") || href.startsWith("http")) return;

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