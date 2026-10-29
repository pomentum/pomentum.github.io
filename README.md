# pomentum.github.io

The Pomentum organisation's landing page, published at <https://www.pomentum.dev/>
(the custom domain in `CNAME`; `pomentum.github.io` redirects there).

Plain HTML and CSS, no build and no workflow: GitHub Pages serves this repository's `main`
branch as it is (Settings → Pages → Deploy from a branch, `main`, `/ (root)`). Edit
`index.html` and `style.css`, push to `main`, and the page is live a minute later.
When `style.css` or `theme.js` changes, bump the `?v=` date on their links in `index.html`
and `404.html`: browsers keep them for ten minutes otherwise. Preview
locally with `python -m http.server 8000`.

Each project has its own site under this address, served from its own repository
(<https://www.pomentum.dev/graphos/> from `docs/` of `pomentum/graphos`). Never add a
folder named after a project here: it would compete with that project's site. A card on the
landing page links to each project and uses the project's own README tagline, nothing more.
