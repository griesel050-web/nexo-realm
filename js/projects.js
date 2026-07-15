/**
 * projects.js — single source of truth is /data/projects.json.
 * Renders: home "featured" grid + marquee + stats counters, and the full
 * Projects page grid with live search, category filter, and sorting.
 * Nothing here is hardcoded — add a project by editing the JSON only.
 */
(function () {
  "use strict";

  var DATA_URL = getDataPath("data/projects.json");

  function getDataPath(rel) {
    // Pages live at /, /projects/, /about/, etc. so the JSON is always
    // one level up from any non-root page.
    var depth = window.location.pathname.split("/").filter(Boolean);
    var isRoot = depth.length === 0 || (depth.length === 1 && depth[0].includes("."));
    return (isRoot ? "" : "../") + rel;
  }

  function statusBadge(status) {
    var map = {
      live: { cls: "badge--live", label: "Live" },
      beta: { cls: "badge--beta", label: "Beta" },
      soon: { cls: "badge--soon", label: "Coming soon" }
    };
    var m = map[status] || { cls: "", label: status };
    return '<span class="badge ' + m.cls + '"><span class="orbit-mini"><span class="orbit-mini__dot"></span></span>' + m.label + "</span>";
  }

  function cardHTML(p) {
    var tags = (p.tags || [])
      .map(function (t) { return '<span class="tag">' + escapeHTML(t) + "</span>"; })
      .join("");
    var isSoon = p.status === "soon";
    var linkAttrs = isSoon ? "" : ' target="_blank" rel="noopener noreferrer"';
    var href = isSoon ? "javascript:void(0)" : p.url;

    return (
      '<article class="card project-card' + (isSoon ? " project-card--soon" : "") + '" data-name="' + escapeHTML(p.name.toLowerCase()) +
      '" data-category="' + escapeHTML((p.category || "").toLowerCase()) + '" data-status="' + p.status + '">' +
      '<div class="project-card__top">' +
      '<div class="project-card__icon"><i data-lucide="' + (p.icon || "globe") + '" aria-hidden="true"></i></div>' +
      statusBadge(p.status) +
      "</div>" +
      '<div><div class="project-card__name">' + escapeHTML(p.name) + '</div><div class="project-card__category">' + escapeHTML(p.category || "") + "</div></div>" +
      '<p class="project-card__desc">' + escapeHTML(p.description || "") + "</p>" +
      '<div class="project-card__tags">' + tags + "</div>" +
      '<div class="project-card__footer">' +
      '<span class="tag" style="border:none;padding:0;color:var(--ink-faint)">' + escapeHTML(hostname(p.url)) + "</span>" +
      (isSoon
        ? '<span class="project-card__link" aria-disabled="true">Notify me <i data-lucide="bell" aria-hidden="true"></i></span>'
        : '<a class="project-card__link" href="' + href + '"' + linkAttrs + '>Visit <i data-lucide="arrow-up-right" aria-hidden="true"></i></a>') +
      "</div>" +
      "</article>"
    );
  }

  function hostname(url) {
    try { return new URL(url).hostname; } catch (e) { return url; }
  }

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

  function renderHome(projects) {
    var featuredHost = document.querySelector("[data-featured-projects]");
    var marqueeHost = document.querySelector("[data-marquee-track]");
    var statProjects = document.querySelector("[data-stat-projects]");
    var statLive = document.querySelector("[data-stat-live]");

    var featured = projects.filter(function (p) { return p.featured; });
    if (featuredHost) {
      var list = featured.length ? featured : projects;
      featuredHost.innerHTML = list.slice(0, 3).map(cardHTML).join("");
    }
    if (marqueeHost) {
      marqueeHost.innerHTML = projects
        .map(function (p) {
          return (
            '<div class="card card--glass marquee-card">' +
            '<div class="project-card__icon" style="margin-bottom:12px"><i data-lucide="' + (p.icon || "globe") + '" aria-hidden="true"></i></div>' +
            '<div class="project-card__name">' + escapeHTML(p.name) + "</div>" +
            '<div class="project-card__category">' + escapeHTML(p.category || "") + "</div>" +
            "</div>"
          );
        })
        .join("");
    }
    if (statProjects) statProjects.setAttribute("data-counter", String(projects.length));
    if (statLive) statLive.setAttribute("data-counter", String(projects.filter(function (p) { return p.status === "live"; }).length));

    refreshIcons();
    document.dispatchEvent(new CustomEvent("nexo:counters-ready"));
  }

  function renderProjectsPage(projects) {
    var grid = document.querySelector("[data-projects-grid]");
    var emptyState = document.querySelector("[data-projects-empty]");
    var searchInput = document.querySelector("[data-projects-search]");
    var sortSelect = document.querySelector("[data-projects-sort]");
    var chips = document.querySelectorAll("[data-category-chip]");
    if (!grid) return;

    var state = { query: "", category: "all", sort: "featured" };

    function apply() {
      var filtered = projects.filter(function (p) {
        var matchesQuery =
          !state.query ||
          p.name.toLowerCase().includes(state.query) ||
          (p.description || "").toLowerCase().includes(state.query) ||
          (p.tags || []).join(" ").toLowerCase().includes(state.query);
        var matchesCategory = state.category === "all" || (p.category || "").toLowerCase() === state.category;
        return matchesQuery && matchesCategory;
      });

      filtered.sort(function (a, b) {
        if (state.sort === "name") return a.name.localeCompare(b.name);
        if (state.sort === "status") return a.status.localeCompare(b.status);
        // featured first, then live before soon
        var fa = a.featured ? 0 : 1;
        var fb = b.featured ? 0 : 1;
        if (fa !== fb) return fa - fb;
        return a.name.localeCompare(b.name);
      });

      grid.innerHTML = filtered.map(cardHTML).join("");
      grid.classList.toggle("visually-hidden", filtered.length === 0);
      if (emptyState) emptyState.hidden = filtered.length !== 0;
      refreshIcons();
    }

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        state.query = searchInput.value.trim().toLowerCase();
        apply();
      });
    }
    if (sortSelect) {
      sortSelect.addEventListener("change", function () {
        state.sort = sortSelect.value;
        apply();
      });
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        chips.forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        chip.setAttribute("aria-pressed", "true");
        state.category = chip.getAttribute("data-category-chip").toLowerCase();
        apply();
      });
    });

    apply();
  }

  function renderShowcase(projects) {
    var host = document.querySelector("[data-showcase-grid]");
    if (!host) return;
    var featured = projects.filter(function (p) { return p.featured; });
    var list = featured.length ? featured : projects;
    host.innerHTML = list.map(cardHTML).join("");
    refreshIcons();
  }

  function buildCategoryChips(projects) {
    var host = document.querySelector("[data-category-chips]");
    if (!host) return;
    var categories = Array.from(new Set(projects.map(function (p) { return p.category; }).filter(Boolean)));
    var chips = ['<button class="chip" data-category-chip="all" aria-pressed="true">All</button>'];
    categories.forEach(function (c) {
      chips.push('<button class="chip" data-category-chip="' + escapeHTML(c) + '" aria-pressed="false">' + escapeHTML(c) + "</button>");
    });
    host.innerHTML = chips.join("");
  }

  function init() {
    var needsProjects = document.querySelector(
      "[data-featured-projects], [data-projects-grid], [data-marquee-track], [data-stat-projects], [data-showcase-grid]"
    );
    if (!needsProjects) return;

    fetch(DATA_URL)
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load projects.json (" + res.status + ")");
        return res.json();
      })
      .then(function (data) {
        var projects = data.projects || [];
        renderHome(projects);
        buildCategoryChips(projects);
        renderProjectsPage(projects);
        renderShowcase(projects);
      })
      .catch(function (err) {
        console.error("[Nexo Realm] projects.json:", err);
        var grid = document.querySelector("[data-projects-grid]");
        if (grid) {
          grid.innerHTML =
            '<div class="empty-state"><p><strong>Projects failed to load.</strong></p><p>Check that <code>/data/projects.json</code> is reachable.</p></div>';
        }
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
