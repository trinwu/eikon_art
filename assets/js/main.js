document.addEventListener("DOMContentLoaded", function () {
  const loader = document.getElementById("loader");

  // ---------- MOBILE NAV ----------
  const nav = document.querySelector("nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navClose = document.querySelector(".nav-close");
  const navLinks = document.querySelectorAll("nav ul li a");

  if (nav && navToggle) {
    // open/close with hamburger
    navToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // close with ✕ button
    if (navClose) {
      navClose.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    }

    // close when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ---------- LOADER HELPERS ----------
  function showLoader() {
    if (!loader) return;
    loader.classList.remove("hidden");
  }

  function hideLoader() {
    if (!loader) return;
    loader.classList.add("hidden");
  }

  // 🔒 SAFETY: always hide loader after 1.5s even if something breaks
  setTimeout(hideLoader, 1500);

  // ---------- ACTIVE LINK ----------
  function updateActiveLink() {
    const path = window.location.pathname; // e.g. /username/repo/index.html
    const links = document.querySelectorAll("nav a[href]");

    links.forEach((link) => {
      link.classList.remove("active");
      const href = link.getAttribute("href");
      if (!href) return;

      // match /index.html, /about.html, etc.
      if (path.endsWith(href)) {
        link.classList.add("active");
      }

      // handle root like / or /repo/ for index.html
      if (href === "index.html" && (path === "/" || path.endsWith("/"))) {
        link.classList.add("active");
      }
    });
  }

  // ---------- NO BARBA? JUST FALL BACK ----------
  if (typeof barba === "undefined") {
    hideLoader();
    updateActiveLink();
    return;
  }

  // ---------- BARBA SETUP WITH TRY/CATCH ----------
  try {
    barba.init({
      transitions: [
        {
          name: "fade-with-loader",
          sync: true,

          // First page load
          once({ next }) {
            updateActiveLink();
            return fadeIn(next.container).then(() => {
              setTimeout(hideLoader, 800);
            });
          },

          leave({ current }) {
            showLoader();
            return fadeOut(current.container);
          },

          enter({ next }) {
            updateActiveLink();
            return fadeIn(next.container).then(() => {
              setTimeout(hideLoader, 800);
            });
          }
        }
      ]
    });

    barba.hooks.after(() => {
      updateActiveLink();
    });
  } catch (err) {
    console.error("Barba init failed:", err);
    hideLoader();
    updateActiveLink();
  }

  // ---------- FADE HELPERS ----------
  function fadeOut(container) {
    return new Promise((resolve) => {
      container.style.opacity = "1";
      container.style.transition = "opacity 0.25s ease";
      requestAnimationFrame(() => {
        container.style.opacity = "0";
      });
      container.addEventListener("transitionend", resolve, { once: true });
    });
  }

  function fadeIn(container) {
    return new Promise((resolve) => {
      container.style.opacity = "0";
      container.style.transition = "opacity 0.25s ease";
      requestAnimationFrame(() => {
        container.style.opacity = "1";
      });
      container.addEventListener("transitionend", resolve, { once: true });
    });
  }
});
