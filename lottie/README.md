# /lottie/

No Lottie animation files are bundled — none were supplied, and this project's
"real data only" principle extends to assets too, so nothing was invented.

Motion on this site is currently done with CSS/SVG (see css/animations.css —
the orbit signature, particles, and scroll reveals are all pure CSS).

To add a real Lottie animation later:

1. Export a `.json` animation (e.g. from After Effects + Bodymovin, or from
   https://lottiefiles.com).
2. Drop it in this folder, e.g. `/lottie/loading.json`.
3. Include the player once, near the bottom of the page:
   `<script src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js" defer></script>`
4. Target a container element:
   `lottie.loadAnimation({ container: el, path: "/lottie/loading.json", renderer: "svg", loop: true, autoplay: true });`
