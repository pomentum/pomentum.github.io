import type { UiShot, Kind, PartId, Status, Tag } from "../types";

export const ui = {
  notPublic: "Not public yet",
  release: { before: "The code goes public with the first release, under ", org: "github.com/pomentum", after: "." },
  guidesLater: "The guides go public with the code, at the first release.",
  nav: { useCases: "Use cases", how: "How it works", search: "Search", getStarted: "Get started", github: "GitHub", menu: "Menu", close: "Close" },
  theme: { label: "Colour theme", light: "Light", dark: "Dark" },
  // the dictionary entry, word for word as the Syrmos README has it
  entry: {
    headword: "συρμός",
    pron: "/siɾˈmos/",
    pos: "noun",
    def: "Greek for a train: the engine and its carriages as a whole, moving as one. From σύρω, ",
    defEm: "to pull",
  },
  hero: {
    audience: "For platform teams, integrators and service providers who run Node-RED for several customers, sites or departments.",
    title: "Host Node-RED for many tenants. Every change governed.",
    lede: "Step through real situations and see what Syrmos does in each: where work comes in, where it runs, who may change it, and where the secrets stay.",
    explore: "Explore use cases",
    eyebrow: "Use cases · early, not yet released",
    early: "Each use case says whether it is shown today, a target, or in development.",
  },
  overview: {
    title: "The whole platform on one page",
    caption:
      "People, the assistant and outside agents work through the control plane, which deploys to each tenant's cells. Work comes in through the connector bridge; pipelines reach outside services through the credential gateway, which adds the secret. Cells share a durable bus. A spur, a tenant's own machine and still in development, runs a cell beside its machines and devices and syncs through the spur service.",
  },
  gallery: {
    title: "Use cases",
    lede: "Find a situation close to yours and step through it.",
    kind: "Kind",
    status: "Status",
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
    plant: "Plant and IoT",
    devices: "Devices on a spur",
    integrations: "Integrations",
    people: "People and review",
    ai: "AI and agents",
    tenants: "Many customers",
  } satisfies Record<Kind, string>,
  status: {
    shown: "Shown",
    target: "Target",
    dev: "In development",
  } satisfies Record<Status, string>,
  statusHelp: {
    shown: "Shown in the recorded demo or a trial; each says what it ran against.",
    target: "Syrmos is designed for it, but it hasn't been shown end to end.",
    dev: "Built in part, or not yet run on real equipment.",
  } satisfies Record<Status, string>,
  tags: { problem: "Problem", syrmos: "With Syrmos", how: "How it works" } satisfies Record<Tag, string>,
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
    does: "What Syrmos does here",
    howLink: "How it works",
    tryIt: "Try it",
    related: "Related use cases",
    whyStatus: "Why this status",
    verify: "Not yet verified (shown in development only)",
    notFound: "There is no use case here.",
    diagramLabel: (title: string, step: string) => `Diagram of ${title}, ${step}. The step's story beside it describes what it shows.`,
    scrollHint: "Scroll the diagram sideways",
    viewLabel: "Diagram view",
    view3d: "3D",
    seeIt: "See it in Syrmos",
    onePage: "Read it on one page",
    viewFlat: "Flat",
  },
  legend: {
    data: "Data into a run",
    control: "Control-plane action",
    gateway: "Call through the gateway",
    fail: "Failure, attack or leak",
    open: "Open cell",
    protected: "Protected cell",
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
    lede: "Every scenario rests on the same five ideas. Each links to the use cases that show it best.",
    five: "Five ideas",
    more: "The other parts you meet",
    seeIn: "See it in",
    faq: "Questions people ask first",
  },
  // each answer from the Syrmos main branch: the README, NOTICE, quotas.ts, the idle-cells decision, the cell contract, the spur guide
  faq: [
    {
      q: "Is it ready to use?",
      a: "Not yet: Syrmos is early. It is built and tested on Docker and installed from a clone with one command. Still to come: a release with published images, a Kubernetes target, a hosted model provider checked live, and most connectors checked against the real services.",
    },
    {
      q: "What does it need to run?",
      a: "Git and Docker with Compose (Engine 26 and Compose 2.24 or later) on one host, and nothing else. One command builds and starts it from the clone. A spur, a tenant's own machine, needs no Docker: a package for Linux and the Raspberry Pi, or a setup for Windows.",
    },
    {
      q: "Is it a fork of Node-RED?",
      a: "No. Each cell runs Node-RED unmodified, as published on npm. Syrmos is an independent project, not affiliated with or endorsed by the OpenJS Foundation.",
    },
    {
      q: "Can I bring my existing flows?",
      a: "Yes, since Node-RED itself is unchanged. A deploy that uses a node the cell may not use is refused, with the list of those nodes. Node-RED's Function node stays off in a governed cell: code runs as `syrmos function` instead, in a WebAssembly sandbox.",
    },
    {
      q: "How much does a cell use?",
      a: "You choose a size per cell, from 128 MB of memory and a quarter of a CPU up to 1 GB and two CPUs; the default is 512 MB and one CPU, as hard limits. At rest, a cell of the development stack holds about 70 to 80 MB.",
    },
    {
      q: "How do you know one tenant can't reach another?",
      a: "By probes run from inside a cell, each with a negative control: on the installation's layout, all 53 pass. No cell or bridge reaches the internet, the cloud's metadata address, a database, the secret store or another cell. Measured on one Docker host.",
    },
  ],
  footer: {
    source: "Source",
    licence: "Syrmos licence",
    notice: "Notice",
    pomentum: "Pomentum",
    note: "Syrmos, © 2026 Pomentum, is open source under the Apache License 2.0 and built on Node-RED, unmodified. Node-RED is a trademark of the OpenJS Foundation; Syrmos is not affiliated with it. Early and not yet released.",
  },
};

