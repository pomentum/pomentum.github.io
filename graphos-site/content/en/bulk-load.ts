import type { UseCaseText } from "../types";

export const bulkLoad: UseCaseText = {
  title: "Load a big graph, and load it again",
  situation: "Tens of thousands of edges should go in fast, and sending them again after a failure should be safe.",
  team: "Data and integration teams",
  context:
    "For a team that loads connected data from another system, often on a schedule. Plain Apache AGE writes with Cypher, row by row: about 31 edges a second, and every service solving loading and indexing on its own.",
  metricLabels: {
    rate: "Edges written a second",
    again: "Sending it again",
    missing: "An edge whose end is missing",
  },
  steps: [
    {
      tag: "problem",
      title: "Row by row through Cypher",
      body: ["Each edge is a Cypher MERGE of its own, sent straight to the database. In graphos's own benchmark, an earlier graphos that still wrote this way managed 31 edges a second."],
      metrics: { rate: "31", again: "—", missing: "—" },
    },
    {
      tag: "product",
      title: "A stream into the API",
      body: [
        "The loader sends nodes and edges to graphos-api as an NDJSON stream (`…/graph/nodes:bulk`, `…/graph/edges:bulk`), or as JSON batches of up to 1,000 rows.",
        "A stream commits every 500 rows, each batch in its own transaction. A bad line is counted in `rows_invalid`, and the first 50 are listed.",
      ],
    },
    {
      tag: "how",
      title: "COPY, then upsert",
      body: [
        "graphos writes each batch with a binary COPY into a staging table, then `INSERT … ON CONFLICT DO UPDATE`. It is the only write path.",
        "Measured on 13,000 nodes and 44,000 edges, with 4 GB of shared_buffers on one host: 1,153–4,840 edges a second.",
      ],
      metrics: { rate: "1,153–4,840" },
    },
    {
      tag: "how",
      title: "A missing end: skipped and counted",
      body: [
        "An edge whose source or target node doesn't exist isn't written; it is counted in `edges_skipped`. Duplicates within a batch collapse, and the last one wins.",
      ],
      metrics: { missing: "skipped and counted" },
    },
    {
      tag: "product",
      title: "Sent again: the data as it was",
      body: [
        "If the load fails halfway, sending the whole stream again is safe: the data ends up as it was meant to be.",
        "Each repeated row still records a new revision and a change in the change feed, so a repeat isn't free.",
      ],
      metrics: { again: "safe: the data unchanged" },
    },
    {
      tag: "how",
      title: "A whole graph at once",
      body: [
        "A snapshot import takes nodes and edges in one NDJSON stream, up to 50 million rows, committing every 5,000. Like a stream, it isn't one transaction.",
        "Measured on a single machine: an export of 1.19 million rows imported into an empty tenant in 447 s, about 2,500 rows a second.",
      ],
    },
  ],
  parts: {
    writes: "COPY-staged upserts: the one write path.",
    api: "Takes batches, NDJSON streams and snapshots.",
    changes: "Records every write, a repeat included.",
    "plain-age": "The rows land in ordinary AGE tables.",
  },
  tryIt: {
    text: "The example 02_bulk_load.py loads a graph in bulk, then as a snapshot, and prints what was written and skipped.",
    href: "https://github.com/pomentum/graphos/blob/main/clients/python/examples/02_bulk_load.py",
    linkText: "The bulk load example",
  },
  statusNote:
    "Measured, on the graphos page and in its Apache AGE notes: 1,153–4,840 edges a second on 13,000 nodes and 44,000 edges with 4 GB of shared_buffers, against 31 for per-row Cypher MERGE (from an earlier graphos, which can no longer be rerun); and a 1.19-million-row import in 447 s on a single machine. Tests check that an upsert is idempotent and that an edge with a missing end is skipped.",
};
