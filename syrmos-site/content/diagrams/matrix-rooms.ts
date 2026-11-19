import type { UseCaseMeta } from "../types";

// A chat room that starts pipelines: the homeserver's administrator installs the registration Syrmos gives; a person's message in a
// room starts a pipeline through the intake; the pipeline answers through the credential gateway, once even when done again; a
// review's notice reaches the room once, posted by the bridge; an encrypted room is refused. Source: the Matrix rooms trial on main
// (parts A to C, 2026-10-29, and again 2026-11-01).

const base = ["room", "admin", "bridge", "cp", "cell", "c-in", "c-answer", "c-review", "bus", "gateway", "room-out"];

export const matrixRooms: UseCaseMeta = {
  slug: "matrix-rooms",
  kind: "integrations",
  status: "shown",
  thumb: 3,
  metrics: ["token", "twice", "encrypted"],
  parts: ["bridge", "gateway", "review", "bus"],
  related: ["signed-webhooks", "batch-review", "cold-room"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "room", kind: "icon", icon: "chat", x: 22, y: 200, w: 100, h: 96, label: "#ops", sub: "a person writes" },
      { id: "admin", kind: "icon", icon: "person", x: 22, y: 20, w: 100, h: 86, label: "the server's admin" },
      { id: "bridge", kind: "bar", x: 150, y: 110, w: 34, h: 330, label: "connector bridge", tone: "open" },
      { id: "cp", kind: "panel", x: 250, y: 16, w: 400, h: 66, label: "control plane", sub: "reviews · notices", tone: "engine" },
      { id: "bot", kind: "panel", x: 220, y: 130, w: 480, h: 260, label: "a chat bot", sub: "its token in the flow", tone: "danger" },
      { id: "b-tok", kind: "chip", x: 250, y: 220, w: 300, h: 30, label: "token: in a node", hue: 3 },
      { id: "cell", kind: "panel", x: 220, y: 120, w: 480, h: 290, label: "acme-ops", sub: "open cell", tone: "open" },
      { id: "c-in", kind: "chip", x: 250, y: 190, w: 420, h: 30, label: "a message in", hue: 0 },
      { id: "c-answer", kind: "chip", x: 250, y: 250, w: 420, h: 30, label: "answer in the room", hue: 1 },
      { id: "c-review", kind: "chip", x: 250, y: 310, w: 420, h: 30, label: "ask for a review", hue: 2 },
      { id: "bus", kind: "hbar", x: 220, y: 450, w: 480, h: 28, label: "bus · NATS JetStream" },
      { id: "gateway", kind: "bar", x: 740, y: 110, w: 34, h: 330, label: "credential gateway", tone: "protected" },
      { id: "room-out", kind: "icon", icon: "chat", side: "left", x: 836, y: 200, w: 100, h: 96, label: "#ops", sub: "the answer" },
      { id: "secret", kind: "pill", x: 784, y: 400, w: 160, h: 26, label: "token · OpenBao", tone: "protected" },
      { id: "enc", kind: "pill", x: 784, y: 330, w: 160, h: 26, label: "an encrypted room", tone: "danger" },
    ],
    flows: [
      { id: "leak", kind: "fail", pts: [[552, 235], [834, 235]], label: "the token in the flow", labelAt: 0.5 },
      { id: "register", kind: "control", pts: [[72, 108], [72, 150], [148, 150]], label: "registration", labelAt: 0.3 },
      { id: "msg", kind: "data", pts: [[124, 220], [148, 220]], msg: "deploy status?" },
      { id: "br-bus", kind: "data", pts: [[167, 442], [167, 464], [218, 464]] },
      { id: "bus-cell", kind: "data", pts: [[300, 448], [300, 222]] },
      { id: "answer", kind: "gateway", pts: [[672, 265], [738, 265]], msg: "answer" },
      { id: "gw-room", kind: "gateway", pts: [[776, 265], [834, 265]] },
      { id: "bao", kind: "gateway", pts: [[782, 413], [776, 413]] },
      { id: "ask", kind: "control", pts: [[600, 308], [600, 84]], label: "review asked", labelAt: 0.5 },
      { id: "notice", kind: "control", pts: [[652, 50], [886, 50], [886, 198]], label: "a notice, with a link", labelAt: 0.4 },
      { id: "enc-x", kind: "fail", pts: [[776, 343], [782, 343]] },
      { id: "enc-block", kind: "fail", pts: [[672, 325], [720, 325], [720, 343], [782, 343]], label: "refused", labelAt: 0.3, blockAt: 0.6 },
    ],
    steps: [
      // 1 PROBLEM: a bot with its token in the flow
      { show: ["room", "bot", "b-tok", "room-out", "leak"], active: ["leak"], state: { bot: "bad", "b-tok": "bad" } },
      // 2 the room's server lets Syrmos in
      { show: [...base, "register"], active: ["register"], state: { bridge: "hi", admin: "ok" } },
      // 3 a message starts a pipeline
      { show: [...base, "msg", "br-bus", "bus-cell"], active: ["msg", "br-bus", "bus-cell"], state: { "c-in": "ok" } },
      // 4 the answer, through the gateway, once
      { show: [...base, "secret", "answer", "gw-room", "bao"], active: ["answer", "gw-room", "bao"], state: { "c-answer": "ok", gateway: "hi", "room-out": "ok" } },
      // 5 a review, noticed in the room
      { show: [...base, "ask", "notice"], active: ["ask", "notice"], state: { "c-review": "warn", cp: "hi" } },
      // 6 an encrypted room is refused
      { show: [...base, "enc", "enc-block"], active: ["enc-block"], blocked: ["enc-block"], state: { enc: "warn" } },
    ],
  },
};
