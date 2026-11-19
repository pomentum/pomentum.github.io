import type { UseCaseMeta } from "../types";

// A batch reviewed before it is published: the system that starts it mints the run key; the batch is matched, waits for a person's
// review, and is published, each stage a run linked under the batch's key; a run is replayed from its intake message, on the record.
// Source: the reviewed batch publication trial on main (15 checks, 2026-10-24; replay since 2026-10-26).

const base = ["system", "bridge", "cp", "cell", "c-match", "c-review", "c-publish", "bus", "reviewer", "out", "audit"];

export const batchReview: UseCaseMeta = {
  slug: "batch-review",
  kind: "people",
  status: "shown",
  thumb: 3,
  metrics: ["review", "follow", "replay"],
  parts: ["review", "tracing", "audit", "bus"],
  related: ["dead-letters", "orders-review", "changing-production"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "system", kind: "icon", icon: "box", x: 22, y: 200, w: 100, h: 96, label: "the system upstream", sub: "mints the run key" },
      { id: "bridge", kind: "bar", x: 150, y: 110, w: 34, h: 330, label: "connector bridge", tone: "open" },
      { id: "cp", kind: "panel", x: 240, y: 16, w: 420, h: 66, label: "control plane", sub: "runs linked by key · reviews · audit", tone: "engine" },
      { id: "flow", kind: "panel", x: 220, y: 130, w: 480, h: 260, label: "one flow", sub: "match, then publish", tone: "danger" },
      { id: "f-match", kind: "chip", x: 250, y: 200, w: 200, h: 30, label: "match", hue: 0 },
      { id: "f-publish", kind: "chip", x: 250, y: 260, w: 200, h: 30, label: "publish", hue: 1 },
      { id: "cell", kind: "panel", x: 220, y: 120, w: 480, h: 290, label: "acme-batches", sub: "a cell of the tenant", tone: "open" },
      { id: "c-match", kind: "chip", x: 250, y: 190, w: 420, h: 30, label: "match · run 1 of batch-0417", hue: 0 },
      { id: "c-review", kind: "chip", x: 250, y: 250, w: 420, h: 30, label: "review · waits for a person", hue: 2 },
      { id: "c-publish", kind: "chip", x: 250, y: 310, w: 420, h: 30, label: "publish · run 2 of batch-0417", hue: 1 },
      { id: "bus", kind: "hbar", x: 220, y: 450, w: 480, h: 28, label: "bus · NATS JetStream" },
      { id: "reviewer", kind: "icon", icon: "reviewer", side: "left", x: 830, y: 120, w: 110, h: 90, label: "a reviewer" },
      { id: "out", kind: "icon", icon: "bucket", side: "left", x: 830, y: 290, w: 110, h: 96, label: "the publication" },
      { id: "audit", kind: "pill", x: 720, y: 30, w: 210, h: 26, label: "audit log", tone: "neutral" },
    ],
    flows: [
      { id: "unseen", kind: "fail", pts: [[452, 275], [828, 275], [828, 330]], label: "published unseen", labelAt: 0.4 },
      { id: "in", kind: "data", pts: [[124, 205], [148, 205]], msg: "batch-0417" },
      { id: "br-match", kind: "data", pts: [[186, 205], [248, 205]] },
      { id: "ask", kind: "control", pts: [[672, 265], [760, 265], [760, 165], [828, 165]], label: "review asked", labelAt: 0.6 },
      { id: "decide", kind: "control", pts: [[828, 185], [780, 185], [780, 255], [672, 255]], label: "approved", labelAt: 0.3 },
      { id: "publish", kind: "data", pts: [[672, 325], [828, 325]], msg: "published" },
      { id: "link", kind: "control", pts: [[450, 188], [450, 84]], label: "runs linked under batch-0417", labelAt: 0.5 },
      { id: "replay", kind: "control", pts: [[350, 84], [350, 188]], label: "replay", labelAt: 0.5 },
      { id: "audit-l", kind: "control", pts: [[662, 43], [718, 43]] },
    ],
    steps: [
      // 1 PROBLEM: published without a look
      { show: ["system", "flow", "f-match", "f-publish", "out", "unseen"], active: ["unseen"], state: { flow: "bad", "f-publish": "bad" } },
      // 2 a key from the start
      { show: [...base, "in", "br-match"], active: ["in", "br-match"], state: { "c-match": "ok" } },
      // 3 it waits for a person
      { show: [...base, "ask"], active: ["ask"], state: { "c-review": "warn", reviewer: "hi" } },
      // 4 approved, then published
      { show: [...base, "decide", "publish"], active: ["decide", "publish"], state: { "c-review": "ok", "c-publish": "ok", out: "ok" } },
      // 5 one batch, linked runs
      { show: [...base, "link"], active: ["link"], trace: ["c-match", "c-review", "c-publish"], state: { cp: "hi" } },
      // 6 replayed, on the record
      { show: [...base, "replay", "audit-l"], active: ["replay", "audit-l"], state: { "c-match": "ok", audit: "hi" }, sub: { "c-match": "match · replayed, under batch-0417" } },
    ],
  },
};
