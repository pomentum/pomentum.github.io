import type { UiShot } from "../types";
import { VERSION } from "../version";

// The rest of the graphos page (docs/index.html on graphos main, release 0.16.0), on the landing page here: In 30 seconds, At a
// glance, Benchmarks, the web UI, Get started and the documentation. The words are the page's own; two lines are made exact
// against the guides they come from: the first run of the graph metrics measured degree, PageRank and components
// (docs/guide/apache-age.md, "Recompute"; betweenness is skipped above 20,000 nodes), and the change feed's +1.8 ms is on a
// single patch (docs/guide/concept.md). `code` and [words](https://...) or [words](#/...) are rendered as such.

const GH = "https://github.com/pomentum/graphos/blob/main";

export const sections = {
  summary: "In 30 seconds",
  glance: { num: "At a glance", title: "What graphos is made of" },
  bench: { num: "Benchmarks", title: "What to expect on a single machine" },
  ui: { num: "Web UI", title: "Explore, edit, query" },
  start: { num: "Get started", title: "Run it on your machine" },
  docs: { num: "Documentation", title: "Read further" },
  faq: "Questions people ask first: How it works",
};

export const summary: { k: string; v: string }[] = [
  {
    k: "The problem",
    v: "Connected data turns up in most systems. Once several services need it, each one ends up holding database credentials, writing its own Cypher, and solving bulk loading, indexing and isolation on its own.",
  },
  {
    k: "The approach",
    v: "One service owns the graph. Your services call a typed REST API, and AI agents use the same reads over MCP. Only graphos talks to PostgreSQL + Apache AGE, on a private network.",
  },
  {
    k: "What it is not",
    v: "Not a new database engine, and not tied to any domain: graphos ships no labels of its own. Not a Cypher passthrough either: Cypher is read-only, by design, because writing through the API is far faster and safer on AGE ([why](#/how/faq-cypher)).",
  },
  {
    k: "Licence",
    v: "Apache-2.0. Optional community detection uses a GPL library, left out of the published images ([details](#/how/faq-licence)).",
  },
];

export const latestAt = (v: string) => `[${v}](https://github.com/pomentum/graphos/releases/latest)`;

export const glance: { k: string; v: string }[] = [
  { k: "Storage", v: "PostgreSQL 18 with Apache AGE 1.8; each tenant is its own AGE graph" },
  { k: "API", v: "Typed HTTP (FastAPI), JSON and NDJSON; the contract at `/openapi.json`" },
  { k: "Access", v: "Users and service accounts, 15-minute tokens, OpenID Connect sign-on, a level per tenant" },
  { k: "Algorithms", v: "Louvain and Leiden (optional extra), PageRank, betweenness, components, degree" },
  { k: "Clients", v: "An async, typed Python client; an optional web UI; plain HTTP" },
  { k: "Images", v: "`ghcr.io/pomentum/graphos-api` and `graphos-ui`, amd64 and arm64" },
  { k: "Licence", v: "Apache-2.0; community detection, an optional extra, uses a GPL library ([which installs have it](#/how/faq-licence))" },
  // the app shows the latest release, read from GitHub as the page opens (src/latest.ts); this is the one it was built with
  { k: "Latest", v: `[${VERSION}](https://github.com/pomentum/graphos/releases/latest)` },
  { k: "Agents", v: "An MCP endpoint, `/mcp`: 22 read tools on the API's tokens and grants" },
];

type Row = { what: string; sub?: string; cells: string[]; span?: boolean };

