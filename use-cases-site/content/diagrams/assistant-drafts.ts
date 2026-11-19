import type { UseCaseMeta } from "../types";

// The assistant drafts a pipeline: a person describes it, the assistant proposes one through a model the platform defines,
// checked by a deploy's dry run and repaired at most twice, saved as the cell's draft when the person confirms.
// Sources: features.md (The assistant) and the README's "Work with agents and models", on main.

const base = ["you", "assistant", "model", "gateway", "cp", "tenant", "dev", "bus"];
const chips = ["a-1", "a-2", "a-3"];

export const assistantDrafts: UseCaseMeta = {
  slug: "assistant-drafts",
  kind: "ai",
  status: "target",
  thumb: 4,
  metrics: ["unasked", "checked", "key"],
  parts: ["assistant", "gateway", "cell", "registry"],
  related: ["outside-agent", "orders-review", "changing-production"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "you", kind: "icon", icon: "person", x: 22, y: 24, w: 104, h: 90, label: "you" },
      { id: "assistant", kind: "icon", icon: "assistant", x: 22, y: 230, w: 104, h: 96, label: "the assistant", sub: "a panel on every view" },
      { id: "model", kind: "icon", icon: "model", x: 846, y: 200, w: 104, h: 96, label: "a model provider", sub: "OpenAI-compatible" },
      { id: "gateway", kind: "bar", x: 790, y: 110, w: 34, h: 330, label: "credential gateway", tone: "protected" },
      { id: "levels", kind: "pill", x: 30, y: 452, w: 300, h: 26, label: "per area: off · read · propose · build" },
      { id: "cp", kind: "panel", x: 220, y: 20, w: 520, h: 90, label: "control plane", sub: "the assistant's tools · a deploy's dry run", tone: "engine" },
      { id: "tenant", kind: "panel", x: 220, y: 150, w: 540, h: 290, label: "tenant · acme", tone: "neutral" },
      { id: "dev", kind: "panel", x: 240, y: 190, w: 500, h: 232, label: "acme-dev", sub: "open cell", tone: "open" },
      { id: "a-1", kind: "chip", x: 270, y: 260, w: 200, h: 30, label: "webhook in", hue: 0 },
      { id: "a-2", kind: "chip", x: 270, y: 310, w: 200, h: 30, label: "shape the request", hue: 1 },
      { id: "a-3", kind: "chip", x: 270, y: 360, w: 200, h: 30, label: "post to the room", hue: 3 },
      { id: "draft", kind: "pill", x: 510, y: 260, w: 200, h: 26, label: "proposal" },
      { id: "bus", kind: "hbar", x: 220, y: 462, w: 540, h: 28, label: "bus · NATS JetStream" },
    ],
    flows: [
      { id: "describe", kind: "control", pts: [[74, 116], [74, 228]], msg: "describe it" },
      { id: "ask-cp", kind: "control", pts: [[128, 262], [180, 262], [180, 66], [218, 66]] },
      { id: "cp-gw", kind: "gateway", pts: [[742, 66], [807, 66], [807, 108]] },
      { id: "gw-model", kind: "gateway", pts: [[826, 248], [844, 248]] },
      { id: "propose", kind: "control", pts: [[360, 112], [360, 258]], label: "proposed", labelAt: 0.4 },
      { id: "dry", kind: "control", pts: [[600, 112], [600, 258]], label: "dry run · repaired ≤ 2", labelAt: 0.45 },
      { id: "confirm", kind: "control", pts: [[128, 50], [218, 50]], label: "confirm", labelAt: 0.5 },
      { id: "save", kind: "control", pts: [[520, 112], [520, 258]], label: "saved as the draft", labelAt: 0.45 },
      { id: "no-deploy", kind: "fail", pts: [[680, 112], [680, 188]], label: "deploy by itself", labelAt: 0.3, blockAt: 0.75 },
    ],
    steps: [
      // 1 PROBLEM: a blank canvas
      { show: ["you", "cp", "tenant", "dev", "bus"], state: { dev: "dim" }, sub: { dev: "open cell · empty" } },
      // 2 describe it
      { show: [...base, "describe", "ask-cp"], active: ["describe", "ask-cp"], state: { assistant: "hi" } },
      // 3 a model, through the gateway
      { show: [...base, "ask-cp", "cp-gw", "gw-model"], active: ["ask-cp", "cp-gw", "gw-model"], state: { gateway: "hi", model: "ok" } },
      // 4 proposed and checked
      { show: [...base, ...chips, "draft", "propose", "dry"], active: ["propose", "dry"], state: { "a-1": "dim", "a-2": "dim", "a-3": "dim", draft: "hi" }, sub: { draft: "proposal · checked" } },
      // 5 nothing changes until you confirm
      { show: [...base, ...chips, "draft", "confirm", "save", "no-deploy"], active: ["confirm", "save", "no-deploy"], blocked: ["no-deploy"], state: { "a-1": "ok", "a-2": "ok", "a-3": "ok", you: "ok" }, sub: { draft: "draft · you deploy it", dev: "open cell · a draft" } },
      // 6 within what it may do
      { show: [...base, ...chips, "draft", "levels"], state: { levels: "hi" }, sub: { draft: "draft · you deploy it", dev: "open cell · a draft" } },
    ],
  },
};
