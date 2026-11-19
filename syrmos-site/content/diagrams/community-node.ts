import type { UseCaseMeta } from "../types";

// A community node, governed: a Node-RED community connector package is checked by the registry (publisher, provenance,
// signatures, advisories), its node described and approved by another operator, run in a connector cell of its own joined to
// other cells by hand-offs; its config node holds a placeholder, the gateway adds the login, a session's cookies are kept
// sealed by the gateway; a package reported as malicious is quarantined and refused at the gateway. Target: tried on a real
// package against stand-ins. Source: the decision on community connector nodes and docs/guide/features.md (Registry) on main.

const base = ["pkg", "registry", "reviewer", "cell", "n-node", "n-conf", "n-hand", "other", "o-in", "bus", "gateway", "bao", "svc"];

export const communityNode: UseCaseMeta = {
  slug: "community-node",
  kind: "integrations",
  status: "target",
  thumb: 3,
  metrics: ["login", "check", "quarantine"],
  parts: ["registry", "gateway", "cell", "bus"],
  related: ["odata-connector", "signed-webhooks", "many-tenants"],
  shot: "registry",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "pkg", kind: "icon", icon: "box", x: 22, y: 10, w: 100, h: 90, label: "a community package", sub: "from npm" },
      { id: "registry", kind: "panel", x: 160, y: 16, w: 320, h: 70, label: "registry", sub: "checked · approved by a second person", tone: "engine" },
      { id: "reviewer", kind: "icon", icon: "reviewer", x: 510, y: 8, w: 110, h: 90, label: "another operator" },
      { id: "shared", kind: "panel", x: 220, y: 140, w: 360, h: 260, label: "one Node-RED", sub: "any package, any login", tone: "danger" },
      { id: "s-node", kind: "chip", x: 250, y: 220, w: 300, h: 30, label: "community OData node", hue: 1 },
      { id: "s-login", kind: "chip", x: 250, y: 270, w: 300, h: 30, label: "its config: the real login", hue: 3 },
      { id: "other", kind: "panel", x: 30, y: 150, w: 160, h: 250, label: "acme-orders", sub: "open cell", tone: "open" },
      { id: "o-in", kind: "chip", x: 44, y: 230, w: 132, h: 30, label: "new orders", hue: 0 },
      { id: "cell", kind: "panel", x: 230, y: 150, w: 320, h: 250, label: "acme-erp", sub: "a connector cell of its own", tone: "open" },
      { id: "n-hand", kind: "chip", x: 252, y: 216, w: 276, h: 30, label: "intake · orders", hue: 0 },
      { id: "n-node", kind: "chip", x: 252, y: 266, w: 276, h: 30, label: "community OData node", hue: 1 },
      { id: "n-conf", kind: "chip", x: 252, y: 316, w: 276, h: 30, label: "its config: a placeholder", hue: 2 },
      { id: "bus", kind: "hbar", x: 30, y: 450, w: 560, h: 28, label: "bus · hand-offs between cells" },
      { id: "gateway", kind: "bar", x: 640, y: 120, w: 34, h: 320, label: "credential gateway", tone: "protected" },
      { id: "bao", kind: "pill", x: 690, y: 396, w: 150, h: 26, label: "login · OpenBao", tone: "protected" },
      { id: "session", kind: "pill", x: 690, y: 350, w: 150, h: 26, label: "session · sealed", tone: "protected" },
      { id: "svc", kind: "icon", icon: "building", side: "left", x: 846, y: 220, w: 100, h: 96, label: "an ERP", sub: "OData service" },
    ],
    flows: [
      { id: "leak", kind: "fail", pts: [[582, 285], [844, 285]], label: "the login lives in the flow", labelAt: 0.5 },
      { id: "pkg-reg", kind: "control", pts: [[124, 52], [158, 52]], label: "check", labelAt: 0.5 },
      { id: "approve", kind: "control", pts: [[508, 50], [482, 50]], label: "approve", labelAt: 0.5 },
      { id: "reg-cell", kind: "control", pts: [[390, 88], [390, 148]], label: "allow-list", labelAt: 0.5 },
      { id: "o-bus", kind: "data", pts: [[110, 402], [110, 448]], msg: "order" },
      { id: "bus-cell", kind: "data", pts: [[500, 448], [500, 402]] },
      { id: "node-gw", kind: "gateway", pts: [[530, 281], [638, 281]], msg: "call" },
      { id: "gw-svc", kind: "gateway", pts: [[676, 281], [844, 281]], msg: "+ login" },
      { id: "bao-gw", kind: "gateway", pts: [[688, 409], [676, 409]] },
      { id: "sess-gw", kind: "gateway", pts: [[688, 363], [676, 363]] },
      { id: "block", kind: "fail", pts: [[530, 281], [638, 281]], label: "quarantined: refused", labelAt: 0.5, blockAt: 0.7 },
    ],
    steps: [
      // 1 PROBLEM: any package, its login in the flow
      { show: ["shared", "s-node", "s-login", "svc", "leak"], active: ["leak"], state: { "s-login": "bad", shared: "bad" } },
      // 2 checked before it runs
      { show: ["pkg", "registry", "reviewer", "pkg-reg", "approve"], active: ["pkg-reg", "approve"], state: { registry: "hi", reviewer: "ok" } },
      // 3 a connector cell of its own
      { show: [...base, "reg-cell", "o-bus", "bus-cell"], active: ["reg-cell", "o-bus", "bus-cell"], state: { cell: "hi" } },
      // 4 a placeholder in the cell, the login at the gateway
      { show: [...base, "node-gw", "gw-svc", "bao-gw"], active: ["node-gw", "gw-svc", "bao-gw"], state: { "n-conf": "ok", gateway: "hi", bao: "hi" } },
      // 5 a session kept sealed
      { show: [...base, "session", "node-gw", "gw-svc", "sess-gw"], active: ["node-gw", "gw-svc", "sess-gw"], state: { session: "hi", "n-node": "ok" } },
      // 6 quarantined: refused at once
      { show: [...base, "block"], active: ["block"], blocked: ["block"], state: { registry: "bad", "n-node": "bad" }, sub: { registry: "quarantined · a malicious report" } },
    ],
  },
};
