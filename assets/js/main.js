document.addEventListener("DOMContentLoaded", function () {
    const loader = document.getElementById("loader");

    // mobile nav toggler
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
      navLinks.forEach(link => {
        link.addEventListener("click", () => {
          nav.classList.remove("nav-open");
          navToggle.setAttribute("aria-expanded", "false");
        });
      });
    }

    function showLoader() {
      if (!loader) return;
      loader.classList.remove("hidden");
    }
  
    function hideLoader() {
      if (!loader) return;
      loader.classList.add("hidden");
    }
  
    // Highlight the current nav link based on URL
    function updateActiveLink() {
      const path = window.location.pathname; // e.g. "/folder/home.html"
      const links = document.querySelectorAll("nav a[href]");
  
      links.forEach((link) => {
        link.classList.remove("active");
        const href = link.getAttribute("href");
  
        if (!href) return;
  
        // If the current path ends with the link's href (home.html, about.html, etc.)
        if (path.endsWith(href)) {
          link.classList.add("active");
        }
      });
    }
  
    // If Barba isn't loaded, just hide loader + set active link and stop
    if (typeof barba === "undefined") {
      hideLoader();
      updateActiveLink();
      return;
    }
  
    barba.init({
      transitions: [
        {
          name: "fade-with-loader",
          sync: true,
  
          // First page load
          once({ next }) {
            updateActiveLink();
            return fadeIn(next.container).then(() => {
              setTimeout(hideLoader, 800); // loader stays a bit
            });
          },
  
          leave({ current }) {
            showLoader();
            return fadeOut(current.container);
          },
  
          enter({ next }) {
            return fadeIn(next.container).then(() => {
              setTimeout(hideLoader, 800);
            });
          }
        }
      ]
    });
  
    // After every transition, make sure active link is updated
    barba.hooks.after(() => {
      updateActiveLink();
    });
  
    // Helper animations
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
  