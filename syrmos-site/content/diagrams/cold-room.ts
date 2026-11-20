import type { UseCaseMeta } from "../types";

// Cold room monitoring: fridge readings over MQTT into a tenant's protected cell, a warm one alerting the on-call through the
// gateway, the run traced, a new threshold built in the open cell and promoted after a review, then rolled back.
// Source: the landing page's demo (docs/index.html, Fig 02, and tools/generate/ui-demo.mjs on main).

const cellChips = (p: string, x: number, threshold: string) => [
  { id: `${p}-in`, kind: "chip" as const, x, y: 222, w: 172, h: 30, label: "readings in", hue: 0 as const },
  { id: `${p}-chk`, kind: "chip" as const, x, y: 272, w: 172, h: 30, label: `warmer than ${threshold}?`, hue: 2 as const },
  { id: `${p}-alert`, kind: "chip" as const, x, y: 322, w: 172, h: 30, label: "alert the on-call", hue: 3 as const },
];

const base = ["fridges", "bridge", "bus", "gateway", "phone", "openbao", "cp", "tenant", "prod", "p-in", "p-chk", "p-alert"];

export const coldRoom: UseCaseMeta = {
  slug: "cold-room",
  kind: "plant",
  status: "shown",
  // not in the recorded demo (see the status note): the typed password refused, the alert reaching the on-call, the step back
  evidence: { 1: "target", 4: "target", 7: "target" },
  thumb: 4,
  metrics: ["alert", "secrets", "review", "version"],
  parts: ["bridge", "protected-cell", "gateway", "tracing", "promotion"],
  related: ["customers-apart", "change-safely", "connect-services"],
  shot: "demo",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "fridges", kind: "icon", icon: "fridge", x: 22, y: 222, w: 92, h: 96, label: "fridges", sub: "MQTT" },
      { id: "editor", kind: "icon", icon: "person", x: 22, y: 14, w: 92, h: 86, label: "a direct edit" },
      { id: "reviewer", kind: "icon", icon: "reviewer", x: 846, y: 8, w: 96, h: 86, label: "a reviewer" },
      { id: "phone", kind: "icon", icon: "chat", x: 846, y: 222, w: 96, h: 96, label: "the on-call", sub: "chat" },
      { id: "bridge", kind: "bar", x: 150, y: 110, w: 34, h: 330, label: "connector bridge", tone: "open" },
      { id: "gateway", kind: "bar", x: 762, y: 110, w: 34, h: 330, label: "credential gateway", tone: "protected" },
      { id: "openbao", kind: "pill", x: 812, y: 380, w: 120, h: 26, label: "secret · OpenBao", tone: "protected" },
      { id: "cp", kind: "panel", x: 300, y: 18, w: 360, h: 66, label: "control plane", sub: "versions · checks · promotion · traces", tone: "engine" },
      { id: "shared", kind: "panel", x: 220, y: 110, w: 500, h: 330, label: "one Node-RED", sub: "every customer's flows", tone: "danger" },
      { id: "s-a", kind: "chip", x: 250, y: 176, w: 200, h: 30, label: "customer A · billing", hue: 0 },
      { id: "s-b", kind: "chip", x: 250, y: 222, w: 200, h: 30, label: "customer B · orders", hue: 1 },
      { id: "s-c", kind: "chip", x: 250, y: 268, w: 200, h: 30, label: "cold room", hue: 2 },
      { id: "s-tok", kind: "chip", x: 250, y: 330, w: 200, h: 30, label: "chat token in a node", hue: 3 },
      { id: "tenant", kind: "panel", x: 220, y: 110, w: 520, h: 330, label: "tenant · acme", tone: "neutral" },
      { id: "dev", kind: "panel", x: 240, y: 160, w: 216, h: 240, label: "acme-dev", sub: "open cell", tone: "open" },
      { id: "prod", kind: "panel", x: 498, y: 160, w: 216, h: 240, label: "acme-prod", sub: "protected cell · v1", tone: "protected" },
      ...cellChips("d", 260, "4 °C"),
      ...cellChips("p", 518, "5 °C"),
      { id: "bus", kind: "hbar", x: 220, y: 460, w: 490, h: 28, label: "bus · NATS JetStream" },
    ],
    flows: [
      { id: "leak-in", kind: "data", pts: [[116, 270], [218, 270]], msg: "3.2 °C" },
      { id: "leak-out", kind: "fail", pts: [[722, 300], [844, 300]], label: "token in the flow", labelAt: 0.5 },
      { id: "f-br", kind: "data", pts: [[116, 270], [148, 270]] },
      { id: "br-bus", kind: "data", pts: [[167, 442], [167, 474], [218, 474]] },
      { id: "bus-prod", kind: "data", pts: [[606, 458], [606, 402]], msg: "3.4 °C" },
      { id: "bus-warm", kind: "data", pts: [[606, 458], [606, 402]], msg: "6.1 °C" },
      { id: "alert-gw", kind: "gateway", pts: [[692, 337], [760, 337]], msg: "alert" },
      { id: "gw-phone", kind: "gateway", pts: [[798, 337], [822, 337], [822, 290], [844, 290]] },
      { id: "bao-gw", kind: "gateway", pts: [[810, 393], [798, 393]] },
      { id: "trace", kind: "control", pts: [[620, 158], [620, 86]], label: "trace", labelAt: 0.5 },
      { id: "deploy-dev", kind: "control", pts: [[348, 86], [348, 158]], label: "deploy v2", labelAt: 0.12 },
      { id: "bus-dev", kind: "data", pts: [[348, 458], [348, 402]], msg: "6.1 °C" },
      { id: "approve", kind: "control", pts: [[844, 52], [662, 52]], label: "approve", labelAt: 0.3 },
      { id: "promote", kind: "control", pts: [[458, 196], [496, 196]], label: "promote", labelAt: 0.5 },
      { id: "direct", kind: "fail", pts: [[116, 56], [200, 56], [200, 96], [560, 96], [560, 158]], label: "edit prod directly", labelAt: 0.12, blockAt: 0.86 },
      { id: "rollback", kind: "control", pts: [[540, 86], [540, 158]], label: "roll back", labelAt: 0.5 },
    ],
    steps: [
      // 1 PROBLEM: one Node-RED for everything
      { show: ["fridges", "phone", "shared", "s-a", "s-b", "s-c", "s-tok", "leak-in", "leak-out"], active: ["leak-in", "leak-out"], state: { "s-tok": "bad" } },
      // 2 a cell for the tenant
      { show: base, state: { prod: "hi" } },
      // 3 readings arrive
      { add: ["f-br", "br-bus", "bus-prod"], active: ["f-br", "br-bus", "bus-prod"], state: { bridge: "hi", "p-in": "ok" } },
      // 4 a fridge warms up
      { drop: ["bus-prod"], add: ["bus-warm"], active: ["f-br", "br-bus", "bus-warm"], state: { "p-chk": "warn" } },
      // 5 alert without a secret
      { add: ["alert-gw", "gw-phone", "bao-gw"], active: ["alert-gw", "gw-phone", "bao-gw"], state: { gateway: "hi", "p-alert": "ok", openbao: "hi", phone: "ok" } },
      // 6 every step traced
      { drop: ["f-br", "br-bus", "bus-warm", "alert-gw", "gw-phone", "bao-gw"], add: ["trace"], active: ["trace"], trace: ["p-in", "p-chk", "p-alert"], state: { cp: "hi" } },
      // 7 change the threshold safely
      {
        show: [...base, "dev", "d-in", "d-chk", "d-alert", "reviewer", "editor", "deploy-dev", "bus-dev", "approve", "promote", "direct"],
        active: ["deploy-dev", "bus-dev", "approve", "promote"],
        blocked: ["direct"],
        state: { dev: "hi", "d-chk": "ok", reviewer: "ok" },
        sub: { prod: "protected cell · v2", dev: "open cell · v2", "p-chk": "warmer than 4 °C?" },
      },
      // 8 roll back in one step
      {
        show: [...base, "dev", "d-in", "d-chk", "d-alert", "rollback"],
        active: ["rollback"],
        state: { prod: "hi", cp: "hi" },
        sub: { prod: "protected cell · v1, again", dev: "open cell · v2" },
      },
    ],
  },
};
