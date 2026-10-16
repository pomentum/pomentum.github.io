# pomentum.github.io

The Pomentum organisation's landing page, published at <https://pomentum.github.io/>.

Plain HTML and CSS, no build and no workflow: GitHub Pages serves this repository's `main`
branch as it is (Settings → Pages → Deploy from a branch, `main`, `/ (root)`). Edit
`index.html` and `style.css`, push to `main`, and the page is live a minute later. Preview
locally with `python -m http.server 8000`.

Each project has its own site under this address, served from its own repository
(<https://pomentum.github.io/graphos/> from `docs/` of `pomentum/graphos`). Never add a
folder named after a project here: it would compete with that project's site. A card on the
landing page links to each project and uses the project's own README tagline, nothing more.
