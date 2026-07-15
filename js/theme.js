/**
 * theme.js — dark/light mode toggle.
 * The anti-flash bootstrap (reading localStorage and setting [data-theme]
 * before first paint) lives inline in <head> on every page — see the
 * `<script>` block right after <meta charset>. This file only wires up the
 * toggle button once the DOM is ready.
 */
(function () {
  "use strict";

  function initThemeToggle() {
    var toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;

    toggle.addEventListener("click", function () {
      var root = document.documentElement;
      var current = root.getAttribute("data-theme") || "dark";
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        window.localStorage.setItem("nexorealm-theme", next);
      } catch (err) {
        /* localStorage unavailable (private mode) — theme just won't persist */
      }
      toggle.setAttribute("aria-pressed", String(next === "light"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
