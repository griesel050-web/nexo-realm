/**
 * socials.js — single source of truth is /data/socials.json.
 * The file ships empty on purpose (see its "_documentation" key). This
 * script renders whatever is there, and shows an honest empty state
 * with instructions instead of ever inventing placeholder accounts.
 */
(function () {
  "use strict";

  function getDataPath(rel) {
    var depth = window.location.pathname.split("/").filter(Boolean);
    var isRoot = depth.length === 0 || (depth.length === 1 && depth[0].includes("."));
    return (isRoot ? "" : "../") + rel;
  }

  var DATA_URL = getDataPath("data/socials.json");

  var PLATFORM_LABEL = {
    discord: "Discord", github: "GitHub", youtube: "YouTube", tiktok: "TikTok",
    instagram: "Instagram", facebook: "Facebook", x: "X", reddit: "Reddit",
    linkedin: "LinkedIn", twitch: "Twitch", email: "Email", website: "Website"
  };

  function escapeHTML(str) {
    var div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function socialCardHTML(s) {
    return (
      '<a class="card social-card" href="' + s.url + '" target="_blank" rel="noopener noreferrer">' +
      '<div class="social-card__icon"><i data-lucide="' + (s.icon || "globe") + '" aria-hidden="true"></i></div>' +
      "<div>" +
      '<div class="social-card__platform">' + escapeHTML(PLATFORM_LABEL[s.platform] || s.platform) + "</div>" +
      '<div class="social-card__handle">' + escapeHTML(s.handle || "") + "</div>" +
      "</div>" +
      "</a>"
    );
  }

  function footerSocialHTML(s) {
    return (
      '<a href="' + s.url + '" target="_blank" rel="noopener noreferrer" aria-label="' +
      escapeHTML((PLATFORM_LABEL[s.platform] || s.platform) + ": " + (s.handle || "")) + '">' +
      escapeHTML(PLATFORM_LABEL[s.platform] || s.platform) +
      "</a>"
    );
  }

  function renderSocialsPage(socials) {
    var grid = document.querySelector("[data-socials-grid]");
    var emptyState = document.querySelector("[data-socials-empty]");
    if (!grid) return;

    if (!socials.length) {
      grid.hidden = true;
      if (emptyState) emptyState.hidden = false;
      return;
    }
    grid.hidden = false;
    if (emptyState) emptyState.hidden = true;
    grid.innerHTML = socials.map(socialCardHTML).join("");
    refreshIcons();
  }

  function renderFooterSocials(socials) {
    var host = document.querySelector("[data-footer-socials]");
    if (!host) return;
    if (!socials.length) {
      host.innerHTML = '<span>None added yet</span>';
      return;
    }
    host.innerHTML = socials.map(footerSocialHTML).join("");
  }

  function init() {
    var needsSocials = document.querySelector("[data-socials-grid], [data-footer-socials]");
    if (!needsSocials) return;

    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load socials.json (" + res.status + ")");
        return res.json();
      })
      .then(function (data) {
        var socials = data.socials || [];
        renderSocialsPage(socials);
        renderFooterSocials(socials);
      })
      .catch(function (err) {
        console.error("[Nexo Realm] socials.json:", err);
        renderFooterSocials([]);
        var emptyState = document.querySelector("[data-socials-empty]");
        if (emptyState) emptyState.hidden = false;
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
