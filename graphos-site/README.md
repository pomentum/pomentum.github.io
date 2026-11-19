# graphos · the page and its use cases (sources)

graphos's page at www.pomentum.dev/graphos/: what graphos is, drawn; In 30 seconds, At a glance, Benchmarks, the web UI, Get
started and the documentation; and its use cases as animated step-through diagrams, each one situation from start to finish and
what graphos does in it. React, TypeScript and Vite; no backend, no tracking. Routing is by hash (`#/use-cases/<use-case>/<step>`,
`#/how`, `#/<section>`), so the build works at any path and every step can be linked. The graphos page's own anchors, from when it
was a single page (`/graphos/#benchmarks`, `#faq-licence`, ...), open the same places.

These are the sources; the built site is `../graphos/` (see "Where it goes" below).

## Run it

```bash
cd graphos-site
npm ci
npm run dev        # http://localhost:5180
npm run build      # type check, the site in ../graphos/, its plain pages, sitemap.xml and llms.txt
npm run preview    # the built site at http://localhost:5181
```

## Where things are

| Path | What |
|---|---|
| `content/version.ts` | The graphos release the page was checked against |
| `content/types.ts` | The shape of a use case: a diagram (nodes, flows, and per step what is shown, marked and moving) and its words |
| `content/diagrams/<slug>.ts` | What each use case draws, step by step; no prose and no language |
| `content/en/<slug>.ts` | The words: title, situation, each step's story and metric values, the parts, Try it, the status note |
| `content/en/ui.ts` | The interface's words, the FAQ, the screenshots' captions, and the parts "How it works" explains |
| `content/en/more.ts` | The landing page's sections: In 30 seconds, At a glance, Benchmarks, Get started, the documentation |
| `content/index.ts` | The gallery's order, and which use cases show each idea best |
| `src/latest.ts` | graphos's latest release, read from GitHub in the browser for the version line and "Latest" |
| `src/components/More.tsx` | The landing page's sections |

To add a use case: a diagram file, a words file, and a line in each list of `content/index.ts`.

## The rules for the words

Facts come only from the graphos `main` branch: the README, `docs/` and its guides, the changelog and the examples. Each use
case's status says what shows it: **Measured** when graphos's docs measure a result for it, **Tested** when its automated tests
cover it, **Example** when an example script in the repository shows it.

The version line and "Latest" follow graphos's latest release on their own: the page reads it from GitHub as it opens, and the
plain pages take it at each build. The statuses keep the release in `content/version.ts`, the one the use cases were checked
against: after a new release, check the page against it, then change that line.

Never on the site: customer or organisation names (use `acme`, `demo`, `sales`), personal names, local paths or e-mail addresses.
graphos's licence line speaks for graphos only, not for the use cases' own text and diagrams.

## Where it goes

`npm run build` writes the static site to `../graphos/`, not kept in the repository. On every push to `main`, the repository's
`pages` workflow builds it the same way and publishes it at <https://www.pomentum.dev/graphos/>. Commit the sources alone;
build locally to check a change first.

To see it as Pages will serve it, from the repository's root: `python -m http.server 8000`, then
<http://localhost:8000/graphos/>.
