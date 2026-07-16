# Nexo Realm

The central hub connecting every current and future Nexo project, tool, and social profile — a static, dependency-free site built for Cloudflare Pages.

---

## Folder structure

```
nexorealm/
├── index.html              Home
├── about/index.html        About
├── projects/index.html     Projects (search/filter/sort)
│   ├── app-nexorealm/      Individual project detail page
│   ├── boost-nexorealm/    Individual project detail page
│   ├── list-nexosites/     Individual project detail page
│   └── nexosites/          Individual project detail page
├── socials/index.html      Socials
├── showcase/index.html     Showcase
├── changelog/index.html    What's new — generated from data/changelog.json
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
│   ├── brand-icons.js      Self-hosted social brand icon SVG path data
│   ├── projects.js         Project cards, live status check, detail pages
│   ├── socials.js          Renders social cards from data/socials.json
│   └── changelog.js        Renders the changelog + Home's updates strip
├── icons/
│   ├── lucide-sprite.svg   Self-hosted UI icon sprite (trimmed Lucide subset)
│   └── LUCIDE-LICENSE.txt  Lucide's ISC license
├── data/
│   ├── projects.json       Every project card — edit this, not the HTML
│   ├── socials.json        Every social link — edit this, not the HTML
│   └── changelog.json      Every changelog entry — edit this, not the HTML
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

## Icons — fully self-hosted, no CDN

Every icon on this site renders from files shipped in this repo — nothing is loaded from a third-party icon CDN, so nothing can be blocked by an ad-blocker, fail from a slow CDN, or race against a script tag that hasn't finished loading yet (all real bugs the earlier CDN-based version hit).

1. **UI icons** (nav, theme toggle, buttons, pillars, arrows, search, etc.) are `<svg><use></svg>` references into `/icons/lucide-sprite.svg` — a single small SVG file trimmed to just the ~20 icons this site actually uses, built from [Lucide](https://lucide.dev) (ISC license, `icons/LUCIDE-LICENSE.txt`). These render immediately on page load with zero JavaScript required.
2. **Social brand marks** (Discord, YouTube, TikTok, etc.) are inlined directly as `<path>` data in `js/brand-icons.js`, sourced from [Simple Icons](https://simpleicons.org) (CC0 license). No image request, no CDN — the SVG paints the instant the card renders. LinkedIn's mark was removed from Simple Icons after a takedown request, so it falls back to a generic sprite icon instead.
3. **Project favicons** (project cards, marquee, detail pages) are the one place that still reaches out to the network, since we're pulling *their* real, live favicon: it tries `favicon` from `projects.json` if set, otherwise guesses `https://{domain}/favicon.ico`, then falls back to a generic sprite icon if that fails. (An earlier version also tried Google's favicon service as a second attempt — removed, because Google's service almost never actually fails: it returns a generic placeholder image even for domains with no favicon, which silently showed the wrong logo instead of a clear failure.)

To add a new UI icon: find its name at [lucide.dev/icons](https://lucide.dev/icons), then add its `<symbol>` block from `lucide-static`'s full sprite into `icons/lucide-sprite.svg`. To add a new social brand: pull its `{ hex, path }` from the `simple-icons` npm package into `js/brand-icons.js`.

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
  "favicon": "",
  "status": "live",
  "featured": true,
  "title": "Optional longer title",
  "description": "One or two sentences about what it does.",
  "tags": ["free", "tools"]
}
```

- `status`: `"live"`, `"beta"`, or `"soon"` — shown exactly as set, see the note below on why this isn't dynamically checked.
- `featured`: `true` puts it in the Home marquee/featured grid and the Showcase page.
- `icon`: a [Lucide](https://lucide.dev/icons/) name — only used as a fallback if the site's real favicon fails to load.
- `favicon` (optional): an exact favicon URL. By default the site guesses `https://{domain}/favicon.ico` — if a project's icon actually lives somewhere else, set this and it'll be used instead of the guess.
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

## Project status

`projects.json`'s `status` field (`"live"`, `"beta"`, or `"soon"`) is shown as-is, manually declared by you. An earlier version of this site tried to dynamically check whether "live" projects were actually reachable, using a project's favicon as a proxy signal. That turned out to be a bad idea and was removed: plenty of live, healthy sites don't serve a favicon at the conventional `/favicon.ico` path, so the check produced false "Unreachable" labels on sites that were completely fine. A static site's JavaScript has no CORS-safe way to read a real HTTP status from an arbitrary third-party domain — there's no reliable client-side substitute for an actual uptime monitor — so rather than keep a heuristic that looked confident but was often just wrong, the status field is back to being exactly what you put in the JSON.

## Changelog / What's new

`/changelog/` and a "Latest updates" strip on Home are both generated from `data/changelog.json`, newest-first. It ships empty on purpose (see its `_documentation` key) — add an entry as you actually ship something:

```json
{ "date": "2026-07-16", "title": "Added Nexo Rank", "description": "A free SEO monitoring dashboard.", "tags": ["Nexo Rank", "New project"] }
```

The Home strip and the nav/footer "Changelog" link both stay hidden until at least one entry exists — no fake "coming soon" placeholder.

## Individual project pages

Every project in `projects.json` now gets its own page at `/projects/{id}/` — e.g. `/projects/app-nexorealm/` — generated at build time from the same JSON (see `pages_project_detail.py`). Each one has its own unique title/meta description/canonical URL (better for SEO than one shared card), the same live favicon + status check, and a "Visit" button linking out to the real site. Project card names on `/projects/`, Home, and Showcase now link to these pages; the external "Visit" link on each card still goes straight to the live site.

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
