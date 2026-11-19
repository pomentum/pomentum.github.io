# pomentum.github.io

The Pomentum organisation's landing page, published at <https://www.pomentum.dev/>
(the custom domain in `CNAME`; `pomentum.github.io` redirects there).

Plain HTML and CSS, no workflow: GitHub Pages serves this repository's `main` branch
(Settings → Pages → Deploy from a branch, `main`, `/ (root)`). Edit
`index.html` and `style.css`, push to `main`, and the page is live a minute later.
When `style.css` or `theme.js` changes, bump the `?v=` date on their links in `index.html`
and `404.html`: browsers keep them for ten minutes otherwise. Preview
locally with `python -m http.server 8000`.

Each project has its own site under this address, served from its own repository
(<https://www.pomentum.dev/graphos/> from `docs/` of `pomentum/graphos`). Never add a
folder named after a project here: it would compete with that project's site. A card on the
landing page links to each project and uses the project's own README tagline, nothing more.

## Use cases

The use cases, at <https://www.pomentum.dev/use-cases/#/syrmos>, are the one built part:
`use-cases/` is written by `npm ci && npm run build` in `use-cases-site/` (React, TypeScript
and Vite). Edit the source, build, and commit both together; never edit `use-cases/` by hand.

## What is published

Pages runs Jekyll only to leave out the files `_config.yml` lists under `exclude`: this
README, `AGENTS.md`, `CLAUDE.md` and `use-cases-site/`. No page has front matter, so every
other file is published as it is. The rules for working here are in [AGENTS.md](AGENTS.md).