export const bench = {
  lead: "Measured on a single machine with PostgreSQL 18 and AGE 1.8, the image's default settings (128 MB `shared_buffers`) and a single graphos API process. Your hardware and settings will differ: read these as orders of magnitude, not guarantees.",
  reads: {
    caption:
      "Reads of a graph of 251,246 nodes and 940,144 edges, warm: 30 runs of a mix of 12 reads (360 requests), no pause between requests, none failed. Times are per-request medians (p50).",
    head: ["Read", "1 user", "5 users at once"],
    rows: [
      { what: "The whole mix, requests per second", sub: "360 requests in 67 s and in 35 s", cells: ["5.4 /s", "10.3 /s"] },
      { what: "Shortest paths of up to 4 hops", cells: ["154 ms", "529 ms"] },
      { what: "Neighbours of a node (up to 200)", cells: ["350 ms at 5 users"], span: true },
      { what: "Console aggregate over a whole label", cells: ["621 ms", "1,397 ms"] },
    ] as Row[],
  },
  writes: {
    caption: "Writes and computations, each on the data its row names.",
    head: ["Measured", "Result"],
    rows: [
      { what: "Bulk edge writes", sub: "COPY-staged upserts; 13k nodes and 44k edges, 4 GB `shared_buffers`", cells: ["1,153–4,840 edges/s"] },
      { what: "Dataset import into an empty tenant", sub: "the graph above, 1.19 million rows, every row through the tenant's indexes", cells: ["447 s, about 2,500 rows/s"] },
      { what: "Recording a write in the change feed", sub: "in the same transaction as the write; on a single patch", cells: ["+1.8 ms"] },
      { what: "Map of every label and the edges between them", sub: "ten million edges, sampled", cells: ["about 1 s"] },
      { what: "Graph metrics, first run", sub: "degree, PageRank and components; synthetic, 270,000 nodes and 1.0 million edges", cells: ["51 s"] },
      { what: "Louvain communities, first run", sub: "the optional igraph extra; the same synthetic graph", cells: ["276 s"] },
    ] as Row[],
  },
  factor: {
    summary: "Where the speed comes from: before and after graphos",
    caption:
      "Factor = before ÷ after; bars on a log scale. Writes: 13k nodes and 44k edges, 4 GB `shared_buffers`. Lookups: a ~117k-row label. Reads: the graph and machine above. Re-runs: a synthetic 250,080 nodes and 951,272 edges, 1 % more edges added between runs.",
    head: ["Measured", "Before", "graphos", "Factor (log scale)", "×"],
    // lo and hi: the factor, or its range, drawn on a log scale up to 5,000
    rows: [
      { what: "Bulk edge writes", sub: "per-row Cypher `MERGE` → COPY-staged `INSERT … ON CONFLICT`", before: "31 /s", after: "1,153–4,840 /s", x: "37–156", lo: 37, hi: 156, label: "37 to 156 times" },
      { what: "Substring search on a name", sub: "no index → the trigram index graphos creates", before: "1.2 s", after: "1.3 ms", x: "~920", lo: 920, label: "about 920 times" },
      { what: "Lookup by community id", sub: "no index → the index graphos creates", before: "2.4 s", after: "0.5 ms", x: "~4,800", lo: 4800, label: "about 4,800 times" },
      { what: "12-read mix, 5 users, 360 requests", sub: "PostgreSQL 16 / AGE 1.6 → PostgreSQL 18 / AGE 1.8", before: "57 s", after: "35 s", x: "1.6", lo: 1.6, label: "1.6 times" },
      {
        what: "Graph metrics re-run after 1 % more edges",
        sub: "every moved score rewritten (0.13.2) → scores that moved under 1 % left as stored (0.14.0)",
        before: "40 s",
        after: "17 s",
        x: "2.4",
        lo: 2.4,
        label: "2.4 times",
      },
      {
        what: "Community re-run after 1 % more edges",
        sub: "the optional igraph extra: Louvain from scratch, the default → Leiden from the stored communities, on request (0.14.0)",
        before: "103 s",
        after: "28 s",
        x: "3.7",
        lo: 3.7,
        label: "3.7 times",
      },
    ] as { what: string; sub: string; before: string; after: string; x: string; lo: number; hi?: number; label: string }[],
    note: `The \`MERGE\` baseline came from an earlier graphos that still wrote with Cypher, so it can no longer be rerun; the index rows compare a table without the index against one with it; the PostgreSQL 16 copy of the read-mix graph carried about 3× dead space, which favours PostgreSQL 18. Setups and caveats: [measured on PostgreSQL 18](${GH}/docs/guide/apache-age.md#12-measured-on-postgresql-18--age-18), [why every write is SQL](${GH}/docs/guide/apache-age.md#5-why-every-write-is-sql).`,
  },
};

/** The page's six screenshots, in its order: UI 01 to UI 06. Their captions and descriptions are in ui.ts, `shots`. */
export const uiShots: UiShot[] = ["explore-graph", "schema-editor", "query", "explore-styles", "explore-selection", "csv-import"];