export type Ui = typeof ui;

export const shots: Record<UiShot, { alt: string; caption: string; w: number; h: number }> = {
  demo: { w: 1200, h: 750, alt: "The Syrmos web UI, recorded", caption: "Half a minute in Syrmos: the demo's cold room pipeline from an edit to a promotion waiting for review." },
  editor: { w: 1440, h: 900, alt: "The Syrmos editor", caption: "The editor: a pipeline with a step selected in its guided panel. A deploy is checked before it is stored." },
  run: { w: 1440, h: 900, alt: "A run traced on a timeline", caption: "The demo order pipeline's run, traced step by step on a timeline. A step whose node never reports that it is done, like Node-RED's switch, is flagged with an inferred end." },
  pipelines: { w: 1440, h: 900, alt: "The tenant's pipelines", caption: "The tenant's pipelines, the cells that run each, and whether each copy is the same." },
  connections: { w: 1440, h: 900, alt: "The Connections area", caption: "One Connections area: where each connection calls and how. A secret is set once; only its name and version are shown again." },
  registry: { w: 1440, h: 900, alt: "The registry", caption: "The registry: connectors as versioned items, each with its state and where it is used." },
};

/** The five words Syrmos defines (its README and concept), explained where a walkthrough first uses them. */
export const glossary: { id: string; re: RegExp; def: string }[] = [
  { id: "protected-cell", re: /\bprotected cells?\b/i, def: "A cell for production. Nobody edits it; it changes only by promotion or rollback." },
  { id: "tenant", re: /\btenants?\b/i, def: "A customer, a site or a department: its cells, its connections and its people." },
  { id: "cell", re: /\bcells?\b/i, def: "One Node-RED runtime of a tenant, in a container and a network of its own, or as a service on a spur." },
  { id: "governed", re: /\bgoverned\b/i, def: "What every cell is by default: it runs only reviewed nodes, and code runs in a WebAssembly sandbox." },
  { id: "promotion", re: /\bpromotions?\b/i, def: "Copying a version of a pipeline from one cell into another, after its checks and any review it needs." },
];

