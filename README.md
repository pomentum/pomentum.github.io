# pomentum.github.io

The Pomentum organisation's landing page, published at <https://www.pomentum.dev/>
(the custom domain in `CNAME`; `pomentum.github.io` redirects there).

Plain HTML and CSS. GitHub Pages publishes what the `pages` workflow builds on every push to
`main` (Settings → Pages → Source: GitHub Actions). Edit `index.html` and `style.css`, push to
`main`, and the page is live a minute or two later.
When `style.css` or `theme.js` changes, bump the `?v=` date on their links in `index.html`
and `404.html`: browsers keep them for ten minutes otherwise. Preview
locally with `python -m http.server 8000`.

Each project has its own page under this address. A project whose repository publishes its own
Pages site is served from it (<https://www.pomentum.dev/graphos/> from `docs/` of
`pomentum/graphos`); never add a folder with its name here. Syrmos's repository publishes none,
so its page is built here. A card on the landing page links to each project and uses the
project's own README tagline, nothing more.

## Syrmos

Syrmos's page, at <https://www.pomentum.dev/syrmos/>, with its use cases at
<https://www.pomentum.dev/syrmos/use-cases/>, is the one built part. Its source is `syrmos-site/`
(React, TypeScript and Vite); the workflow builds it with `npm ci && npm run build` into
`syrmos/`, which is not kept in the repository. Build locally to check a change before pushing it.

## What is published

Only the files the workflow's "Assemble" step copies: the landing page's files, Syrmos's built
page, redirects from its first address (`/use-cases/`), and `sitemap.xml` and `llms.txt`. This
README, `AGENTS.md`, `CLAUDE.md` and `syrmos-site/` are never published. The rules for working
here are in [AGENTS.md](AGENTS.md).
