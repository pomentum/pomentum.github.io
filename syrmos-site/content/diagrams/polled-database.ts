import type { UseCaseMeta } from "../types";

// Polled database to files: new rows polled by the connector bridge into the intake, each a run, its result handed on to a
// bucket the bridge writes, one object per message; a failed row kept as a dead letter. Sources: features.md (Databases,
// Connector bridge, Durable pipelines) and the brokers trial's bucket sink, on main.

const L = 300;
const chip = (id: string, y: number, label: string, hue: 0 | 1 | 2 | 3) => ({ id, kind: "chip" as const, x: L, y, w: 220, h: 30, label, hue });
const base = ["db", "bucket", "bridge", "cursor", "cp", "tenant", "cell", "c-in", "c-map", "c-out", "bus"];

export const polledDatabase: UseCaseMeta = {
  slug: "polled-database",
  kind: "integrations",
  status: "target",
  thumb: 3,
  metrics: ["password", "lost", "failed"],
  parts: ["bridge", "bus", "cell", "tracing"],
  related: ["signed-webhooks", "cold-room", "orders-review"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "db", kind: "icon", icon: "database", x: 22, y: 126, w: 110, h: 96, label: "PostgreSQL", sub: "new rows" },
      { id: "bucket", kind: "icon", icon: "bucket", x: 22, y: 316, w: 110, h: 96, label: "object storage", sub: "one object per row" },
      { id: "bridge", kind: "bar", x: 162, y: 110, w: 34, h: 330, label: "connector bridge", tone: "open" },
      { id: "cursor", kind: "pill", x: 250, y: 494, w: 200, h: 22, label: "cursor kept on the bus" },
      { id: "cp", kind: "panel", x: 300, y: 16, w: 380, h: 66, label: "control plane", sub: "runs traced · dead letters", tone: "engine" },
      { id: "script", kind: "panel", x: 240, y: 110, w: 520, h: 330, label: "a script on a timer", sub: "cron, every few minutes", tone: "danger" },
      { id: "s-pw", kind: "chip", x: 280, y: 200, w: 240, h: 30, label: "database password inside", hue: 2 },
      { id: "s-loop", kind: "chip", x: 280, y: 260, w: 240, h: 30, label: "read every new row", hue: 0 },
      { id: "s-write", kind: "chip", x: 280, y: 320, w: 240, h: 30, label: "write the files", hue: 3 },
      { id: "tenant", kind: "panel", x: 240, y: 110, w: 520, h: 330, label: "tenant · acme", tone: "neutral" },
      { id: "cell", kind: "panel", x: 262, y: 132, w: 476, h: 290, label: "acme-prod", sub: "protected cell · rows to files", tone: "protected" },
      chip("c-in", 206, "row in (intake)", 0),
      chip("c-map", 262, "shape the result", 1),
      chip("c-out", 318, "hand off to the archive", 3),
      { id: "dead", kind: "pill", x: 560, y: 262, w: 156, h: 26, label: "dead letters: 0" },
      { id: "bus", kind: "hbar", x: 240, y: 462, w: 520, h: 28, label: "bus · NATS JetStream" },
    ],
    flows: [
      { id: "s-read", kind: "data", pts: [[134, 170], [278, 275]], msg: "rows" },
      { id: "s-files", kind: "fail", pts: [[278, 335], [134, 360]], label: "lost on a crash", labelAt: 0.5 },
      { id: "db-br", kind: "data", pts: [[134, 170], [160, 170]], msg: "row" },
      { id: "br-bus", kind: "data", pts: [[179, 442], [179, 476], [238, 476]] },
      { id: "bus-in", kind: "data", pts: [[330, 460], [330, 420]] },
      { id: "in-map", kind: "data", pts: [[290, 221], [290, 277], [298, 277]] },
      { id: "map-out", kind: "data", pts: [[290, 277], [290, 333], [298, 333]] },
      { id: "out-bus", kind: "data", pts: [[470, 350], [470, 460]], msg: "result" },
      { id: "bus-br", kind: "data", pts: [[238, 484], [190, 484], [190, 442]] },
      { id: "br-bucket", kind: "data", pts: [[160, 360], [134, 360]], msg: "object" },
      { id: "fail", kind: "fail", pts: [[522, 277], [558, 277]], label: "fails", labelAt: 0.5 },
      { id: "kill", kind: "fail", pts: [[640, 84], [640, 144]], label: "cell killed", labelAt: 0.5 },
    ],
    steps: [
      // 1 PROBLEM: a script on a timer
      { show: ["db", "bucket", "script", "s-pw", "s-loop", "s-write", "s-read", "s-files"], active: ["s-read", "s-files"], state: { "s-pw": "bad" } },
      // 2 new rows polled into the intake
      { show: [...base, "db-br", "br-bus", "bus-in"], active: ["db-br", "br-bus", "bus-in"], state: { bridge: "hi", cursor: "hi", "c-in": "ok" } },
      // 3 each row, a run
      { show: [...base, "in-map", "map-out"], active: ["in-map", "map-out"], trace: ["c-in", "c-map", "c-out"] },
      // 4 written to object storage
      { show: [...base, "in-map", "map-out", "out-bus", "bus-br", "br-bucket"], active: ["out-bus", "bus-br", "br-bucket"], state: { bucket: "ok", "c-out": "ok" } },
      // 5 a broken row, kept
      { show: [...base, "in-map", "dead", "fail"], active: ["fail"], state: { "c-map": "bad", dead: "warn" }, sub: { dead: "dead letters: 1" } },
      // 6 a restart loses nothing
      { show: [...base, "in-map", "map-out", "kill", "db-br", "br-bus", "bus-in"], active: ["kill", "db-br", "br-bus", "bus-in"], state: { cell: "warn", "c-in": "ok" }, sub: { cell: "started again · rows waited on the bus" } },
    ],
  },
};
