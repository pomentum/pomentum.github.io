# syrmos · the page and its use cases (sources)

Syrmos's page at www.pomentum.dev/syrmos/: what Syrmos is, the platform drawn, and its use cases as animated step-through
diagrams, each one situation from start to finish and what Syrmos does in it. React, TypeScript and Vite; no backend, no tracking.
Routing is by hash (`#/use-cases/<use-case>/<step>`, `#/how`), so the build works at any path and every step can be linked.

These are the sources; the built site is `../syrmos/` (see "Where it goes" below).

## Run it

```bash
cd syrmos-site
npm ci
npm run dev        # http://localhost:5180
npm run build      # type check, the site in ../syrmos/, its plain pages, sitemap.xml and llms.txt
npm run preview    # the built site at http://localhost:5181
```

## Where things are

| Path | What |
|---|---|
| `content/types.ts` | The shape of a walkthrough: a diagram (nodes, flows, and per step what is shown, marked and moving) and its words |
| `content/index.ts` | The eight walkthroughs, in the order to learn Syrmos; the redirects from the earlier walkthroughs' addresses; which walkthroughs show each of the five ideas best |
| `content/walkthroughs.ts` | The seven problem walkthroughs: each step a source walkthrough's diagram at one of its steps, and a step's own evidence where it is less than its source's |
| `content/diagrams/<slug>.ts` | What each walkthrough draws, step by step: the cold room's, and the earlier walkthroughs' that the seven are drawn from; no prose |
| `content/en/<slug>.ts` | The words: title, situation, each step's story and metric values, the parts, Try it, the status note |
| `content/en/problems.ts` | Which walkthrough answers each problem on the first screen, and the tour |
| `content/en/ui.ts` | The interface's words, the first screen, the glossary, and the parts of Syrmos that "How it works" explains |
| `src/components/IsoDiagram.tsx` | The 3D view (the default): the same layout as slabs, walls and plinths on a floor |
| `src/components/Diagram.tsx` | The flat view, and the switch between the two |

A walkthrough is one story for one problem a reader has. Its steps are drawn from the diagrams in `content/diagrams/`, each at
one of its steps, so that every picture stays one that was checked; a new story needs a words file, a line in `content/walkthroughs.ts`
and one in `content/index.ts`. A diagram is laid out on a
960 × 520 plane, as if seen from above; the 3D view tilts that plane, raises each panel by its kind, and stands a cell on the
tenant that holds it.

## The rules for the words

Facts come only from the Syrmos `main` branch: the README, `docs/` (the public page, the guides, the trials) and the packs. Where
a fact cannot be found there, the words file says `TODO(verify)` in its `verify` list; the page shows that list in development
only. Each step's status follows what shows it: **Shown** when it runs today in the demo or a trial, **Target** when Syrmos is
designed for it but it has not been shown end to end, **In development** when it depends on the spur. A step takes its source
walkthrough's status unless `evidence` gives it a lesser one; a problem step has none; a walkthrough shows every status its steps
have, the most cautious first. Write in plain words: an automation, a test copy and a live copy, a password.

Never on the site: customer or organisation names (use `acme` and `demo`), personal names, local paths or e-mail addresses.
Syrmos's licence line speaks for Syrmos only, not for the use cases' own text and diagrams.

## Where it goes

`npm run build` writes the static site to `../syrmos/` (and redirects from its first address to `../use-cases/`), neither kept
in the repository. On every push to `main`, the repository's `pages` workflow builds it the same way and publishes it at
<https://www.pomentum.dev/syrmos/>. Commit the sources alone; build locally to check a change first.

To see it as Pages will serve it, from the repository's root: `python -m http.server 8000`, then
<http://localhost:8000/syrmos/>.
