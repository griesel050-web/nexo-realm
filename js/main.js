/**
 * main.js — shared interactive behavior for every page:
 * sticky nav state, mobile menu, scroll-reveal, animated counters,
 * ambient particles, button ripple, back-to-top, and page transition veil.
 */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky nav border on scroll ---------- */
  function initNavScrollState() {
    var nav = document.querySelector(".nav");
    if (!nav) return;
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    var btn = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");
    if (!btn || !menu) return;

    function close() {
      menu.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function open() {
      menu.classList.add("is-open");
      btn.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    btn.addEventListener("click", function () {
      var isOpen = menu.classList.contains("is-open");
      isOpen ? close() : open();
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initScrollReveal() {
    var targets = document.querySelectorAll(".reveal, .reveal-stagger");
    if (!targets.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-counter"));
      if (isNaN(target)) return;
      if (reduceMotion) {
        el.textContent = target.toLocaleString();
        return;
      }
      var duration = 1400;
      var start = null;
      var suffix = el.getAttribute("data-suffix") || "";

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        var value = Math.round(eased * target);
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animate(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.4 }
      );
      counters.forEach(function (c) { observer.observe(c); });
    } else {
      counters.forEach(animate);
    }
  }

  /* ---------- Ambient particles (lightweight, CSS-driven) ---------- */
  function initParticles() {
    var hosts = document.querySelectorAll("[data-particles]");
    if (!hosts.length || reduceMotion) return;

    hosts.forEach(function (host) {
      var count = parseInt(host.getAttribute("data-particles"), 10) || 14;
      var frag = document.createDocumentFragment();
      for (var i = 0; i < count; i++) {
        var p = document.createElement("span");
        p.className = "particle";
        var size = 2 + Math.random() * 4;
        p.style.width = size + "px";
        p.style.height = size + "px";
        p.style.left = Math.random() * 100 + "%";
        p.style.bottom = "-10%";
        p.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
        p.style.animationDuration = 10 + Math.random() * 14 + "s";
        p.style.animationDelay = Math.random() * 14 + "s";
        frag.appendChild(p);
      }
      host.appendChild(frag);
    });
  }

  /* ---------- Button ripple ---------- */
  function initRipple() {
    document.querySelectorAll(".btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        if (reduceMotion) return;
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement("span");
        var size = Math.max(rect.width, rect.height) * 1.4;
        ripple.className = "ripple";
        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
        ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
        btn.appendChild(ripple);
        ripple.addEventListener("animationend", function () { ripple.remove(); });
      });
    });
  }

  /* ---------- Marquee track duplication (seamless loop) ---------- */
  function initMarquee() {
    document.querySelectorAll("[data-marquee-track]").forEach(function (track) {
      track.innerHTML += track.innerHTML;
    });
  }

  /* ---------- Back to top ---------- */
  function initBackToTop() {
    document.querySelectorAll("[data-back-to-top]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      });
    });
  }

  /* ---------- Current year in footer ---------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Mouse parallax on hero orbit ---------- */
  function initParallax() {
    var stage = document.querySelector("[data-parallax]");
    if (!stage || reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;

    stage.addEventListener("mousemove", function (e) {
      var rect = stage.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      stage.style.setProperty("--px", (x * 14).toFixed(2) + "px");
      stage.style.setProperty("--py", (y * 14).toFixed(2) + "px");
    });
    stage.addEventListener("mouseleave", function () {
      stage.style.setProperty("--px", "0px");
      stage.style.setProperty("--py", "0px");
    });
  }

  /* ---------- Lucide icons ---------- */
  // projects.js / socials.js already re-run this after injecting dynamic
  // cards, but static icons (nav theme toggle, mobile menu, hero, pillars,
  // etc.) exist on every page and were previously only rendered as a side
  // effect of a data fetch — meaning pages with no project/social hooks
  // (About, the 404 page, ...) never got their icons drawn at all.
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    } else {
      // Lucide loads with `defer` and should already be present by the time
      // DOMContentLoaded fires, but if it's ever slow, retry briefly.
      var attempts = 0;
      var timer = setInterval(function () {
        attempts++;
        if (window.lucide && typeof window.lucide.createIcons === "function") {
          window.lucide.createIcons();
          clearInterval(timer);
        } else if (attempts > 20) {
          clearInterval(timer);
        }
      }, 100);
    }
  }

  function init() {
    initIcons();
    initNavScrollState();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initParticles();
    initRipple();
    initMarquee();
    initBackToTop();
    initYear();
    initParallax();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
