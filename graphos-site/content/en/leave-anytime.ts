import type { UseCaseText } from "../types";

export const leaveAnytime: UseCaseText = {
  title: "Leave whenever you want",
  situation: "If you stop using graphos, your graph should still be yours: readable without it, and easy to take out.",
  team: "Architects and platform owners",
  context:
    "For a team choosing where its connected data lives for years. A service that keeps data in a format of its own holds you to it. graphos's answer is that nothing is locked in: every tenant is an ordinary AGE graph in ordinary PostgreSQL tables.",
  metricLabels: {
    format: "Your data's format",
    without: "Read with graphos gone",
    export: "An export into plain AGE",
  },
  steps: [
    {
      tag: "problem",
      title: "A format of its own",
      body: ["When a service stores data in a shape only it understands, leaving means a migration project, and reading the data means going through the service."],
      metrics: { format: "the service's own", without: "no", export: "—" },
    },
    {
      tag: "product",
      title: "Ordinary AGE tables",
      body: [
        "Each tenant is one AGE graph, in a schema named after it, with a table per label and per relationship type. Your own ids are in `properties.id`.",
        "What graphos adds, a revision column, community columns, its `graphos_*` properties and a `graphos_meta` schema, is safe to ignore.",
      ],
      metrics: { format: "AGE's own, in PostgreSQL tables" },
    },
    {
      tag: "how",
      title: "Read it with graphos gone",
      body: [
        "AGE's Cypher and plain SQL read a tenant with no graphos running. Give regular readers a read-only role: on AGE 1.8 their Cypher writes are refused.",
        "On graphos's own tables, don't write with Cypher, and expect variable-length patterns to fail there.",
      ],
      metrics: { without: "yes, with SQL or Cypher" },
    },
    {
      tag: "how",
      title: "Take it out",
      body: [
        "Three ways out: `pg_dump` for everything, a tenant's dataset export (`GET …/graph/snapshot`), or the schema alone (`GET /v1/tenants/{name}/spec`).",
        "An export carries the data, not graphos's own records: no revisions, users, grants, saved queries or change feed.",
      ],
    },
    {
      tag: "product",
      title: "Into plain AGE, checked",
      body: [
        "The loader graphos ships, `tools/export/ndjson_to_age.py`, loads an export into a new plain AGE graph, where variable-length patterns work.",
        "Tried on AGE 1.8.0 and PostgreSQL 18.6 with a graph of 251,246 nodes and 940,144 edges: the checksums matched node by node and edge by edge. Loading 1.19 million rows took 77 s, at 855 MiB of memory at its peak.",
      ],
      metrics: { export: "checksums matched" },
    },
  ],
  parts: {
    "plain-age": "Every tenant an ordinary AGE graph.",
    tenant: "One schema per tenant, a table per label and type.",
    writes: "graphos writes with SQL, so the tables stay plain AGE.",
  },
  tryIt: {
    text: "The guide to reading graphos's data without graphos shows the table layout, SQL and Cypher reads, and taking the data out.",
    href: "https://github.com/pomentum/graphos/blob/main/docs/guide/without-graphos.md",
    linkText: "Read it without graphos",
  },
  statusNote:
    "Measured, by hand: the guide records the run on 2026-10-15, on AGE 1.8.0 and PostgreSQL 18.6, with matching checksums and the loader's time and memory. The loader itself has no automated test; exporting and importing within graphos does. The tenant drawn is an example.",
};
