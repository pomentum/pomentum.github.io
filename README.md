# pomentum.github.io

The Pomentum organisation's landing page, published at <https://www.pomentum.dev/>
(the custom domain in `CNAME`; `pomentum.github.io` redirects there).

Plain HTML and CSS. GitHub Pages publishes what the `pages` workflow builds on every push to
`main` (Settings → Pages → Source: GitHub Actions). Edit `index.html` and `style.css`, push to
`main`, and the page is live a minute or two later.
When `style.css` or `theme.js` changes, bump the `?v=` date on their links in `index.html`
and `404.html`: browsers keep them for ten minutes otherwise. Preview
locally with `python -m http.server 8000`.

Each project has its own site under this address, served from its own repository
(<https://www.pomentum.dev/graphos/> from `docs/` of `pomentum/graphos`). Never add a
folder named after a project here: it would compete with that project's site. A card on the
landing page links to each project and uses the project's own README tagline, nothing more.

## Use cases

The use cases, at <https://www.pomentum.dev/use-cases/#/syrmos>, are the one built part. Their
source is `use-cases-site/` (React, TypeScript and Vite); the workflow builds it with `npm ci &&
npm run build` into `use-cases/`, which is not kept in the repository. Build locally to check
a change before pushing it.

## What is published

Only the files the workflow's "Assemble" step copies: the landing page's files and the built
use cases. This README, `AGENTS.md`, `CLAUDE.md` and the use cases' source are never
published. The rules for working here are in [AGENTS.md](AGENTS.md).
