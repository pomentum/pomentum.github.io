import { VERSION } from "../version";
import type { UiShot, Kind, PartId, Status, Tag } from "../types";

// Every fact here is graphos's own, from the main branch of pomentum/graphos (release 0.16.0): its page (docs/index.html), the
// guides in docs/guide/ and the examples in clients/python/examples/.
export const ui = {
  notPublic: "Not public yet",
  release: { before: "", org: "", after: "" },
  guidesLater: "",
  nav: { useCases: "Use cases", how: "How it works", search: "Search", getStarted: "Get started", github: "GitHub", menu: "Menu", close: "Close" },
  theme: { label: "Colour theme", light: "Light", dark: "Dark" },
  // the dictionary entry, word for word as the graphos page has it
  entry: {
    headword: "γράφος",
    pron: "/ˈɣɾa.fos/",
    pos: "noun",
    def: "a written record, a letter; from γράφω, ",
    defEm: "to write",
  },
  hero: {
    audience: "For teams whose services share connected data (dependencies, assets, knowledge graphs, agent memory) and who already run PostgreSQL.",
    title: "A multi-tenant property-graph service. PostgreSQL and Apache AGE behind a typed HTTP API.",
    lede: "Step through real situations and see what graphos does in each: who reaches the graph, how data gets in and stays right, and what you can compute and read from it.",
    explore: "Explore use cases",
    eyebrow: `Use cases · version ${VERSION}`,
    /** the same line with graphos's latest release, read live (src/latest.ts) */
    eyebrowAt: (v: string) => `Use cases · version ${v}`,
    early: "Each use case says what shows it: a measured result, the automated tests, or an example you can run.",
  },
  overview: {
    title: "The whole service on one page",
    caption:
      "Your services, AI agents and people call graphos-api, with a bearer token; it alone connects to PostgreSQL and Apache AGE, on an internal network. Each tenant is its own AGE graph. Graph algorithms run beside the API, in a process of their own, and write their results back; every write is recorded in the change feed, in the same transaction.",
  },
  gallery: {
    title: "Use cases",
    lede: "Find a situation close to yours and step through it.",
    kind: "Kind",
    status: "Shown by",
    all: "All",
    none: "No use case matches. Clear a filter or the search.",
    steps: (n: number) => `${n} steps`,
    visited: "Opened",
    searchPlaceholder: "Words in a title, a team or a step",
    find: "Find",
    clear: "Clear the words",
    clearAll: "Clear filters",
    count: (n: number, total: number) => (n === total ? `${total} use cases` : `${n} of ${total} use cases`),
  },
  kinds: {
    data: "Getting data in",
    analysis: "Exploring and analysing",
    agents: "AI and agents",
    platform: "Running it for many",
  } satisfies Record<Kind, string>,
  status: {
    shown: "Measured",
    target: "Tested",
    dev: "Example",
  } satisfies Record<Status, string>,
  statusHelp: {
    shown: `In release ${VERSION}, with a result measured in graphos's own docs; each says on what.`,
    target: `In release ${VERSION} and covered by graphos's automated tests; no result is measured for it here.`,
    dev: "Shown by an example script in the repository, its output quoted in the docs.",
  } satisfies Record<Status, string>,
  tags: { problem: "Problem", product: "With graphos", how: "How it works" } satisfies Record<Tag, string>,
  page: {
    crumbs: "Use cases",
    situation: "The situation",
    step: (n: number, of: number) => `Step ${n} / ${of}`,
    back: "Back",
    next: (t: string) => `Next: ${t}`,
    done: "Back to all use cases",
    hint: "← → step · R replay · Space pause",
    replay: "Replay",
    pause: "Pause",
    play: "Play",
    timeline: "Steps",
    does: "What graphos does here",
    howLink: "How it works",
    tryIt: "Try it",
    related: "Related use cases",
    whyStatus: "What shows it",
    verify: "Not yet verified (shown in development only)",
    notFound: "There is no use case here.",
    diagramLabel: (title: string, step: string) => `Diagram of ${title}, ${step}. The step's story beside it describes what it shows.`,
    scrollHint: "Scroll the diagram sideways",
    viewLabel: "Diagram view",
    view3d: "3D",
    seeIt: "See it in graphos",
    onePage: "Read it on one page",
    viewFlat: "Flat",
  },
  legend: {
    data: "Data in or out",
    control: "A call to the API",
    gateway: "graphos's own SQL",
    fail: "Refused, or a failure",
    open: "A tenant's graph",
    protected: "The database",
    blocked: "Refused",
  },
  search: {
    label: "Search",
    placeholder: "Search use cases and steps…",
    empty: "Nothing found.",
    hint: "↑ ↓ choose · Enter open · Esc close",
    useCase: "Use case",
    stepOf: (n: number) => `Step ${n}`,
  },
  how: {
    title: "How it works",
    lede: "Every use case rests on the same five ideas. Each links to the use cases that show it best.",
    five: "Five ideas",
    more: "The other parts you meet",
    seeIn: "See it in",
    faq: "Questions people ask first",
  },
  footer: {
    source: "Source",
    licence: "Licence",
    notice: "Notice",
    pomentum: "Pomentum",
    note: "graphos is open source under the Apache License 2.0; its optional community detection uses python-igraph (GPL), not in the published images. Apache AGE is an Apache Software Foundation project, not affiliated with graphos.",
  },
  // the graphos page's own FAQ, shortened; each answer as the page and its guides give it
  faq: [
    {
      q: "Who is graphos for?",
      a: "Teams with several services that share connected data, such as dependencies, assets, a knowledge graph or an agent's memory, and who run PostgreSQL or are happy to. If a single application owns the graph and needs to write it with Cypher, plain Apache AGE or a native graph database suits it better.",
    },
    {
      q: "Why not Neo4j, or plain Apache AGE?",
      a: "graphos runs on PostgreSQL, a database you may already operate, back up and monitor; it has tenants, users and grants built in, and keeps your data in AGE's own format, so you can leave at any time. Plain AGE leaves every service to hold database credentials and to solve loading, indexing and isolation itself, with Cypher writes at about 31 edges a second. A native graph database wins for deep, variable-length traversals: graphos expands up to 5 hops and finds paths of up to 8.",
    },
    {
      id: "faq-cypher",
      q: "Why is Cypher read-only?",
      a: "Speed: per-row Cypher MERGE managed 31 edges a second, where graphos's COPY-staged upserts manage 1,153–4,840. Safety: AGE mishandles Cypher writes to tables carrying the columns graphos adds for revisions and communities. Writing through the API also keeps revisions, the change feed and the audit log right.",
    },
    {
      q: "How big can a tenant get?",
      a: "graphos sets no limit. Measured: a 251,246-node, 940,144-edge graph read on a single machine, the graph algorithms on synthetic graphs of up to 3.0 million edges, and the label map on ten million edges. A single snapshot import takes up to 50 million rows. Larger graphs mostly need more memory for PostgreSQL.",
    },
    {
      q: "Is it ready for production?",
      a: "It has what running it for other people needs: users, grants and single sign-on, secrets sealed at rest, statement timeouts, metrics and an audit log. Every change to main is tested in CI against PostgreSQL 18 with AGE 1.8. graphos is still before 1.0, so a release can change the API; each release's changes are in the changelog.",
    },
    {
      id: "faq-licence",
      q: "What is the licence?",
      a: "graphos and its published images are Apache-2.0. Community detection (Louvain and Leiden) needs python-igraph, which is GPL-2.0-or-later, so it is an optional extra the published images leave out; the other graph metrics run on rustworkx, Apache-2.0.",
    },
  ],
};

