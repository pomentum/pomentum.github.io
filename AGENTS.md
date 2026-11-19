# Working in this repository

This repository is the Pomentum organisation's website at <https://www.pomentum.dev/>. GitHub Pages publishes what the `pages`
workflow (`.github/workflows/pages.yml`) builds on every push to `main`; the site is live a minute or two later.

## What is here

| Path | What it is | How it changes |
|---|---|---|
| `index.html`, `style.css`, `theme.js`, `404.html` | The landing page: plain HTML and CSS, a card per project | Edited by hand |
| `use-cases-site/` | The source of the use-cases site: React, TypeScript and Vite | Edited by hand |
| `use-cases/` | The built use-cases site, served at `/use-cases/`; not in the repository (`.gitignore`) | By `npm run build` in `use-cases-site/`, locally or in the workflow |
| `.github/workflows/pages.yml` | Builds the use cases and publishes the site | Edited by hand |

## Rules

- **Only the site is public.** The workflow publishes only the files its "Assemble" step copies: the landing page's files and
  the built `use-cases/`. This file, `CLAUDE.md`, `README.md` and `use-cases-site/` are never published. A new public file must
  be added to that step, or it will not be on the site.
- **Never add a folder named after a project.** Each project's own site is served from its own repository at
  `/<project>/` (for example `/graphos/`), and GitHub serves that ahead of a folder of the same name here. The use cases live
  at `/use-cases/`, and each project's are reached by hash: `use-cases/#/syrmos`.
- **The landing page:** a card per project, using the project's own README tagline. When `style.css` or `theme.js` changes,
  bump the `?v=` date on their links in `index.html` and `404.html`.
- **The use cases:** edit `use-cases-site/` and commit the source alone; the workflow builds and publishes it. Build locally
  to check it first; never commit `use-cases/`.

  ```bash
  cd use-cases-site
  npm ci
  npm run build      # type check, then the site in ../use-cases/
  ```

  Preview the whole site as Pages serves it with `python -m http.server 8000` at the root, then open
  <http://localhost:8000/use-cases/#/syrmos>.
- **What the use cases may say:** facts only from the project's `main` branch. Each use case carries a status (Shown, Target,
  In development) and a note saying what it rests on. No decision-record or trial numbers, no customer or organisation names
  (the demo names are `acme` and `demo`), no personal names, e-mail addresses or local paths. Not used as product terms:
  processor, manifest, orchestrator, worker, observation, asset, data kind, digital resource, interface type, Warehouse, Lab.
- **Licences:** a project's licence line speaks for that project only. The use cases' own text and diagrams have no licence
  chosen yet; don't imply one.
- **Links to a repository that is not public yet** are shown greyed, as "not public yet" (`use-cases-site/src/components/OutLink.tsx`,
  and the `off` class on the landing page). Turn them on when the repository opens.

## Commits

- Conventional commits (`feat(use-cases): …`, `docs: …`, `fix(landing): …`).
- No AI co-author or attribution lines in a commit message.
- Merge, never rebase. Stage only the files your change made.
- Never commit `.claude/`, `node_modules/` or `use-cases/` (all are in `.gitignore`).
