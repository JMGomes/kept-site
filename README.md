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

The site is live at https://getkeptblocker.app/. The old address, jmgomes.github.io/kept-site,
redirects there, and so does www. GitHub Pages serves the `main` branch from the repository
root; the `CNAME` file names the domain, and the DNS at the registrar points the apex at the
four Pages addresses and www at jmgomes.github.io. `.nojekyll` keeps Pages from processing the files. Push to
`main` and the site updates within a minute or two.

Pages tells browsers to keep every file for ten minutes, and Safari keeps stylesheets and
scripts longer. The asset links in `index.html` and `privacy.html` carry a `?v=N` query. Raise
`N` in every link when a stylesheet or the script changes, so a visitor's browser fetches the
new file with the new page.

## Libraries

GSAP 3.13 and Lenis 1 load from jsDelivr. Fonts load from Google Fonts. Nothing else.

## If the certificate does not arrive

GitHub issues the domain's certificate only after its own DNS check runs, and that check does
not always start by itself. If the site keeps serving the `*.github.io` certificate an hour after
the DNS is right, remove the custom domain in the repository's Pages settings, wait a moment, and
add it back. The check runs at once, and the certificate follows within minutes.
