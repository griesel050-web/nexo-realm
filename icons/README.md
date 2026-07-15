# /icons/

This project uses Lucide icons loaded from a CDN — see the `<script>` tag near
the bottom of every page, plus `data-lucide="..."` attributes throughout the
HTML and in `js/projects.js` / `js/socials.js`. No local icon files are needed
for the site to work.

If you'd rather self-host icons (no CDN dependency), download individual SVGs
from https://lucide.dev/icons/ into this folder and swap `<i data-lucide="name">`
elements for `<img src="/icons/name.svg" alt="">` or inline SVG markup.
