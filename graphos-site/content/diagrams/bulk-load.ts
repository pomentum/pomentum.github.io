import type { UseCaseMeta } from "../types";
import { api, caller, db, intoApi, row, tenant } from "./kit";

// Bulk loading: an NDJSON stream (or batches, or a snapshot) staged with COPY and upserted; sending it again leaves the data as
// it was; an edge with a missing end is skipped and counted. Sources (graphos main): docs/index.html (Features, Benchmarks),
// docs/guide/usage.md §4, apache-age.md (the write path, the import benchmark).

const base = ["loader", "api", "db", "t-acme", "r-n", "r-e", "stage"];

export const bulkLoad: UseCaseMeta = {
  slug: "bulk-load",
  kind: "data",
  status: "shown",
  thumb: 2,
  metrics: ["rate", "again", "missing"],
  parts: ["writes", "api", "changes", "plain-age"],
  related: ["reconcile", "csv-import", "change-feed"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      caller("loader", "box", "a loader", 0, "NDJSON stream"),
      api("writes: batches · NDJSON · snapshots"),
      db(),
      tenant("t-acme", "acme", 0),
      row("r-n", "nodes: upserted", 0, 0, 0),
      row("r-e", "edges: upserted", 0, 1, 1),
      row("r-x", "1 edge skipped", 0, 2, 3),
      { id: "stage", kind: "panel", x: 506, y: 256, w: 200, h: 200, label: "staging", sub: "binary COPY, then upsert", tone: "neutral" },
      { id: "s-copy", kind: "chip", x: 522, y: 318, w: 168, h: 26, label: "COPY 500 rows", hue: 2 },
      { id: "s-up", kind: "chip", x: 522, y: 352, w: 168, h: 26, label: "INSERT … ON CONFLICT", hue: 2 },
      { id: "merge", kind: "panel", x: 250, y: 196, w: 480, h: 290, label: "Cypher MERGE, row by row", sub: "the database, written directly", tone: "danger" },
      { id: "rev", kind: "pill", x: 600, y: 140, w: 220, h: 26, label: "same data · new revision + change" },
      { id: "snap", kind: "pill", x: 600, y: 140, w: 220, h: 26, label: "snapshot · up to 50 million rows" },
    ],
    flows: [
      { id: "slow", kind: "fail", pts: [[164, 85], [376, 85], [376, 194]], label: "31 edges a second", labelAt: 0.35 },
      { id: "in", kind: "data", pts: intoApi(0), msg: "NDJSON" },
      { id: "api-stage", kind: "gateway", pts: [[540, 118], [540, 254]], msg: "COPY" },
      { id: "stage-t", kind: "gateway", pts: [[504, 365], [478, 365]], msg: "upsert" },
      { id: "again", kind: "data", pts: intoApi(0), msg: "the same, again" },
    ],
    steps: [
      // 1 PROBLEM: row by row through Cypher
      { show: ["loader", "merge", "slow"], active: ["slow"], state: { merge: "bad" } },
      // 2 a stream into the API
      { show: [...base, "in"], active: ["in"], state: { api: "hi" } },
      // 3 COPY, then upsert
      { show: [...base, "s-copy", "s-up", "in", "api-stage", "stage-t"], active: ["in", "api-stage", "stage-t"], state: { "r-n": "ok", "r-e": "ok", stage: "hi" } },
      // 4 a missing end: skipped and counted
      { show: [...base, "s-copy", "s-up", "r-x", "api-stage", "stage-t"], active: ["api-stage", "stage-t"], state: { "r-x": "warn" } },
      // 5 sent again: the data as it was
      { show: [...base, "s-copy", "s-up", "rev", "again", "api-stage", "stage-t"], active: ["again", "api-stage", "stage-t"], state: { rev: "hi", "r-n": "ok", "r-e": "ok" } },
      // 6 a whole graph at once
      { show: [...base, "s-copy", "s-up", "snap", "in", "api-stage", "stage-t"], active: ["in", "api-stage", "stage-t"], state: { snap: "hi" }, sub: { loader: "a snapshot" } },
    ],
  },
};
