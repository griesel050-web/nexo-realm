# Nexo Realm

The central hub connecting every current and future Nexo project, tool, and social profile — a static, dependency-free site built for Cloudflare Pages.

---

## Folder structure

```
nexorealm/
├── index.html              Home
├── about/index.html        About
├── projects/index.html     Projects (search/filter/sort)
├── socials/index.html      Socials
├── showcase/index.html     Showcase
├── 404.html                Cloudflare's auto-detected 404 page
├── 404/index.html          Same 404 page at a clean /404/ URL
├── css/
│   ├── tokens.css          Colors, type scale, spacing, motion timing
│   ├── base.css            Reset + global element styles
│   ├── components.css      Nav, footer, buttons, cards, forms, badges
│   ├── animations.css      Scroll reveal, the orbit signature, particles
│   └── pages.css           Page-specific layout (hero, grids, sections)
├── js/
│   ├── theme.js            Dark/light toggle (localStorage)
│   ├── main.js              Nav, mobile menu, reveals, counters, ripple, icons
│   ├── projects.js         Renders project cards from data/projects.json
│   └── socials.js          Renders social cards from data/socials.json
├── data/
│   ├── projects.json       Every project card — edit this, not the HTML
│   └── socials.json        Every social link — edit this, not the HTML
├── images/
│   ├── logo.png            Nav/footer logo (cropped from your upload)
│   ├── og-image.jpg        Social share preview image
│   └── favicons/           Full favicon set generated from your logo
├── favicon.ico
├── manifest.json
├── robots.txt
├── sitemap.xml
├── _headers                Cloudflare Pages caching + security headers
└── README.md
```

No build step. No framework. Every page is plain HTML, CSS, and JS.

The Contact, Privacy Policy, and Terms of Service pages have been removed, along with every link to them in the nav and footer.

---

## Icons — how they actually load

Three different icon sources are in play, on purpose:

1. **Project cards & the marquee** pull each project's **real favicon** live from `https://www.google.com/s2/favicons?domain=...` — not a generic icon. If a favicon ever fails to load, it falls back to a small Lucide icon (the `icon` field in `projects.json`).
2. **Social cards & footer links** use real **brand logos** from [Simple Icons](https://simpleicons.org) (`cdn.simpleicons.org`), since Lucide doesn't carry brand marks like Discord or TikTok. Same fallback pattern if one 404s.
3. **Everything else** (nav theme toggle, menu button, arrows, search, pillar icons, etc.) uses **Lucide**, loaded from `unpkg.com` and rendered by `js/main.js` on every single page load — this used to only run on pages that also fetched project/social data, which is why icons were missing on About and a few other pages. Fixed now: `initIcons()` runs unconditionally.

All three depend on outbound network access from the visitor's browser (Google's favicon service, Simple Icons' CDN, unpkg, Google Fonts) — normal for any live site, but they won't resolve if you preview this in a fully offline sandbox.

---

## Editing `data/projects.json`

Each project is one object in the `projects` array:

```json
{
  "id": "unique-slug",
  "name": "Display Name",
  "url": "https://example.com",
  "category": "Tools",
  "icon": "layout-dashboard",
  "status": "live",
  "featured": true,
  "title": "Optional longer title",
  "description": "One or two sentences about what it does.",
  "tags": ["free", "tools"]
}
```

- `status`: `"live"`, `"beta"`, or `"soon"`.
- `featured`: `true` puts it in the Home marquee/featured grid and the Showcase page.
- `icon`: a [Lucide](https://lucide.dev/icons/) name — only used as a fallback if the site's real favicon fails to load.
- Categories are read automatically — add a new one and a filter chip appears on `/projects/` with no other changes needed.

## Editing `data/socials.json`

```json
{
  "platform": "github",
  "handle": "@your-handle",
  "url": "https://github.com/your-handle",
  "icon": "github"
}
```

Supported `platform` values: `discord`, `github`, `youtube`, `tiktok`, `instagram`, `facebook`, `x`, `reddit`, `linkedin`, `twitch`, `email` (use `url: "mailto:you@example.com"`), `website`. The `icon` field should be a [Simple Icons](https://simpleicons.org) slug (matches the platform name in almost every case).

---

## Adding a new page

1. Create `your-page/index.html` (clean-URL folder pattern — Cloudflare Pages serves `folder/index.html` at `/folder/` automatically).
2. Copy the `<head>`, nav, and footer markup from an existing page at the same depth (one folder deep from root) so relative paths (`../css/...`, `../images/...`) match.
3. Add the page to `NAV_ITEMS` if it should appear in navigation — or just link to it from wherever makes sense.
4. Give it a unique `<title>`, meta description, canonical URL, and add it to `sitemap.xml`.

If you'd rather not hand-edit HTML, the source `build.py` + `pages_*.py` scripts used to generate this site (Python, not shipped in this folder) show the templating approach — regenerate any page by editing its `pages_*.py` and re-running it.

---

## SEO — what's already in place

- **Per-page metadata**: unique title, description, canonical URL, keywords, author, and a `robots` tag with `max-image-preview:large` / `max-snippet:-1` on every page.
- **Open Graph + Twitter Cards**: full tag set including `og:locale`, `og:image:alt`, and a generated 1200×630 share image (`images/og-image.jpg`).
- **Structured data (JSON-LD)**:
  - Every page: an `Organization` schema with your logo and a `sameAs` array pulled directly from `data/socials.json` — add an account there and it's automatically included here too.
  - Home: a `WebSite` schema.
  - Projects: an `ItemList` of `SoftwareApplication` entries, generated from the real names, URLs, categories, and descriptions in `data/projects.json`.
- **Meta descriptions** on Projects and Showcase name the actual projects (pulled from the JSON at build time) rather than generic copy — better for keyword relevance.
- **Sitemap** (`sitemap.xml`) lists every live route with `lastmod`. **Update the date whenever content changes**, and add a `<url>` block when you add a page.
- **robots.txt** allows full crawling and points to the sitemap.
- **PWA/platform meta**: `manifest.json`, Apple touch icons, `apple-mobile-web-app-title`, MS tile meta, and a full favicon set.
- **Performance-adjacent SEO**: every `<img>` has explicit `width`/`height` (no layout shift), `loading="lazy"` on below-the-fold images, and `preconnect` hints for every third-party origin in use (fonts, unpkg, Simple Icons, Google favicons).

To push further: add a real Search Console verification meta tag once you have one, and update `sitemap.xml`'s `lastmod` dates whenever you edit `projects.json` or `socials.json`.

---

## Deploying to Cloudflare Pages

1. Push this folder to a GitHub repo (or connect it directly).
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings: **no build command**, output directory = `/` (the repo root, since this is already static output).
4. Deploy. Clean URLs work automatically because every route is a folder containing `index.html`.
5. `_headers` is picked up automatically by Cloudflare Pages for caching and security headers.

---

## Customizing colors

Every color is a CSS variable in `css/tokens.css`. The core ramp:

| Variable | Use |
|---|---|
| `--red-400` / `--red-500` / `--red-600` | Brand red, gradients, glow |
| `--bg` / `--bg-elevated` / `--bg-elevated-2` | Dark-mode surfaces |
| `--ink` / `--ink-dim` / `--ink-faint` | Text hierarchy |

`[data-theme="light"]` overrides the surface and ink variables for light mode — edit that block to adjust the light theme without touching dark mode.

---

## Updating animations

- **The Orbit** (hero signature, `.orbit` in `css/animations.css`) — a core node with three satellites rotating on rings, echoing the ring in your logo. Adjust `animation-duration` on `.orbit__satellite-wrap--a/b/c` to speed up or slow down.
- **Scroll reveal** — add `class="reveal"` (single fade-in) or `class="reveal-stagger"` (staggered children) to any element; `js/main.js` handles the rest via `IntersectionObserver`.
- **Reduced motion** — every animation is disabled under `prefers-reduced-motion: reduce` (see the bottom of `animations.css`).
- **Lottie** — no Lottie files are bundled (none were supplied, and the brief asked not to invent assets), so the current motion is done with CSS/SVG instead. To add real Lottie animations later: drop `.json` files in `/lottie/`, include `lottie-web` from a CDN, and target a container `<div>` with `lottie.loadAnimation(...)`.
