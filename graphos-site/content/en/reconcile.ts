import type { UseCaseText } from "../types";

export const reconcile: UseCaseText = {
  title: "Keep the edges equal to the source",
  situation: "The graph should match the source system's current edges, without a gap while it catches up.",
  team: "Data and integration teams",
  context:
    "For a team whose source system knows each node's current edges: what a package depends on, who maintains what. The usual way to sync is to delete the run, then reload it: a full rebuild, with readers seeing missing data meanwhile.",
  metricLabels: {
    gap: "Readers see edges missing",
    written: "Edges written",
    preview: "Before anything is written",
  },
  steps: [
    {
      tag: "problem",
      title: "Delete, then reload",
      body: ["Every sync deletes the edges and writes them all again. While it runs, readers see some of them missing, and every edge is rewritten, changed or not."],
      metrics: { gap: "while the reload runs", written: "all of them", preview: "—" },
    },
    {
      tag: "product",
      title: "Send the set as the source has it",
      body: [
        "The source sends the whole set to `POST …/graph/edges:reconcile`. Its scope is one node's edges of a type (here, what `app` depends on), or every edge of a type between two labels.",
        "A type's set can be up to 10,000 edges as JSON, or up to 200,000 as an NDJSON stream.",
      ],
    },
    {
      tag: "how",
      title: "A dry run first",
      body: [
        "With `?dry_run=true`, graphos answers what it would do and writes nothing: so many added, changed, kept and removed.",
      ],
      metrics: { preview: "a dry run, with the counts" },
    },
    {
      tag: "product",
      title: "Only the difference, in one transaction",
      body: [
        "graphos makes the stored set equal to the one sent, in one transaction: a missing edge is added, a changed one rewritten, and an edge the source no longer has is removed.",
        "Readers see the old set or the new one, never a half-way state.",
      ],
      metrics: { gap: "never: one transaction", written: "only what differs" },
    },
    {
      tag: "how",
      title: "A kept edge isn't touched",
      body: [
        "An edge that hasn't changed isn't written, so its revision stays. A wanted edge whose other end doesn't exist is skipped and counted, with the first 100 listed.",
      ],
    },
    {
      tag: "how",
      title: "On the change feed",
      body: ["The reconciliation is recorded as one upsert and one delete in the change feed, with the edges' ids listed, up to 10,000."],
    },
  ],
  parts: {
    reconcile: "Makes a scope's stored edges equal to the set sent.",
    writes: "Writes only the difference.",
    changes: "Records what was added, changed and removed.",
  },
  tryIt: {
    text: "The usage guide's section on reconciling shows both scopes, the dry run and the Python calls.",
    href: "https://github.com/pomentum/graphos/blob/main/docs/guide/usage.md",
    linkText: "Read the usage guide",
  },
  statusNote:
    "Tested: graphos's tests check that a node scope adds, changes, keeps and removes only inside it, the incoming direction and a dry run, and that a type scope from NDJSON equals a fresh load and is recorded. No benchmark covers it. Edges only: there is no reconcile for nodes. The package names drawn are examples.",
};
