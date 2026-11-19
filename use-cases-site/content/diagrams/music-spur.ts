import type { UseCaseMeta } from "../types";

// Music on a spur: a venue's own machine, enrolled as a spur, runs a cell whose pipelines harmonise a key into a chord on a
// synth, start a pattern from a pad, clock the synth and follow a drum machine's clock; a port given to read alone is never
// played, held notes are released when the cell stops, and the show goes on with the platform gone.
// Source: the music trial on main (docs/trials, 44 checks on virtual ports, 2026-11-19) and docs/guide/spurs.md.

const base = ["cp", "spursvc", "spur", "cell", "c-chord", "c-pattern", "c-clock", "agent", "policy", "keyboard", "drum", "synth", "cp-svc"];

export const musicSpur: UseCaseMeta = {
  slug: "music-spur",
  kind: "devices",
  status: "shown",
  thumb: 2,
  metrics: ["chord", "clock", "offline"],
  parts: ["spur", "cell", "registry"],
  related: ["pad-shortcuts", "on-site"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "cp", kind: "panel", x: 220, y: 16, w: 300, h: 66, label: "control plane", sub: "versions · checks", tone: "engine" },
      { id: "spursvc", kind: "panel", x: 560, y: 16, w: 220, h: 66, label: "spur service", sub: "one sync over HTTPS", tone: "engine" },
      { id: "far", kind: "panel", x: 220, y: 16, w: 560, h: 90, label: "one Node-RED, far away", sub: "each note timed by the flow", tone: "danger" },
      { id: "spur", kind: "panel", x: 200, y: 140, w: 600, h: 340, label: "spur · acme-stage", sub: "a venue's own machine", tone: "ghost", dashed: true },
      { id: "cell", kind: "panel", x: 330, y: 196, w: 300, h: 200, label: "acme-stage", sub: "a spur cell, governed", tone: "open" },
      { id: "c-chord", kind: "chip", x: 354, y: 256, w: 252, h: 30, label: "harmonise a key", hue: 0 },
      { id: "c-pattern", kind: "chip", x: 354, y: 300, w: 252, h: 30, label: "start a pattern", hue: 1 },
      { id: "c-clock", kind: "chip", x: 354, y: 344, w: 252, h: 30, label: "clock the synth", hue: 2 },
      { id: "agent", kind: "pill", x: 330, y: 420, w: 300, h: 26, label: "the spur times each note and pulse" },
      { id: "policy", kind: "pill", x: 646, y: 200, w: 146, h: 26, label: "local policy · ports" },
      { id: "keyboard", kind: "icon", icon: "pad", side: "right", x: 40, y: 150, w: 110, h: 96, label: "keyboard and pads", sub: "read only" },
      { id: "drum", kind: "icon", icon: "synth", side: "right", x: 40, y: 330, w: 110, h: 96, label: "drum machine", sub: "its clock, read only" },
      { id: "synth", kind: "icon", icon: "synth", side: "left", x: 830, y: 230, w: 110, h: 96, label: "synth", sub: "MIDI" },
    ],
    flows: [
      { id: "key-far", kind: "data", pts: [[152, 180], [180, 180], [180, 60], [218, 60]], msg: "C" },
      { id: "far-late", kind: "fail", pts: [[782, 60], [884, 60], [884, 228]], label: "late, or not at all", labelAt: 0.3, blockAt: 0.75 },
      { id: "cp-svc", kind: "control", pts: [[522, 48], [558, 48]] },
      { id: "sync", kind: "control", pts: [[670, 84], [670, 120], [560, 120], [560, 194]], label: "sync", labelAt: 0.2 },
      { id: "sync-down", kind: "fail", pts: [[670, 84], [670, 120], [560, 120], [560, 194]], label: "platform gone", labelAt: 0.2, blockAt: 0.4 },
      { id: "policy-l", kind: "control", pts: [[644, 213], [632, 213]] },
      { id: "key-in", kind: "data", pts: [[152, 190], [300, 190], [300, 271], [352, 271]], msg: "C" },
      { id: "chord-out", kind: "data", pts: [[608, 271], [828, 271]], msg: "C E G" },
      { id: "pad-in", kind: "data", pts: [[152, 214], [280, 214], [280, 315], [352, 315]], msg: "pad" },
      { id: "pattern-out", kind: "data", pts: [[608, 315], [760, 315], [760, 290], [828, 290]], msg: "a bar" },
      { id: "clock-out", kind: "data", pts: [[608, 359], [780, 359], [780, 305], [828, 305]], label: "Start · 24 a beat · Stop", labelAt: 0.3 },
      { id: "drum-in", kind: "data", pts: [[152, 378], [300, 378], [300, 359], [352, 359]], msg: "clock" },
      { id: "play-kbd", kind: "fail", pts: [[328, 238], [240, 238], [152, 238]], label: "play the keyboard", labelAt: 0.5, blockAt: 0.45 },
      { id: "release", kind: "data", pts: [[608, 280], [828, 280]], msg: "All Notes Off" },
    ],
    steps: [
      // 1 PROBLEM: the notes are timed far away
      { show: ["far", "keyboard", "synth", "key-far", "far-late"], active: ["key-far", "far-late"], blocked: ["far-late"], state: { far: "bad" } },
      // 2 a spur, and the ports its administrator gives
      { show: [...base, "sync", "policy-l"], active: ["cp-svc", "sync", "policy-l"], state: { spur: "hi", policy: "hi" } },
      // 3 a key in, a chord out
      { show: [...base, "sync", "key-in", "chord-out"], active: ["key-in", "chord-out"], state: { "c-chord": "ok", synth: "ok" } },
      // 4 a pad starts a pattern, timed by the spur
      { show: [...base, "sync", "pad-in", "pattern-out"], active: ["pad-in", "pattern-out"], state: { "c-pattern": "ok", agent: "hi" } },
      // 5 the clock, sent and followed
      { show: [...base, "sync", "clock-out", "drum-in"], active: ["clock-out", "drum-in"], state: { "c-clock": "ok", drum: "ok" } },
      // 6 a port given to read alone is never played
      { show: [...base, "sync", "play-kbd"], active: ["play-kbd"], blocked: ["play-kbd"], state: { keyboard: "warn" } },
      // 7 the platform gone, the show goes on
      { show: [...base, "sync-down", "key-in", "chord-out", "clock-out"], active: ["sync-down", "key-in", "chord-out", "clock-out"], blocked: ["sync-down"], state: { cell: "ok" } },
      // 8 stopped: every held note released
      { show: [...base, "sync", "release"], active: ["release"], state: { cell: "dim", synth: "ok" }, sub: { cell: "stopped by an operator" } },
    ],
  },
};
