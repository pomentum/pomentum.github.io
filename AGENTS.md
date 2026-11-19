# Working in this repository

This repository is the Pomentum organisation's website at <https://www.pomentum.dev/>. GitHub Pages publishes what the `pages`
workflow (`.github/workflows/pages.yml`) builds on every push to `main`; the site is live a minute or two later.

## What is here

| Path | What it is | How it changes |
|---|---|---|
| `index.html`, `style.css`, `theme.js`, `404.html` | The landing page: plain HTML and CSS, a card per project | Edited by hand |
| `syrmos-site/` | The source of Syrmos's page at `/syrmos/`: React, TypeScript and Vite, its use cases in `content/` | Edited by hand |
| `syrmos/`, `use-cases/` | Built from `syrmos-site/`: the page, and redirects from its first address; not in the repository | By `npm run build` in `syrmos-site/`, locally or in the workflow |
| `.github/workflows/pages.yml` | Builds Syrmos's page and publishes the site | Edited by hand |

## Rules

- **Only the site is public.** The workflow publishes only the files its "Assemble" step copies: the landing page's files, the
  built `syrmos/` and `use-cases/`, and `sitemap.xml` and `llms.txt` at the root. This file, `CLAUDE.md`, `README.md` and
  `syrmos-site/` are never published. A new public file must be added to that step, or it will not be on the site.
- **A project's own site comes first.** A project whose repository publishes its own Pages site (graphos) is served from it at
  `/<project>/`; never add a folder with its name here. Syrmos's repository publishes none, so its page is built here at
  `/syrmos/`.
- **The landing page:** a card per project, using the project's own README tagline. When `style.css` or `theme.js` changes,
  bump the `?v=` date on their links in `index.html` and `404.html`.
- **Syrmos's page:** edit `syrmos-site/` and commit the source alone; the workflow builds and publishes it. Build locally to
  check it first; never commit `syrmos/` or `use-cases/`.

  ```bash
  cd syrmos-site
  npm ci
  npm run build      # type check, then the page in ../syrmos/ (and the redirects in ../use-cases/)
  ```

  Preview the whole site as Pages serves it with `python -m http.server 8000` at the root, then open
  <http://localhost:8000/syrmos/>.
- **Its addresses:** `/syrmos/` is the animated app (`#/use-cases/<use case>/<step>`, `#/how`). For search engines and AI tools,
  `npm run build` also writes a plain page per use case at `/syrmos/use-cases/<use case>/`, the list at `/syrmos/use-cases/`
  and How it works at `/syrmos/how/` (`syrmos-site/scripts/prerender.mjs`), and `sitemap.xml` and `llms.txt`. They come from
  the same content files; never edit them by hand. The first addresses, `/use-cases/...`, redirect to these.
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
- Never commit `.claude/`, `node_modules/`, `syrmos/` or `use-cases/` (all are in `.gitignore`).
