import type { UseCaseMeta } from "../types";

// A pad that starts pipelines: a macro pad, foot switch or keypad given to a spur by its administrator, found by pressing a key
// on it, held whole by the spur so its keys reach no other program; key codes only, never letters, the top row's digits, space or punctuation (docs/guide/spur-keys.md); each press a
// webhook into the cell, where a shortcut is a pipeline; the pad's lights set from a pipeline. In development: tested on
// recorded streams, no pad yet. Source: docs/guide/spurs.md and docs/guide/spur-keys.md on main, and the decision on keys.

const base = ["spursvc", "spur", "cell", "k-map", "k-run", "k-light", "hold", "policy", "pad", "keyboard"];

export const padShortcuts: UseCaseMeta = {
  slug: "pad-shortcuts",
  kind: "devices",
  status: "dev",
  thumb: 2,
  metrics: ["reads", "text", "real"],
  parts: ["spur", "cell"],
  related: ["music-spur", "on-site"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "spursvc", kind: "panel", x: 400, y: 16, w: 300, h: 66, label: "spur service", sub: "one sync over HTTPS", tone: "engine" },
      { id: "hook", kind: "panel", x: 330, y: 170, w: 360, h: 200, label: "a keyboard hook", sub: "sees every key of every keyboard", tone: "danger" },
      { id: "admin", kind: "icon", icon: "person", x: 40, y: 10, w: 110, h: 90, label: "the administrator", sub: "presses a key on it" },
      { id: "spur", kind: "panel", x: 200, y: 120, w: 720, h: 360, label: "spur · acme-desk", sub: "a tenant's own machine", tone: "ghost", dashed: true },
      { id: "cell", kind: "panel", x: 400, y: 176, w: 300, h: 210, label: "acme-desk", sub: "a spur cell, governed", tone: "open" },
      { id: "k-map", kind: "chip", x: 424, y: 236, w: 252, h: 30, label: "map keys to actions", hue: 0 },
      { id: "k-run", kind: "chip", x: 424, y: 282, w: 252, h: 30, label: "run the shortcut", hue: 1 },
      { id: "k-light", kind: "chip", x: 424, y: 328, w: 252, h: 30, label: "light the pad", hue: 2 },
      { id: "hold", kind: "pill", x: 230, y: 420, w: 240, h: 26, label: "the spur holds the pad whole" },
      { id: "policy", kind: "pill", x: 730, y: 200, w: 170, h: 26, label: "local policy · keys" },
      { id: "other", kind: "pill", x: 730, y: 420, w: 170, h: 26, label: "other programs" },
      { id: "pad", kind: "icon", icon: "pad", side: "right", x: 40, y: 170, w: 110, h: 96, label: "a macro pad", sub: "or a foot switch" },
      { id: "keyboard", kind: "icon", icon: "keyboard", side: "right", x: 40, y: 330, w: 110, h: 96, label: "the keyboard", sub: "never given" },
    ],
    flows: [
      { id: "typed-hook", kind: "fail", pts: [[152, 378], [260, 378], [260, 300], [328, 300]], msg: "password" },
      { id: "pad-hook", kind: "data", pts: [[152, 218], [328, 218]], msg: "F13" },
      { id: "identify", kind: "control", pts: [[96, 102], [96, 166]], label: "identify", labelAt: 0.5 },
      { id: "policy-l", kind: "control", pts: [[728, 213], [702, 213]] },
      { id: "sync", kind: "control", pts: [[550, 84], [550, 174]], label: "sync", labelAt: 0.4 },
      { id: "press", kind: "data", pts: [[152, 218], [340, 218], [340, 251], [422, 251]], msg: "F13 pressed" },
      { id: "not-other", kind: "fail", pts: [[340, 218], [340, 160], [814, 160], [814, 418]], label: "reaches no other program", labelAt: 0.55, blockAt: 0.7 },
      { id: "typed", kind: "fail", pts: [[152, 378], [380, 378], [380, 297], [422, 297]], label: "letters, top-row digits, text", labelAt: 0.3, blockAt: 0.4 },
      { id: "lights", kind: "data", pts: [[422, 343], [300, 343], [300, 240], [152, 240]], msg: "lights" },
    ],
    steps: [
      // 1 PROBLEM: a hook reads every key
      { show: ["hook", "pad", "keyboard", "typed-hook", "pad-hook"], active: ["typed-hook", "pad-hook"], state: { hook: "bad" } },
      // 2 the administrator gives the pad
      { show: [...base, "admin", "identify", "policy-l", "sync"], active: ["identify", "policy-l", "sync"], state: { policy: "hi", pad: "hi" } },
      // 3 held whole: a press reaches the cell alone
      { show: [...base, "other", "sync", "press", "not-other"], active: ["press", "not-other"], blocked: ["not-other"], state: { hold: "hi", "k-map": "ok" } },
      // 4 key codes, never characters
      { show: [...base, "sync", "typed"], active: ["typed"], blocked: ["typed"], state: { keyboard: "warn" } },
      // 5 a shortcut is a pipeline
      { show: [...base, "sync", "press"], active: ["press"], trace: ["k-map", "k-run"], state: { "k-run": "ok" } },
      // 6 the pad's lights from a pipeline
      { show: [...base, "sync", "lights"], active: ["lights"], state: { "k-light": "ok", pad: "ok" } },
    ],
  },
};