export const start = {
  lead: `Docker with a recent Docker Compose (the \`docker compose\` plugin) and about 4 GB of memory for Docker. These commands run the published images (\`ghcr.io/pomentum/graphos-api\` and \`graphos-ui\`, amd64 and arm64), so nothing is built. They leave out community detection, whose library is GPL: add \`-f docker-compose.igraph.yml\` to download it at the first start. To build from source, add \`-f docker-compose.build.yml\` (the [installation guide](${GH}/docs/guide/installation.md#2-install-with-docker-compose)).`,
  commands: `git clone https://github.com/pomentum/graphos.git && cd graphos

# 1. Random database passwords and graphos's master key, written once to
#    services/graphos/deploy/secrets/ (gitignored)
bash scripts/init-secrets.sh        # Windows: pwsh scripts/init-secrets.ps1

# 2. Database, API and web UI, from the published images (leave out --profile ui for the API alone)
docker compose -f docker-compose.graphos.yml --profile ui up -d

# 3. Up?
curl -s http://127.0.0.1:8080/readyz     # {"status":"ready",...}`,
  copy: "Copy",
  copied: "Copied",
  next: [
    `Sign in to the UI at \`http://127.0.0.1:8081\` as \`graphos\` / \`graphos\` and choose a new password: the [installation guide](${GH}/docs/guide/installation.md).`,
    `Register a tenant, write nodes and edges, read them back: the [usage guide](${GH}/docs/guide/usage.md), or the [Python client](https://github.com/pomentum/graphos/tree/main/clients/python) (\`pip install graphos-client\`, [on PyPI](https://pypi.org/project/graphos-client/)).`,
    `Load the demo tenant to explore: [08_demo_ecosystem.py](${GH}/clients/python/examples/08_demo_ecosystem.py). Its communities, the colours of UI 01, need the igraph extra: start the stack with \`-f docker-compose.igraph.yml\`, or the demo loads without them.`,
  ],
};

export const docs: { name: string; href: string; what: string }[] = [
  { name: "Installation guide", href: `${GH}/docs/guide/installation.md`, what: "Installing, the first sign-in, users, single sign-on, production settings, upgrading" },
  { name: "Reading graphos's data without graphos", href: `${GH}/docs/guide/without-graphos.md`, what: "The table layout, reading it with SQL or Cypher, taking it out, loading an export into plain AGE" },
  { name: "Upgrading the database", href: `${GH}/docs/guide/upgrade-postgresql-18.md`, what: "Moving an older graphos database to PostgreSQL 18 / AGE 1.8 with `docker compose up`" },
  { name: "Single sign-on", href: `${GH}/docs/guide/sso.md`, what: "Registering graphos at an OpenID Connect provider, a Keycloak example, troubleshooting" },
  { name: "Graph algorithms", href: `${GH}/docs/guide/algorithms.md`, what: "What the communities (Louvain, Leiden), PageRank, betweenness, components and degree find, what they are for, and how Louvain and Leiden differ" },
  { name: "Usage guide", href: `${GH}/docs/guide/usage.md`, what: "Practical integration patterns" },
  { name: "Connecting an agent (MCP)", href: `${GH}/docs/guide/agents.md`, what: "Where `/mcp` is, getting a token, configuring a client, the tools and resources, security" },
  { name: "Feature survey", href: `${GH}/docs/guide/features.md`, what: "Every capability, briefly" },
  { name: "Concept", href: `${GH}/docs/guide/concept.md`, what: "Architecture, endpoint catalogue, capacity planning" },
  { name: "Apache AGE notes", href: `${GH}/docs/guide/apache-age.md`, what: "AGE pitfalls, indexing, Postgres tuning, measured numbers" },
  { name: "Web UI", href: "https://github.com/pomentum/graphos/blob/main/services/graphos-ui/README.md", what: "Running the UI, its views, how its code and text are organised" },
];

/** The graphos page's section anchors (www.pomentum.dev/graphos/#benchmarks), and where each opens here. */
export const oldAnchors: Record<string, string> = {
  summary: "#/summary",
  why: "#/why",
  glance: "#/glance",
  features: "#/use-cases",
  benchmarks: "#/benchmarks",
  how: "#/how",
  ui: "#/ui",
  start: "#/start",
  faq: "#/how/faq",
  "faq-cypher": "#/how/faq-cypher",
  "faq-licence": "#/how/faq-licence",
  docs: "#/docs",
};
