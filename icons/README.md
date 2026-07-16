# /icons/

- `lucide-sprite.svg` — a self-hosted SVG sprite containing only the ~20 icons this site actually uses, trimmed from the full [Lucide](https://lucide.dev) icon set. Referenced throughout the site as `<svg class="icon" width="N" height="N"><use href="icons/lucide-sprite.svg#name"></use></svg>`. No CDN, no JavaScript library required — it renders the instant the page loads.
- `LUCIDE-LICENSE.txt` — Lucide's ISC license, included for attribution.

Social brand marks (Discord, YouTube, etc.) live separately in `/js/brand-icons.js` as inline SVG path data from Simple Icons, not here.

## Adding a new UI icon

1. Find the icon's name at https://lucide.dev/icons.
2. Get its `<symbol>` markup — the easiest way is `npm install lucide-static` and copy the matching block out of `node_modules/lucide-static/sprite.svg`.
3. Paste that `<symbol>` block inside the `<defs>` in `lucide-sprite.svg`.
4. Reference it anywhere: `<svg class="icon" width="20" height="20"><use href="icons/lucide-sprite.svg#your-icon-name"></use></svg>` (use `../icons/...` from any page one folder deep).