export const partText: Record<PartId, { name: string; line: string; body: string }> = {
  cell: {
    name: "Cell",
    line: "One Node-RED runtime of a tenant, in a container and a network of its own, or as a service on a spur.",
    body: "Each cell is unmodified Node-RED in a hardened container: a numeric non-root user, a read-only root, no capabilities and hard limits. It sits on an internal network that only the control plane and the bus join, so no cell reaches another. It is governed by default: only reviewed nodes run, and a tenant's code runs in a WebAssembly sandbox. On a spur, isolation comes from the machine and its local policy, not a container.",
  },
  "protected-cell": {
    name: "Protected cell",
    line: "A cell for production. Nobody edits it; it changes only by promotion or rollback.",
    body: "A protected cell names the cells it takes promotions from and whether a person must approve them. A direct deploy into it is refused, and so is a promotion from a cell it does not name.",
  },
  promotion: {
    name: "Promotion",
    line: "Copying a version of a pipeline from one cell into another, after its checks and any review it needs.",
    body: "Every deploy is an immutable version. Promotion is the tenant's own pipeline: it counts a version's runs, asks a person, and promotes. A rollback returns a cell to a version it ran before.",
  },
  gateway: {
    name: "Credential gateway",
    line: "Pipelines call a connection by name; the gateway adds the secret on the way out.",
    body: "The gateway knows each cell by its token and adds the secret from OpenBao to the outgoing call. No secret is in a flow, a cell or the control plane, and calls go only where the platform's and the tenant's lists of destinations allow.",
  },
  bus: {
    name: "Bus",
    line: "NATS JetStream: commands to cells, the durable intake, hand-offs between cells.",
    body: "A pipeline takes work from its intake on the bus and acknowledges it only when its run closes. Failed work is tried again, then kept as a dead letter you can send again. Each cell and each connector bridge has a credential of its own on the bus.",
  },
  bridge: {
    name: "Connector bridge",
    line: "One per cell: brokers, webhooks, rooms and polled databases into the intake, and back out.",
    body: "MQTT, Kafka and RabbitMQ, webhooks signed as their provider signs them, Matrix rooms and new rows polled from a database reach a pipeline through the connector bridge, which runs on Bento. A cell has no broker node of its own. A connection's topic is a ceiling: each pipeline may choose its own topic within it, checked at deploy and again by the bridge on every record.",
  },
  tracing: {
    name: "Run tracing",
    line: "Every run traced step by step on a timeline, with the version that ran.",
    body: "Runs and steps are recorded from Node-RED's hooks, fail-open: a tracer fault never loses a message. Replay a run from its intake message, offer a dead letter again, and follow a cell's runs live.",
  },
  review: {
    name: "Review",
    line: "A run can stop and wait for a person; the decision continues it.",
    body: "A review step pauses a run until a person approves or rejects it, in the web UI or, as a notice, in a chat room. Who decided is on the record.",
  },
  audit: {
    name: "Audit log",
    line: "One per tenant: every change and refusal, chained by hash.",
    body: "Every command, accepted or refused, every sign-in and change of access, with who acted and on whose behalf. Append-only, each record carrying the hash of the one before, with retention and legal holds.",
  },
  mcp: {
    name: "MCP server",
    line: "Outside agents act as the person who allowed them, with the scopes they chose.",
    body: "The control plane is an MCP server. A person connects an agent, signs in and chooses its scopes. The agent never touches a protected cell, and a review or a dead letter is decided by the person in their own client.",
  },
  assistant: {
    name: "Assistant",
    line: "Proposes changes you confirm, and builds a pipeline from a description.",
    body: "The assistant's panel reads with the same tools as the MCP server. A pipeline it builds is checked by a deploy's dry run, repaired at most twice, and saved as a draft only when you confirm. An operator sets what it may do in each area.",
  },
  registry: {
    name: "Registry",
    line: "What may run: reviewed node packages, connectors, services and packs.",
    body: "Node-RED packages are vetted from what they publish, never installed or run to check them: their publisher, provenance, signatures and known advisories, checked again daily. A second person approves them, and they are frozen into the cell image. Each cell's allow-list says what it may use, and a package reported as malicious is quarantined at once.",
  },
  spur: {
    name: "Spur (in development)",
    line: "A tenant's own machine, enrolled with one link, running a governed cell on site.",
    body: "A spur is a tenant's own Linux machine, Raspberry Pi or Windows PC that runs a governed cell without containers and carries on when the network is down. The machine's administrator decides what it may reach there, MIDI ports, pads, printers and scanners, Modbus and OPC UA reads, the machine itself, in a local policy. Its enrolment, its cell and these targets run today; it has not yet run on a real Pi, and its updates are not yet signed.",
  },
};
