import type { UseCaseMeta } from "../types";
import { api, caller, db, intoApi, outside, row, tenant } from "./kit";

// Exploring the demo tenant: clients/python/examples/08_demo_ecosystem.py loads an invented software ecosystem (443 nodes,
// 1,870 edges), computes its metrics, and with the igraph extra its communities; Explore draws it. Sources (graphos main): the
// example, docs/guide/algorithms.md (its printed results), docs/index.html (UI 01), installation.md.

const base = ["script", "api", "db", "t-demo", "d1", "d2", "d3", "d4", "algo"];

export const demoEcosystem: UseCaseMeta = {
  slug: "demo-ecosystem",
  kind: "analysis",
  status: "dev",
  thumb: 4,
  metrics: ["size", "central", "groups"],
  parts: ["algorithms", "ui", "tenant", "client"],
  related: ["communities", "mcp-agents", "bulk-load"],
  shot: "explore-graph",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      caller("script", "log", "08_demo_ecosystem.py", 0, "the example"),
      caller("person", "person", "you, in Explore", 1),
      api(),
      db(),
      tenant("t-demo", "demo", 0, "an invented ecosystem"),
      row("d1", "Package: Library · Framework · Tool", 0, 0, 0),
      row("d2", "Person · Team · Organisation", 0, 1, 1),
      row("d3", "Topic", 0, 2, 2),
      row("d4", "DEPENDS_ON · MAINTAINS · …", 0, 3, 3),
      { id: "algo", kind: "panel", x: 506, y: 256, w: 200, h: 200, label: "graph algorithms", sub: "beside the API", tone: "neutral" },
      { id: "m1", kind: "chip", x: 522, y: 318, w: 168, h: 26, label: "PageRank top: corelog", hue: 0 },
      { id: "m2", kind: "chip", x: 522, y: 352, w: 168, h: 26, label: "2 components", hue: 1 },
      { id: "m3", kind: "chip", x: 522, y: 386, w: 168, h: 26, label: "6 communities · igraph", hue: 2 },
      outside("queries", "tracker", "saved queries", 0, "where the console is on"),
      { id: "count", kind: "pill", x: 600, y: 140, w: 220, h: 26, label: "443 nodes · 1,870 edges" },
      { id: "blob", kind: "panel", x: 250, y: 196, w: 480, h: 290, label: "hundreds of packages", sub: "no picture of what matters", tone: "danger" },
    ],
    flows: [
      { id: "load", kind: "data", pts: intoApi(0), msg: "upsert 500" },
      { id: "api-t", kind: "gateway", pts: [[376, 118], [376, 254]] },
      { id: "algo-l", kind: "gateway", pts: [[504, 330], [478, 330]], msg: "stored" },
      { id: "explore", kind: "control", pts: intoApi(1), label: "Explore", labelAt: 0.25 },
      { id: "q", kind: "control", pts: [[798, 85], [582, 85]], label: "most_depended_on", labelAt: 0.5 },
    ],
    steps: [
      // 1 PROBLEM: no picture
      { show: ["script", "blob"], state: { blob: "bad" } },
      // 2 load the demo
      { show: [...base.filter((n) => n !== "algo"), "count", "load", "api-t"], active: ["load", "api-t"], state: { count: "hi", "t-demo": "hi" } },
      // 3 its schema, declared
      { show: [...base.filter((n) => n !== "algo"), "count"], state: { d1: "ok", d2: "ok", d3: "ok", d4: "ok" } },
      // 4 metrics, with nothing extra
      { show: [...base, "m1", "m2", "algo-l"], active: ["algo-l"], state: { m1: "ok", m2: "ok" } },
      // 5 communities, with the igraph extra
      { show: [...base, "m1", "m2", "m3", "algo-l"], active: ["algo-l"], state: { m3: "ok" } },
      // 6 Explore and the saved queries
      { show: [...base, "m1", "m2", "m3", "person", "explore", "queries", "q"], active: ["explore", "q"], state: { person: "ok" } },
    ],
  },
};
