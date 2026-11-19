import type { UseCaseMeta } from "../types";

// A failed batch, fixed and sent again: a strict stage fails a batch with no total, an error no later try can change, so it is
// dead-lettered on its first attempt with its source, attempt and error; the fix is deployed, a person offers the batch again, it
// runs on the fixed version and succeeds, on the record. Source: the reviewed batch publication trial on main (23 checks,
// 2026-10-26) and docs/guide/features.md (Durable pipelines, Run tracing).

const base = ["system", "bridge", "cp", "cell", "c-in", "c-check", "c-publish", "bus", "dlq", "person", "audit"];

export const deadLetters: UseCaseMeta = {
  slug: "dead-letters",
  kind: "integrations",
  status: "shown",
  thumb: 4,
  metrics: ["batch", "retries", "version"],
  parts: ["bus", "tracing", "audit", "cell"],
  related: ["batch-review", "polled-database", "cold-room"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "system", kind: "icon", icon: "box", x: 22, y: 200, w: 100, h: 96, label: "the system upstream" },
      { id: "bridge", kind: "bar", x: 150, y: 110, w: 34, h: 330, label: "connector bridge", tone: "open" },
      { id: "cp", kind: "panel", x: 240, y: 16, w: 420, h: 66, label: "control plane", sub: "versions · dead letters · audit", tone: "engine" },
      { id: "flow", kind: "panel", x: 220, y: 130, w: 480, h: 260, label: "one flow", sub: "messages in memory", tone: "danger" },
      { id: "f-check", kind: "chip", x: 250, y: 220, w: 300, h: 30, label: "a batch that fails", hue: 3 },
      { id: "cell", kind: "panel", x: 220, y: 120, w: 480, h: 290, label: "acme-batches", sub: "v1", tone: "open" },
      { id: "c-in", kind: "chip", x: 250, y: 190, w: 420, h: 30, label: "batch in", hue: 0 },
      { id: "c-check", kind: "chip", x: 250, y: 250, w: 420, h: 30, label: "check the total · strict", hue: 2 },
      { id: "c-publish", kind: "chip", x: 250, y: 310, w: 420, h: 30, label: "publish", hue: 1 },
      { id: "bus", kind: "hbar", x: 220, y: 450, w: 480, h: 28, label: "bus · NATS JetStream" },
      { id: "dlq", kind: "pill", x: 730, y: 250, w: 200, h: 26, label: "dead letters · 1", tone: "danger" },
      { id: "person", kind: "icon", icon: "person", side: "left", x: 830, y: 330, w: 110, h: 90, label: "a person", sub: "offers it again" },
      { id: "audit", kind: "pill", x: 720, y: 30, w: 210, h: 26, label: "audit log", tone: "neutral" },
    ],
    flows: [
      { id: "lost", kind: "fail", pts: [[552, 235], [760, 235]], label: "lost, or tried for ever", labelAt: 0.5, blockAt: 0.85 },
      { id: "in", kind: "data", pts: [[124, 205], [248, 205]], msg: "no total" },
      { id: "to-dlq", kind: "fail", pts: [[672, 265], [728, 265]], label: "first attempt", labelAt: 0.5 },
      { id: "deploy", kind: "control", pts: [[450, 84], [450, 118]], label: "deploy the fix · v2", labelAt: 0.4 },
      { id: "offer", kind: "control", pts: [[884, 328], [884, 280], [830, 280]], label: "offer again", labelAt: 0.3 },
      { id: "again", kind: "data", pts: [[728, 270], [710, 270], [710, 205], [672, 205]], msg: "again" },
      { id: "out", kind: "data", pts: [[672, 325], [760, 325]], msg: "published" },
      { id: "audit-l", kind: "control", pts: [[662, 43], [718, 43]] },
    ],
    steps: [
      // 1 PROBLEM: a failed message is lost, or tried for ever
      { show: ["system", "flow", "f-check", "lost"], active: ["lost"], blocked: ["lost"], state: { flow: "bad", "f-check": "bad" } },
      // 2 a batch with no total fails a strict check
      { show: [...base, "in"], active: ["in"], state: { "c-check": "bad" } },
      // 3 not tried in vain: dead-lettered at once
      { show: [...base, "to-dlq"], active: ["to-dlq"], state: { dlq: "warn", "c-check": "bad" } },
      // 4 the fix deployed
      { show: [...base, "deploy"], active: ["deploy"], state: { cell: "hi", "c-check": "ok" }, sub: { cell: "v2" } },
      // 5 offered again, on the fixed version
      { show: [...base, "offer", "again", "out"], active: ["offer", "again", "out"], state: { "c-check": "ok", "c-publish": "ok", person: "ok" }, sub: { cell: "v2", dlq: "dead letters · 0" } },
      // 6 on the record
      { show: [...base, "audit-l"], active: ["audit-l"], state: { audit: "hi" }, sub: { cell: "v2", dlq: "dead letters · 0", audit: "audit log · offered again" } },
    ],
  },
};
