# pomentum.github.io

The Pomentum organisation's landing page, published at <https://www.pomentum.dev/>
(the custom domain in `CNAME`; `pomentum.github.io` redirects there).

Plain HTML and CSS. GitHub Pages publishes what the `pages` workflow builds on every push to
`main` (Settings → Pages → Source: GitHub Actions). Edit `index.html` and `style.css`, push to
`main`, and the page is live a minute or two later.
When `style.css` or `theme.js` changes, bump the `?v=` date on their links in `index.html`
and `404.html`: browsers keep them for ten minutes otherwise. Preview
locally with `python -m http.server 8000`.

Each project has its own page under this address, built here: no project repository publishes
a Pages site of its own (one that did would be served instead of the folder with its name). A card
on the landing page links to each project and uses the project's own README tagline, nothing more.

## Syrmos and graphos

Each project's page is built from its source folder (React, TypeScript and Vite) by
`npm ci && npm run build`, into a folder that is not kept in the repository:

| Page | Source | Built into |
|---|---|---|
| <https://www.pomentum.dev/syrmos/>, its use cases at `/syrmos/use-cases/` | `syrmos-site/` | `syrmos/`, and redirects from its first address in `use-cases/` |
| <https://www.pomentum.dev/graphos/>, its use cases at `/graphos/use-cases/` | `graphos-site/` | `graphos/` |

Build locally to check a change before pushing it.

## What is published

Only the files the workflow's "Assemble" step copies: the landing page's files, the built
`syrmos/`, `use-cases/` and `graphos/`, and one `sitemap.xml` and `llms.txt` at the root, merged
from the two pages' own by `tools/site-index.mjs`. This README, `AGENTS.md`, `CLAUDE.md`, `tools/`
and the pages' source are never published. The rules for working here are in [AGENTS.md](AGENTS.md).
