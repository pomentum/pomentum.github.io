# Working in this repository

This repository is the Pomentum organisation's website at <https://www.pomentum.dev/>. GitHub Pages publishes what the `pages`
workflow (`.github/workflows/pages.yml`) builds on every push to `main`; the site is live a minute or two later.

## What is here

| Path | What it is | How it changes |
|---|---|---|
| `index.html`, `style.css`, `theme.js`, `404.html` | The landing page: plain HTML and CSS, a card per project | Edited by hand |
| `syrmos-site/` | The source of Syrmos's page at `/syrmos/`: React, TypeScript and Vite, its use cases in `content/` | Edited by hand |
| `graphos-site/` | The source of graphos's page at `/graphos/`, the same app with graphos's content | Edited by hand |
| `syrmos/`, `use-cases/`, `graphos/` | Built from the two: the pages, and redirects from Syrmos's first address; not in the repository | By `npm run build` in each, locally or in the workflow |
| `tools/site-index.mjs` | Merges the two pages' `sitemap.xml` and `llms.txt` into the root's; never published | Edited by hand |
| `.github/workflows/pages.yml` | Builds both pages and publishes the site | Edited by hand |

## Rules

- **Only the site is public.** The workflow publishes only the files its "Assemble" step copies: the landing page's files, the
  built `syrmos/`, `use-cases/` and `graphos/`, and `sitemap.xml` and `llms.txt` at the root. This file, `CLAUDE.md`,
  `README.md`, `tools/`, `syrmos-site/` and `graphos-site/` are never published. A new public file must be added to that step,
  or it will not be on the site.
- **Every project's page is built here.** A project repository that publishes a Pages site of its own is served at
  `/<project>/` instead of the folder here, so none does: graphos's page moved here from its repository's `docs/`.
- **The landing page:** a card per project, using the project's own README tagline. When `style.css` or `theme.js` changes,
  bump the `?v=` date on their links in `index.html` and `404.html`.
- **A project's page:** edit `syrmos-site/` or `graphos-site/` and commit the source alone; the workflow builds and publishes
  it. Build locally to check it first; never commit `syrmos/`, `use-cases/` or `graphos/`.

  ```bash
  cd syrmos-site     # or graphos-site
  npm ci
  npm run build      # type check, then the page in ../syrmos/ (and the redirects in ../use-cases/), or in ../graphos/
  ```

  Preview the whole site as Pages serves it with `python -m http.server 8000` at the root, then open
  <http://localhost:8000/syrmos/> or <http://localhost:8000/graphos/>.
- **graphos's version:** its page reads graphos's latest GitHub release for the version line and "Latest"; the statuses keep
  the release in `graphos-site/content/version.ts`, the one its use cases were checked against. Change that line only after
  checking the page against a new release.
- **Their addresses:** `/syrmos/` and `/graphos/` are the animated app (`#/use-cases/<use case>/<step>`, `#/how`; graphos's
  also `#/<section>`, and its old single page's anchors such as `#benchmarks`). Below, Syrmos's; graphos's are the same
  under `/graphos/`, with `/graphos/overview/` for its sections.
- **Syrmos's addresses:** `/syrmos/` is the animated app (`#/use-cases/<use case>/<step>`, `#/how`). For search engines and AI tools,
  `npm run build` also writes a plain page per use case at `/syrmos/use-cases/<use case>/`, the list at `/syrmos/use-cases/`
  How it works at `/syrmos/how/` and the first screen written out at `/syrmos/overview/` (`syrmos-site/scripts/prerender.mjs`),
  and `sitemap.xml` and `llms.txt`. They come from the same content files; never edit them by hand. The first addresses,
  `/use-cases/...`, redirect to these.
- **The link previews** are `syrmos-site/public/og.png` and `graphos-site/public/og.png`, a picture of each page's first screen.
  When a first screen changes, serve the site locally, run `node scripts/og-image.mjs` in that page's folder, and build again.
- **Syrmos's walkthroughs:** eight, one per problem a reader has (`syrmos-site/content/walkthroughs.ts`), each step drawn from an
  earlier walkthrough's checked diagram and showing the status of what shows it, never a better one. The earlier walkthroughs'
  addresses redirect to the step that holds them (`redirects` in `syrmos-site/content/index.ts`); an address with none opens the
  site's 404 page.
- **What the use cases may say:** facts only from the project's `main` branch. Each use case carries a status (Shown, Target,
  In development) and a note saying what it rests on. No decision-record or trial numbers, no customer or organisation names
  (the demo names are `acme` and `demo`), no personal names, e-mail addresses or local paths. Not used as product terms:
  processor, manifest, orchestrator, worker, observation, asset, data kind, digital resource, interface type, Warehouse, Lab.
- **Licences:** a project's licence line speaks for that project only. The use cases' own text and diagrams have no licence
  chosen yet; don't imply one.
- **Links to a repository that is not public yet** are shown greyed, as "not public yet" (`syrmos-site/src/components/OutLink.tsx`,
  `REPO_PUBLIC` in `syrmos-site/scripts/prerender.mjs`, and the `off` class on the landing page). Turn them on when the
  repository opens.

## Commits

- Conventional commits (`feat(syrmos): …`, `docs: …`, `fix(landing): …`).
- No AI co-author or attribution lines in a commit message.
- Merge, never rebase. Stage only the files your change made.
- Never commit `.claude/`, `node_modules/`, `syrmos/`, `use-cases/` or `graphos/` (all are in `.gitignore`).
