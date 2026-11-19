import type { UseCaseMeta } from "../types";
import { api, caller, db, intoApi, row, tenant } from "./kit";

// Communities and key nodes: metrics on rustworkx and communities (Louvain or Leiden, the igraph extra) computed in a process
// beside the API, stored on the nodes; a re-run writes only what moved; Leiden from the stored partition keeps the ids.
// Sources (graphos main): docs/index.html (Benchmarks, Fig 03), docs/guide/algorithms.md, usage.md, apache-age.md.

const base = ["maint", "api", "db", "t-acme", "n1", "n2", "n3", "algo"];

export const communities: UseCaseMeta = {
  slug: "communities",
  kind: "analysis",
  status: "shown",
  thumb: 5,
  metrics: ["metrics", "groups", "ids"],
  parts: ["algorithms", "tenant", "ui", "changes"],
  related: ["demo-ecosystem", "mcp-agents", "change-feed"],
  shot: "explore-groups",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      caller("maint", "person", "a maintainer", 0, "the maintain level"),
      api("metrics:compute · recompute-communities"),
      db(),
      tenant("t-acme", "acme", 0),
      row("n1", "graphos_pagerank", 0, 0, 0),
      row("n2", "graphos_component", 0, 1, 1),
      row("n3", "community_id", 0, 2, 2),
      { id: "algo", kind: "panel", x: 506, y: 256, w: 200, h: 200, label: "algorithms", sub: "a process of their own", tone: "neutral" },
      { id: "a1", kind: "chip", x: 522, y: 318, w: 168, h: 26, label: "rustworkx · metrics", hue: 0 },
      { id: "a2", kind: "chip", x: 522, y: 352, w: 168, h: 26, label: "igraph · Louvain, Leiden", hue: 2 },
      { id: "a3", kind: "chip", x: 522, y: 386, w: 168, h: 26, label: "writes what moved", hue: 1 },
      { id: "job", kind: "pill", x: 600, y: 140, w: 200, h: 26, label: "202 · a job · one at a time" },
      { id: "rename", kind: "panel", x: 250, y: 196, w: 480, h: 290, label: "a plain re-run", sub: "every community renamed, every node rewritten", tone: "danger" },
      { id: "first", kind: "pill", x: 600, y: 140, w: 220, h: 26, label: "first run: 51 s · Louvain 276 s" },
      { id: "leiden", kind: "pill", x: 600, y: 140, w: 220, h: 26, label: "Leiden: 63 of 63 ids kept" },
    ],
    flows: [
      { id: "ask", kind: "control", pts: intoApi(0), msg: "compute" },
      { id: "api-algo", kind: "control", pts: [[540, 118], [540, 254]] },
      { id: "algo-t", kind: "gateway", pts: [[504, 365], [478, 365]], msg: "write back" },
      { id: "read", kind: "gateway", pts: [[478, 330], [504, 330]] },
    ],
    steps: [
      // 1 PROBLEM: a plain re-run renames everything
      { show: ["maint", "rename"], state: { rename: "bad" } },
      // 2 metrics, beside the data
      { show: [...base, "a1", "ask", "api-algo", "read", "algo-t"], active: ["ask", "api-algo", "read", "algo-t"], state: { n1: "ok", n2: "ok", a1: "hi" } },
      // 3 communities, as a job
      { show: [...base, "a1", "a2", "job", "ask", "api-algo"], active: ["ask", "api-algo"], state: { job: "hi", a2: "hi" } },
      // 4 the first run, measured
      { show: [...base, "a1", "a2", "first", "algo-t"], active: ["algo-t"], state: { n3: "ok", first: "hi" } },
      // 5 a re-run writes only what moved
      { show: [...base, "a1", "a2", "a3", "algo-t"], active: ["algo-t"], state: { a3: "hi" } },
      // 6 Leiden keeps the ids
      { show: [...base, "a1", "a2", "a3", "leiden", "algo-t"], active: ["algo-t"], state: { leiden: "hi", n3: "ok" } },
    ],
  },
};