export type Ui = typeof ui;

export const shots: Record<UiShot, { alt: string; caption: string; w: number; h: number }> = {
  "csv-import": { w: 780, h: 810, alt: "The CSV import dialog: a semicolon-separated file of people mapped to the Person label, its columns as properties with their types, and graphos's check of every row before anything is written: one row refused for an empty id, a repeated id merged, a value that does not read as a number left out.", caption: "Importing a CSV file: the columns mapped to a label's properties, and graphos's check of every row before anything is written." },
  "explore-graph": { w: 1440, h: 900, alt: "The Explore view of the demo tenant, an invented software ecosystem: about 450 nodes coloured by the community Louvain found, six clusters around shared core libraries; the selected library's panel shows its community id and the graph metrics graphos computed.", caption: "Explore, on the [demo tenant](https://github.com/pomentum/graphos/blob/main/clients/python/examples/08_demo_ecosystem.py): coloured by community (the optional igraph extra), a core library selected with the metrics graphos computed for it." },
  "explore-groups": { w: 1440, h: 900, alt: "The groups of the demo tenant", caption: "The demo tenant's groups, its communities, with the metrics beside them and a way to compute them again." },
  "explore-map": { w: 1440, h: 900, alt: "The map of the demo tenant's labels", caption: "The map of every label and the edges between them, on the demo tenant: 7 labels, 443 nodes, 1,870 edges." },
  "explore-selection": { w: 1440, h: 900, alt: "The Explore canvas of the demo tenant with 31 nodes picked by a loop drawn with Shift-drag, shown in the accent colour; a bar at the foot offers Expand, Hide, Export and Delete for them, and a minimap in the corner frames the part of the graph on screen.", caption: "Many nodes at once: a loop drawn with Shift-drag (or Ctrl / ⌘ click) picks them; the bar expands, hides, exports or deletes them together. A minimap frames the part on screen." },
  "explore-styles": { w: 1440, h: 900, alt: "A query's result on the canvas, laid out in layers from left to right: a package, the packages it depends on and theirs, each drawn in its label's colour with its icon, with a legend of the labels and their counts.", caption: "A query's result on the canvas, laid out in layers along its edges and drawn with the tenant's label styles." },
  query: { w: 1440, h: 900, alt: "The Query page of the demo tenant: a saved query's Cypher, coloured, its parameter as a field, the result as a table with each node shown with its label's icon, and the tenant's saved queries beside it.", caption: "The Query page (where the Cypher console is on): Cypher coloured and suggested as you type, a saved query's form, the result with each node's label icon." },
  "schema-editor": { w: 1440, h: 900, alt: "The schema diagram of the demo tenant: Library, Framework and Tool in a block under their parent label Package, the selected label's relationships, its properties in a panel (declared, or carried without a definition), and the Add menu for a new label, relationship type, search index or property.", caption: "The schema editor: labels with their kinds, relationship types, and adding to the schema in place." },
  "schema-styles": { w: 1440, h: 900, alt: "Label styles in the schema", caption: "The schema's styles: how each label is drawn, set by those who maintain the tenant." },
};

