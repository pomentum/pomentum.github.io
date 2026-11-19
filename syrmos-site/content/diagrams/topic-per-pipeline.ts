import type { UseCaseMeta } from "../types";

// One broker connection, a topic per pipeline: the connection's topic is a ceiling (sensors/#); one pipeline reads it whole,
// another only sensors/room-1; a topic outside is refused at deploy and checked again by the bridge; a hand-off may write to
// each message's own topic, one outside the sink's dead-lettered. Source: the broker trial on main (23 of 23 checks,
// 2026-11-19) and the decision on a pipeline's topic, with docs/guide/features.md (Connector bridge).

const base = ["rooms", "bridge", "conn", "cp", "cell", "bus"];

export const topicPerPipeline: UseCaseMeta = {
  slug: "topic-per-pipeline",
  kind: "integrations",
  status: "shown",
  thumb: 3,
  metrics: ["connections", "room", "outside"],
  parts: ["bridge", "bus", "cell"],
  related: ["cold-room", "polled-database", "signed-webhooks"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "rooms", kind: "icon", icon: "sensor", x: 22, y: 200, w: 100, h: 96, label: "rooms 0 to 2", sub: "MQTT" },
      { id: "bridge", kind: "bar", x: 150, y: 110, w: 34, h: 330, label: "connector bridge", tone: "open" },
      { id: "pc0", kind: "pill", x: 200, y: 92, w: 230, h: 26, label: "connection · sensors/room-0" },
      { id: "pc1", kind: "pill", x: 200, y: 122, w: 230, h: 26, label: "connection · sensors/room-1" },
      { id: "pc2", kind: "pill", x: 200, y: 152, w: 230, h: 26, label: "connection · sensors/room-2" },
      { id: "conn", kind: "pill", x: 200, y: 110, w: 230, h: 26, label: "one connection · sensors/#", tone: "open" },
      { id: "cp", kind: "panel", x: 460, y: 16, w: 300, h: 66, label: "control plane", sub: "deploy checks every topic", tone: "engine" },
      { id: "cell", kind: "panel", x: 230, y: 210, w: 480, h: 220, label: "acme-readings", sub: "open cell", tone: "open" },
      { id: "p-all", kind: "chip", x: 256, y: 264, w: 210, h: 30, label: "every room · sensors/#", hue: 0 },
      { id: "p-room", kind: "chip", x: 256, y: 316, w: 210, h: 30, label: "room 1 · sensors/room-1", hue: 1 },
      { id: "p-bad", kind: "chip", x: 256, y: 368, w: 210, h: 30, label: "sensors-old/#", hue: 3 },
      { id: "h-all", kind: "chip", x: 490, y: 264, w: 196, h: 30, label: "hand off · results", hue: 0 },
      { id: "h-room", kind: "chip", x: 490, y: 316, w: 196, h: 30, label: "hand off · msg.topic", hue: 1 },
      { id: "bus", kind: "hbar", x: 200, y: 460, w: 510, h: 28, label: "bus · NATS JetStream" },
      { id: "kafka", kind: "icon", icon: "database", side: "left", x: 830, y: 230, w: 110, h: 96, label: "Kafka", sub: "results/…" },
      { id: "dlq", kind: "pill", x: 740, y: 400, w: 170, h: 26, label: "dead letters", tone: "danger" },
    ],
    flows: [
      { id: "r-br", kind: "data", pts: [[124, 248], [148, 248]] },
      { id: "br-bus", kind: "data", pts: [[167, 442], [167, 474], [198, 474]] },
      { id: "bus-all", kind: "data", pts: [[244, 458], [244, 279], [254, 279]], msg: "15 readings" },
      { id: "bus-room", kind: "data", pts: [[250, 458], [250, 331], [254, 331]], msg: "r1, r4, r7…" },
      { id: "deploy-ok", kind: "control", pts: [[540, 84], [540, 208]], label: "deploy · within sensors/#", labelAt: 0.4 },
      { id: "deploy-bad", kind: "fail", pts: [[480, 84], [480, 150], [470, 150], [470, 383], [468, 383]], label: "outside: refused", labelAt: 0.2, blockAt: 0.25 },
      { id: "out-all", kind: "data", pts: [[688, 279], [828, 279]], msg: "results" },
      { id: "out-room", kind: "data", pts: [[688, 331], [770, 331], [770, 300], [828, 300]], msg: "results/room-1" },
      { id: "out-bad", kind: "fail", pts: [[688, 338], [720, 338], [720, 413], [738, 413]], label: "topic outside the sink's", labelAt: 0.5 },
    ],
    steps: [
      // 1 PROBLEM: a connection per topic
      { show: ["rooms", "bridge", "pc0", "pc1", "pc2", "cell", "p-all", "p-room", "r-br"], active: ["r-br"], state: { pc0: "warn", pc1: "warn", pc2: "warn" } },
      // 2 one connection, a ceiling
      { show: [...base, "r-br"], active: ["r-br"], state: { conn: "hi" } },
      // 3 each pipeline chooses within it
      { show: [...base, "p-all", "p-room", "deploy-ok"], active: ["deploy-ok"], state: { "p-room": "hi", cp: "hi" } },
      // 4 one subscription, routed to every match
      { show: [...base, "p-all", "p-room", "r-br", "br-bus", "bus-all", "bus-room"], active: ["r-br", "br-bus", "bus-all", "bus-room"], state: { "p-all": "ok", "p-room": "ok" } },
      // 5 outside the ceiling: refused
      { show: [...base, "p-all", "p-room", "p-bad", "deploy-bad"], active: ["deploy-bad"], blocked: ["deploy-bad"], state: { "p-bad": "bad" } },
      // 6 a hand-off to each message's topic, checked
      {
        show: [...base, "p-all", "p-room", "h-all", "h-room", "kafka", "dlq", "out-all", "out-room", "out-bad"],
        active: ["out-all", "out-room", "out-bad"],
        state: { kafka: "ok", "h-room": "hi", dlq: "warn" },
      },
    ],
  },
};
