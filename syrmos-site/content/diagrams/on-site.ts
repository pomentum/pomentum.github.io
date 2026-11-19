import type { UseCaseMeta } from "../types";

// On site, beside the machines: a spur, a tenant's own machine enrolled with one link, runs the cell its link named, syncs
// through the spur service, reads the site's machines as its administrator's local policy gives them (Modbus, OPC UA, the
// machine itself, read only), keeps running when the network is down, and asks a person before an agent changes its cell.
// In development. Sources on main: docs/guide/spurs.md, docs/guide/features.md (Spurs), the landing page (In development:
// spurs), and the music trial for running with the platform gone.

const base = ["cp", "spursvc", "person", "spur", "cell", "c-read", "c-check", "c-write", "machine", "sensor", "policy"];

export const onSite: UseCaseMeta = {
  slug: "on-site",
  kind: "plant",
  status: "dev",
  thumb: 3,
  metrics: ["offline", "write", "isolation"],
  parts: ["spur", "cell", "gateway", "registry"],
  related: ["print-scan", "music-spur", "pad-shortcuts"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "cp", kind: "panel", x: 200, y: 16, w: 300, h: 70, label: "control plane", sub: "versions · checks", tone: "engine" },
      { id: "spursvc", kind: "panel", x: 540, y: 16, w: 240, h: 70, label: "spur service", sub: "one sync over HTTPS", tone: "engine" },
      { id: "person", kind: "icon", icon: "reviewer", x: 830, y: 10, w: 110, h: 90, label: "a person", sub: "asked each time" },
      { id: "far", kind: "panel", x: 200, y: 16, w: 580, h: 90, label: "one Node-RED, far away", sub: "the only place the flows run", tone: "danger" },
      { id: "spur", kind: "panel", x: 60, y: 150, w: 840, h: 300, label: "spur · acme-line-1", sub: "a tenant's own machine", tone: "ghost", dashed: true },
      { id: "cell", kind: "panel", x: 330, y: 226, w: 300, h: 206, label: "acme-line-1", sub: "a spur cell, governed", tone: "open" },
      { id: "c-read", kind: "chip", x: 354, y: 290, w: 252, h: 30, label: "read the machine", hue: 0 },
      { id: "c-check", kind: "chip", x: 354, y: 336, w: 252, h: 30, label: "check the line", hue: 2 },
      { id: "c-write", kind: "chip", x: 354, y: 382, w: 252, h: 30, label: "change a setting", hue: 1 },
      { id: "machine", kind: "icon", icon: "machine", side: "right", x: 110, y: 196, w: 110, h: 96, label: "the machines", sub: "Modbus · OPC UA" },
      { id: "sensor", kind: "icon", icon: "sensor", side: "right", x: 110, y: 330, w: 110, h: 96, label: "the machine itself", sub: "disk · heat · USB" },
      { id: "policy", kind: "pill", x: 660, y: 290, w: 220, h: 26, label: "local policy: read only" },
    ],
    flows: [
      { id: "far-down", kind: "fail", pts: [[290, 108], [290, 200], [228, 250]], label: "network down", labelAt: 0.3, blockAt: 0.5 },
      { id: "sync", kind: "control", pts: [[660, 88], [660, 140], [560, 140], [560, 212]], label: "sync", labelAt: 0.25 },
      { id: "cp-svc", kind: "control", pts: [[502, 50], [538, 50]] },
      { id: "m-in", kind: "data", pts: [[222, 240], [300, 240], [300, 305], [352, 305]], msg: "reading" },
      { id: "s-in", kind: "data", pts: [[222, 372], [312, 372], [312, 351], [352, 351]] },
      { id: "ask", kind: "control", pts: [[608, 391], [800, 391], [800, 102], [828, 70]], label: "an agent's change asks first", labelAt: 0.45 },
      { id: "write-out", kind: "fail", pts: [[352, 397], [260, 397], [260, 262], [222, 262]], label: "write: not built", labelAt: 0.2, blockAt: 0.55 },
      { id: "sync-down", kind: "fail", pts: [[660, 88], [660, 140], [560, 140], [560, 212]], label: "network down", labelAt: 0.25, blockAt: 0.35 },
      { id: "policy-l", kind: "control", pts: [[658, 303], [632, 303]] },
    ],
    steps: [
      // 1 PROBLEM: the site's network drops
      { show: ["far", "machine", "sensor", "far-down"], active: ["far-down"], blocked: ["far-down"], state: { far: "bad" } },
      // 2 a spur, enrolled with one link
      { show: ["cp", "spursvc", "spur", "cp-svc"], active: ["cp-svc"], state: { spur: "hi" } },
      // 3 its cell, synced
      { show: ["cp", "spursvc", "spur", "cell", "c-read", "c-check", "c-write", "cp-svc", "sync"], active: ["cp-svc", "sync"], state: { cell: "hi" } },
      // 4 beside the machines, as the local policy gives them
      { show: [...base, "sync", "m-in", "s-in", "policy-l"], active: ["m-in", "s-in", "policy-l"], state: { policy: "hi", "c-read": "ok" } },
      // 5 offline, still running
      { show: [...base, "sync-down", "m-in", "s-in"], active: ["sync-down", "m-in", "s-in"], blocked: ["sync-down"], state: { cell: "ok", "c-check": "ok" } },
      // 6 read only; an agent's change asks a person
      { show: [...base, "sync", "ask", "write-out"], active: ["ask", "write-out"], blocked: ["write-out"], state: { person: "ok", "c-write": "warn" } },
    ],
  },
};
