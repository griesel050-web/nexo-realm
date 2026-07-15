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
├── contact/index.html      Contact
├── privacy/index.html      Privacy Policy
├── terms/index.html        Terms of Service
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
│   ├── main.js              Nav, mobile menu, reveals, counters, ripple
│   ├── projects.js         Renders project cards from data/projects.json
│   └── socials.js          Renders social cards from data/socials.json
├── data/
│   ├── projects.json       Every project card — edit this, not the HTML
│   └── socials.json        Every social link — ships empty on purpose
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

---

## Before you deploy — replace these placeholders

The brief was explicit about never inventing project details, so a few things are still left as clearly-marked placeholders on purpose:

1. **Project titles, descriptions, categories, tags** — in `data/projects.json`. The four real URLs you gave me are wired in, but their copy is placeholder text ("Replace with project title", etc.) since I don't know what those sites actually do.
2. **Social accounts** — `data/socials.json` ships with an empty `socials` array. Add real accounts and they'll appear automatically on `/socials/` and in the footer.
3. **Contact details** — email, Discord invite, location on `/contact/`. The form itself isn't wired to a destination yet (see below).
4. **Legal pages** — `/privacy/` and `/terms/` are structured starter templates, not legal advice. Have them reviewed before publishing.

The domain is already set to `https://nexorealm.org` across every canonical/OG tag, `robots.txt`, and `sitemap.xml` — no find-and-replace needed there.

---

## Editing `data/projects.json`

Each project is one object in the `projects` array:

```json
{
  "id": "unique-slug",
  "name": "Display Name",
  "url": "https://example.com",
  "category": "Analytics",
  "icon": "layout-dashboard",
  "status": "live",
  "featured": true,
  "title": "Optional longer title",
  "description": "One or two sentences about what it does.",
  "tags": ["SEO", "Free"]
}
```

- `status`: `"live"`, `"beta"`, or `"soon"`.
- `featured`: `true` puts it in the Home marquee/featured grid and the Showcase page.
- `icon`: any [Lucide](https://lucide.dev/icons/) icon name.
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

Supported `platform` values: `discord`, `github`, `youtube`, `tiktok`, `instagram`, `facebook`, `x`, `reddit`, `linkedin`, `twitch`, `email` (use `url: "mailto:you@example.com"`), `website`.

---

## Adding a new page

1. Create `your-page/index.html` (clean-URL folder pattern — Cloudflare Pages serves `folder/index.html` at `/folder/` automatically).
2. Copy the `<head>`, nav, and footer markup from an existing page at the same depth (one folder deep from root) so relative paths (`../css/...`, `../images/...`) match.
3. Add the page to `NAV_ITEMS` if it should appear in navigation — or just link to it from wherever makes sense.
4. Give it a unique `<title>`, meta description, and canonical URL.

If you'd rather not hand-edit HTML, the source `build.py` + `pages_*.py` scripts used to generate this site (Python, not shipped in this folder) show the templating approach — regenerate any page by editing its `pages_*.py` and re-running it.

---

## Updating SEO

- **Per-page metadata** already lives in each page's `<head>` — title, description, canonical, Open Graph, Twitter Card.
- **Sitemap** — `sitemap.xml` lists every route. Add a new `<url>` block when you add a page.
- **Structured data** — the homepage includes a `WebSite` JSON-LD block. Add more (e.g. `Organization`, `BreadcrumbList`) as needed.
- **Images** — all `<img>` tags include `width`/`height` to avoid layout shift; add `loading="lazy"` to any large images you add below the fold.

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

---

## Notes on fonts and icons

This site loads **Space Grotesk** (display), **Inter** (body), and **JetBrains Mono** (utility/data) from Google Fonts, and **Lucide** icons from a CDN (`unpkg.com/lucide`). Both require outbound network access from the visitor's browser — this is normal for any live website, but means these assets won't load if you preview the site in a fully offline/sandboxed environment.