/** Five words, explained where a walkthrough first uses them. */
export const glossary: { id: string; re: RegExp; def: string }[] = [
  { id: "age", re: /\bApache AGE\b|\bAGE\b/, def: "Apache AGE: a PostgreSQL extension that stores graphs in PostgreSQL tables and reads them with Cypher." },
  { id: "tenant", re: /\btenants?\b/i, def: "One graph of its own: an AGE graph that only those granted it can reach." },
  { id: "label", re: /\blabels?\b/i, def: "A node's kind, such as Package or Person. graphos ships none: you declare your own." },
  { id: "cypher", re: /\bCypher\b/, def: "A query language for graphs. In graphos it reads only; writes go through the API." },
  { id: "upsert", re: /\bupserts?\b/i, def: "Insert a row, or update it if it is already there: sending it again leaves the data as it was." },
];

export const partText: Record<PartId, { name: string; line: string; body: string }> = {
  api: {
    name: "graphos-api",
    line: "One service owns the graph: your services call typed HTTP, and only graphos talks to the database.",
    body: "Consumers never see a PostgreSQL connection string and cannot send SQL. graphos-api connects as an unprivileged role, and the database has no published port: it sits on an internal network. The contract is published at /openapi.json, versioned under /v1.",
  },
  tenant: {
    name: "Tenant",
    line: "Each tenant is its own AGE graph, and a caller reaches only the tenants it is granted.",
    body: "graphos ships no labels of its own: you declare yours, with property rules if you want them, and rename or deprecate them later, in place. A missing grant or too low a level is refused before any SQL runs.",
  },
  writes: {
    name: "Writes through the API",
    line: "Batches, NDJSON streams and snapshots, staged with COPY and upserted. Cypher reads only.",
    body: "Rows go into a staging table with a binary COPY, then INSERT … ON CONFLICT DO UPDATE: there is no other write path. Sending the same data again leaves it as it was; each repeat still records a new revision and a change. Per-row Cypher MERGE managed 31 edges a second; this path, 1,153–4,840.",
  },
  algorithms: {
    name: "Graph algorithms",
    line: "Computed beside the data, in a process of their own, and stored on the nodes.",
    body: "Degree, PageRank, components and betweenness run on rustworkx; communities, Louvain or Leiden, need the optional igraph extra. A re-run writes only what moved. Leiden can start from the stored communities, so they keep their ids.",
  },
  "plain-age": {
    name: "Plain AGE underneath",
    line: "Your data stays in AGE's own format, in ordinary PostgreSQL tables: you can leave at any time.",
    body: "AGE's Cypher and plain SQL read a tenant with no graphos running, and a dataset export loads into a new plain AGE graph with the loader graphos ships.",
  },
  reconcile: {
    name: "Reconcile",
    line: "Send the whole set of edges as your source has them; graphos changes only what differs.",
    body: "One node's edges of a type, or every edge of a type between two labels, made equal to the set you send, in one transaction. A dry run answers the counts and writes nothing.",
  },
  changes: {
    name: "Change feed",
    line: "Every write recorded in the same transaction that makes it; read after a cursor, or followed live.",
    body: "Records say what changed, not the values. The feed never skips a committed change, delivers at least once, and keeps seven days by default.",
  },
  mcp: {
    name: "MCP endpoint",
    line: "/mcp gives AI agents graphos's reads as 22 tools, with the caller's own grants.",
    body: "Whatever a token may read through /v1, it may read through /mcp, and no more. No tool writes, and every call is in the audit log.",
  },
  access: {
    name: "Users, grants and sign-on",
    line: "Users and service accounts, a level per tenant, 15-minute tokens, OpenID Connect sign-on.",
    body: "Levels are read, write, maintain and owner. Tokens last 15 minutes by default, so a leaked one is useful for minutes, not months; the web UI and the Python client renew theirs by themselves.",
  },
  ui: {
    name: "Web UI",
    line: "An optional web UI: explore, edit the schema, query, import.",
    body: "Explore draws a tenant's graph, its groups and its map; the schema editor declares labels and relationship types; the Query page reads with Cypher where the console is on; a CSV file is checked row by row before anything is written.",
  },
  client: {
    name: "Python client",
    line: "An async, typed Python client: pip install graphos-client.",
    body: "It signs in and renews its tokens by itself, and wraps the API's writes, reads, jobs and change feed.",
  },
  audit: {
    name: "Audit log",
    line: "One JSON line per request: who, on which tenant, with what result.",
    body: "On by default for writes; reads by a setting. A person's own token forwarded by an application is audited as that person.",
  },
};
