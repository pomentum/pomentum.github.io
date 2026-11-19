import type { DNode, UseCaseMeta } from "../types";

// One platform, many tenants: a cell per customer on a network of its own; a compromised cell reaches no neighbour, no outside
// address and no secret. Source: the cell contract's conformance status (docs/guide/cell-contract.md on main) and the landing
// page's Security section.

const tenants = [
  { t: "acme", cell: "acme-prod", tone: "protected" as const, x: 20 },
  { t: "demo", cell: "demo-dev", tone: "open" as const, x: 320 },
  { t: "sample", cell: "sample-prod", tone: "protected" as const, x: 620 },
];

const tenantNodes: DNode[] = tenants.flatMap(({ t, cell, tone, x }) => [
  { id: `t-${t}`, kind: "panel", x, y: 104, w: 280, h: 232, label: `tenant · ${t}`, tone: "neutral" },
  { id: `net-${t}`, kind: "panel", x: x + 10, y: 142, w: 260, h: 180, label: "", tone: "ghost", dashed: true },
  { id: `c-${t}`, kind: "panel", x: x + 22, y: 154, w: 236, h: 156, label: cell, sub: tone === "open" ? "open cell" : "protected cell", tone },
  { id: `p-${t}`, kind: "chip", x: x + 40, y: 218, w: 200, h: 30, label: "pipelines", hue: tone === "open" ? 3 : 2 },
]);

const targets: DNode[] = [
  { id: "x-net", kind: "icon", icon: "globe", x: 60, y: 420, w: 130, h: 90, label: "the internet" },
  { id: "x-meta", kind: "icon", icon: "machine", x: 260, y: 420, w: 130, h: 90, label: "metadata address" },
  { id: "x-bao", kind: "icon", icon: "key", x: 460, y: 420, w: 130, h: 90, label: "secret store", sub: "OpenBao" },
  { id: "x-db", kind: "icon", icon: "database", x: 660, y: 420, w: 130, h: 90, label: "database", sub: "PostgreSQL" },
];

const cells = ["t-acme", "c-acme", "p-acme", "t-demo", "c-demo", "p-demo", "t-sample", "c-sample", "p-sample"];
const nets = ["net-acme", "net-demo", "net-sample"];
const attacks = ["a-acme", "a-net", "a-meta", "a-bao", "a-db"];

export const manyTenants: UseCaseMeta = {
  slug: "many-tenants",
  kind: "tenants",
  status: "shown",
  thumb: 3,
  metrics: ["reach", "secrets", "probes", "limits"],
  parts: ["cell", "bus", "gateway", "registry"],
  related: ["cold-room", "changing-production", "outside-agent"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "cp", kind: "panel", x: 300, y: 10, w: 360, h: 64, label: "control plane", sub: "holds no secret", tone: "engine" },
      { id: "shared", kind: "panel", x: 20, y: 104, w: 880, h: 232, label: "one Node-RED", sub: "three customers' flows", tone: "danger" },
      { id: "s-a", kind: "chip", x: 60, y: 200, w: 220, h: 30, label: "acme · integrations", hue: 0 },
      { id: "s-b", kind: "chip", x: 360, y: 200, w: 220, h: 30, label: "demo · Function node", hue: 1 },
      { id: "s-c", kind: "chip", x: 660, y: 200, w: 220, h: 30, label: "sample · reports", hue: 2 },
      ...tenantNodes,
      { id: "evil", kind: "chip", x: 360, y: 262, w: 200, h: 30, label: "compromised node", hue: 1 },
      { id: "gateway", kind: "bar", x: 918, y: 104, w: 32, h: 232, label: "credential gateway", tone: "protected" },
      { id: "bus", kind: "hbar", x: 20, y: 356, w: 880, h: 26, label: "bus · NATS JetStream" },
      ...targets,
    ],
    flows: [
      { id: "leak-a", kind: "fail", pts: [[470, 232], [470, 280], [170, 280], [170, 234]], label: "reads acme's flows", labelAt: 0.5 },
      { id: "leak-c", kind: "fail", pts: [[470, 232], [470, 280], [770, 280], [770, 234]] },
      { id: "cp-acme", kind: "control", pts: [[340, 76], [160, 76], [160, 102]] },
      { id: "cp-demo", kind: "control", pts: [[480, 76], [480, 102]] },
      { id: "cp-sample", kind: "control", pts: [[620, 76], [760, 76], [760, 102]] },
      { id: "bus-acme", kind: "data", pts: [[130, 354], [130, 312]] },
      { id: "bus-demo", kind: "data", pts: [[430, 354], [430, 312]] },
      { id: "bus-sample", kind: "data", pts: [[730, 354], [730, 312]] },
      { id: "a-acme", kind: "fail", pts: [[358, 277], [280, 277]], blockAt: 0.75 },
      { id: "a-net", kind: "fail", pts: [[400, 312], [400, 398], [125, 398], [125, 418]], blockAt: 0.9 },
      { id: "a-meta", kind: "fail", pts: [[440, 312], [440, 404], [325, 404], [325, 418]], blockAt: 0.9 },
      { id: "a-bao", kind: "fail", pts: [[500, 312], [500, 404], [525, 404], [525, 418]], blockAt: 0.9 },
      { id: "a-db", kind: "fail", pts: [[540, 312], [540, 398], [725, 398], [725, 418]], blockAt: 0.9 },
      { id: "by-name", kind: "gateway", pts: [[560, 233], [600, 233], [600, 92], [934, 92], [934, 102]], msg: "call by name" },
      { id: "bao-gw", kind: "gateway", pts: [[592, 470], [934, 470], [934, 338]], label: "secret added here", labelAt: 0.4 },
    ],
    steps: [
      // 1 PROBLEM: three customers, one runtime
      { show: ["shared", "s-a", "s-b", "s-c", "leak-a", "leak-c"], active: ["leak-a", "leak-c"], state: { "s-b": "bad" } },
      // 2 a cell per customer
      { show: ["cp", ...cells, "bus", "cp-acme", "cp-demo", "cp-sample"], active: ["cp-acme", "cp-demo", "cp-sample"], state: { "c-acme": "hi", "c-demo": "hi", "c-sample": "hi" } },
      // 3 a network of its own
      { show: ["cp", ...nets, ...cells, "bus", "bus-acme", "bus-demo", "bus-sample"], active: ["bus-acme", "bus-demo", "bus-sample"] },
      // 4 PROBLEM: a compromised cell
      { show: ["cp", ...nets, ...cells, "bus", "evil", ...targets.map((t) => t.id), ...attacks], blocked: attacks, active: attacks, state: { evil: "bad" } },
      // 5 no secret to steal
      { show: ["cp", ...nets, ...cells, "bus", "gateway", "x-bao", "by-name", "bao-gw"], active: ["by-name", "bao-gw"], state: { gateway: "hi", "x-bao": "hi" } },
      // 6 tested, not assumed
      {
        show: ["cp", ...nets, ...cells, "bus", "evil", ...targets.map((t) => t.id), ...attacks],
        blocked: attacks,
        active: attacks,
        state: { evil: "warn" },
        sub: { evil: "probe · negative control", "c-acme": "probes passed", "c-demo": "probes passed", "c-sample": "probes passed" },
      },
      // 7 limits per cell
      {
        show: ["cp", ...nets, ...cells, "bus"],
        state: { "c-acme": "ok", "c-demo": "ok", "c-sample": "ok" },
        sub: { "c-acme": "protected · 1 GB · 2 CPU", "c-demo": "open · 128 MB · ¼ CPU", "c-sample": "protected · 512 MB · 1 CPU" },
      },
    ],
  },
};
