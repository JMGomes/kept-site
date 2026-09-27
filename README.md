# Kept website

The marketing site for Kept, the iOS app that blocks apps by place and time. A static site:
one page, one stylesheet for the page, one for the phone screens, one script. No build step.

## Preview

```
python3 -m http.server 8000
```

Open `http://localhost:8000/`.

## Files

- `index.html`: the page. The phone screens are HTML, drawn at the app's sizes.
- `privacy.html`: the privacy policy.
- `assets/css/site.css`: the page styles.
- `assets/css/screens.css`: the phone frame and the screens.
- `assets/js/site.js`: smooth scroll (Lenis), motion (GSAP, ScrollTrigger, SplitText).
- `assets/glyphs/`: the app's icon set.
- `assets/img/`: favicons from the app icon.

## Deploy

The site is live at https://jmgomes.github.io/kept-site/. GitHub Pages serves the `main`
branch from the repository root. `.nojekyll` keeps Pages from processing the files. Push to
`main` and the site updates within a minute or two.

## Libraries

GSAP 3.13 and Lenis 1 load from jsDelivr. Fonts load from Google Fonts. Nothing else.
