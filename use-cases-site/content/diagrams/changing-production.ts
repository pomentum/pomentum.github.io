import type { UseCaseMeta } from "../types";

// Changing production safely: a fix built in the open cell, its runs counted, a person's review, the promotion into the
// protected cell, a direct deploy refused, a rollback. Source: the promotion trial in docs/trials/ on main.

const chips = (p: string, x: number) => [
  { id: `${p}-1`, kind: "chip" as const, x, y: 236, w: 168, h: 30, label: "order received", hue: 0 as const },
  { id: `${p}-2`, kind: "chip" as const, x, y: 282, w: 168, h: 30, label: "score the order", hue: 1 as const },
  { id: `${p}-3`, kind: "chip" as const, x, y: 328, w: 168, h: 30, label: "answer", hue: 3 as const },
];

const base = ["dev-person", "reviewer", "cp", "audit", "tenant", "dev", "prod", "d-1", "d-2", "d-3", "p-1", "p-2", "p-3", "bus"];

export const changingProduction: UseCaseMeta = {
  slug: "changing-production",
  kind: "people",
  status: "shown",
  thumb: 5,
  metrics: ["version", "direct", "review", "record"],
  parts: ["cell", "protected-cell", "promotion", "review", "audit"],
  related: ["cold-room", "outside-agent", "orders-review"],
  shot: "pipelines",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "dev-person", kind: "icon", icon: "person", x: 30, y: 16, w: 110, h: 86, label: "a developer" },
      { id: "reviewer", kind: "icon", icon: "reviewer", x: 820, y: 16, w: 110, h: 86, label: "a reviewer" },
      { id: "cp", kind: "panel", x: 250, y: 20, w: 460, h: 70, label: "control plane", sub: "versions · checks · promotion requests", tone: "engine" },
      { id: "audit", kind: "icon", icon: "log", x: 820, y: 384, w: 110, h: 90, label: "audit log", sub: "chained by hash" },
      { id: "live", kind: "panel", x: 250, y: 140, w: 460, h: 280, label: "node-red · production", sub: "the only copy", tone: "danger" },
      { id: "l-1", kind: "chip", x: 290, y: 236, w: 200, h: 30, label: "order received", hue: 0 },
      { id: "l-2", kind: "chip", x: 290, y: 282, w: 200, h: 30, label: "score the order", hue: 1 },
      { id: "l-3", kind: "chip", x: 290, y: 328, w: 200, h: 30, label: "answer", hue: 3 },
      { id: "tenant", kind: "panel", x: 190, y: 124, w: 580, h: 318, label: "tenant · acme", tone: "neutral" },
      { id: "dev", kind: "panel", x: 214, y: 172, w: 226, h: 236, label: "acme-dev", sub: "open cell · v3", tone: "open" },
      { id: "prod", kind: "panel", x: 520, y: 172, w: 226, h: 236, label: "acme-prod", sub: "protected · v3", tone: "protected" },
      ...chips("d", 236),
      ...chips("p", 542),
      { id: "runs", kind: "pill", x: 240, y: 372, w: 170, h: 24, label: "runs: —" },
      { id: "bus", kind: "hbar", x: 190, y: 462, w: 580, h: 28, label: "bus · NATS JetStream" },
    ],
    flows: [
      { id: "edit-live", kind: "fail", pts: [[142, 60], [196, 60], [196, 252], [288, 252]], label: "edit in place", labelAt: 0.2 },
      { id: "deploy-dev", kind: "control", pts: [[142, 52], [326, 52], [326, 170]], label: "deploy v4", labelAt: 0.75 },
      { id: "bus-dev", kind: "data", pts: [[326, 460], [326, 410]] },
      { id: "count", kind: "control", pts: [[400, 170], [400, 92]], label: "syrmos runs", labelAt: 0.5 },
      { id: "ask", kind: "control", pts: [[712, 46], [818, 46]], label: "review?", labelAt: 0.5 },
      { id: "approve", kind: "control", pts: [[818, 70], [712, 70]], label: "approved", labelAt: 0.5 },
      { id: "promote", kind: "control", pts: [[442, 216], [518, 216]], label: "promote", labelAt: 0.5 },
      { id: "record", kind: "control", pts: [[712, 80], [790, 80], [790, 430], [818, 430]], label: "promoted", labelAt: 0.62 },
      { id: "direct", kind: "fail", pts: [[142, 70], [180, 70], [180, 112], [632, 112], [632, 170]], label: "deploy straight to prod", labelAt: 0.45, blockAt: 0.9 },
      { id: "refusal", kind: "fail", pts: [[712, 84], [790, 84], [790, 420], [818, 420]], label: "refused, recorded", labelAt: 0.6 },
      { id: "rollback", kind: "control", pts: [[680, 92], [680, 170]], label: "roll back", labelAt: 0.5 },
    ],
    steps: [
      // 1 PROBLEM: edits straight into production
      { show: ["dev-person", "live", "l-1", "l-2", "l-3", "edit-live"], active: ["edit-live"], state: { "l-2": "bad" } },
      // 2 two cells, two roles
      { show: base, state: { dev: "hi", prod: "hi" } },
      // 3 build the fix in the open cell
      { add: ["deploy-dev", "bus-dev", "runs"], active: ["deploy-dev", "bus-dev"], state: { "d-2": "ok" }, sub: { dev: "open cell · v4", "d-2": "score the order (fixed)", runs: "runs: running" } },
      // 4 runs counted
      { drop: ["deploy-dev"], add: ["count"], active: ["count", "bus-dev"], state: { runs: "hi" }, sub: { dev: "open cell · v4", "d-2": "score the order (fixed)", runs: "runs: counted" } },
      // 5 a person reviews
      { drop: ["count", "bus-dev"], add: ["ask", "approve"], active: ["ask", "approve"], state: { reviewer: "ok" }, sub: { dev: "open cell · v4", "d-2": "score the order (fixed)", runs: "runs: counted" } },
      // 6 promoted, on the record
      { drop: ["ask", "approve"], add: ["promote", "record"], active: ["promote", "record"], state: { prod: "hi", audit: "ok", "p-2": "ok" }, sub: { dev: "open cell · v4", prod: "protected · v4", "d-2": "score the order (fixed)", "p-2": "score the order (fixed)", runs: "runs: counted" } },
      // 7 a direct edit is refused
      { drop: ["promote", "record"], add: ["direct", "refusal"], active: ["refusal"], blocked: ["direct"], state: { audit: "warn" }, sub: { dev: "open cell · v4", prod: "protected · v4", "d-2": "score the order (fixed)", "p-2": "score the order (fixed)", runs: "runs: counted" } },
      // 8 roll back
      { drop: ["direct", "refusal"], add: ["rollback"], active: ["rollback"], state: { prod: "hi" }, sub: { dev: "open cell · v4", prod: "protected · v3, again", "d-2": "score the order (fixed)", runs: "runs: counted" } },
    ],
  },
};
