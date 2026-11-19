import type { UseCaseMeta } from "../types";

// Labels and scans at a packing desk: a spur prints a shipping label raw to a label printer's port, a packing slip through the
// machine's print queue, scans a delivery note from a scanner over eSCL and stores the scan with another connector; a target given
// read alone refuses jobs, and a pipeline reads only the jobs it printed. In development: built 2026-11-19, the print client tried
// against a real CUPS in a container, the scanner against a stand-in; no real printer or scanner. Source: the decision on USB
// devices on a spur (parts D and E, action items steps 4 and 5) on main.

const base = ["spursvc", "spur", "cell", "c-label", "c-slip", "c-scan", "c-store", "policy", "labelp", "office", "scanner"];

export const printScan: UseCaseMeta = {
  slug: "print-scan",
  kind: "devices",
  status: "dev",
  thumb: 4,
  metrics: ["reach", "jobs", "real"],
  parts: ["spur", "cell", "gateway"],
  related: ["pad-shortcuts", "music-spur", "on-site"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "spursvc", kind: "panel", x: 400, y: 16, w: 280, h: 66, label: "spur service", sub: "one sync over HTTPS", tone: "engine" },
      { id: "far", kind: "panel", x: 300, y: 16, w: 380, h: 90, label: "a pipeline far away", sub: "on the platform's network", tone: "danger" },
      { id: "bucket", kind: "icon", icon: "bucket", x: 846, y: 6, w: 100, h: 90, label: "files", sub: "object storage" },
      { id: "spur", kind: "panel", x: 180, y: 130, w: 600, h: 350, label: "spur · acme-desk", sub: "a packing desk's machine", tone: "ghost", dashed: true },
      { id: "cell", kind: "panel", x: 330, y: 186, w: 300, h: 230, label: "acme-desk", sub: "a spur cell, governed", tone: "open" },
      { id: "c-label", kind: "chip", x: 354, y: 246, w: 252, h: 30, label: "print the shipping label", hue: 0 },
      { id: "c-slip", kind: "chip", x: 354, y: 290, w: 252, h: 30, label: "print the packing slip", hue: 1 },
      { id: "c-scan", kind: "chip", x: 354, y: 334, w: 252, h: 30, label: "scan the delivery note", hue: 2 },
      { id: "c-store", kind: "chip", x: 354, y: 378, w: 252, h: 30, label: "store the scan", hue: 3 },
      { id: "policy", kind: "pill", x: 640, y: 436, w: 130, h: 26, label: "local policy" },
      { id: "labelp", kind: "icon", icon: "printer", side: "right", x: 30, y: 150, w: 110, h: 96, label: "label printer", sub: "its raw port" },
      { id: "office", kind: "icon", icon: "printer", side: "right", x: 30, y: 320, w: 110, h: 96, label: "office printer", sub: "a print queue" },
      { id: "scanner", kind: "icon", icon: "scanner", side: "left", x: 840, y: 250, w: 100, h: 96, label: "scanner", sub: "eSCL" },
    ],
    flows: [
      { id: "far-fail", kind: "fail", pts: [[298, 80], [100, 80], [100, 148]], label: "no way in", labelAt: 0.35, blockAt: 0.6 },
      { id: "far-scan", kind: "fail", pts: [[682, 80], [890, 80], [890, 248]], label: "no way in", labelAt: 0.5, blockAt: 0.75 },
      { id: "sync", kind: "control", pts: [[540, 84], [540, 184]], label: "sync", labelAt: 0.4 },
      { id: "label-out", kind: "data", pts: [[352, 261], [250, 261], [250, 200], [142, 200]], msg: "ZPL" },
      { id: "doc-out", kind: "data", pts: [[352, 305], [260, 305], [260, 368], [142, 368]], msg: "PDF" },
      { id: "scan-in", kind: "data", pts: [[838, 300], [720, 300], [720, 349], [608, 349]], msg: "3 pages" },
      { id: "store", kind: "gateway", pts: [[608, 393], [700, 393], [700, 112], [896, 112], [896, 98]], msg: "scan" },
      { id: "refused", kind: "fail", pts: [[352, 305], [260, 305], [260, 368], [142, 368]], label: "read only: refused", labelAt: 0.25, blockAt: 0.6 },
    ],
    steps: [
      // 1 PROBLEM: the desk's devices are out of reach
      { show: ["far", "labelp", "office", "scanner", "far-fail", "far-scan"], active: ["far-fail", "far-scan"], blocked: ["far-fail", "far-scan"], state: { far: "bad" } },
      // 2 the administrator gives them
      { show: [...base, "sync"], active: ["sync"], state: { policy: "hi", spur: "hi" } },
      // 3 a label, in the printer's own language
      { show: [...base, "sync", "label-out"], active: ["label-out"], state: { "c-label": "ok", labelp: "ok" } },
      // 4 a document through the queue
      { show: [...base, "sync", "doc-out"], active: ["doc-out"], state: { "c-slip": "ok", office: "ok" } },
      // 5 a scan from the feeder, stored
      { show: [...base, "bucket", "sync", "scan-in", "store"], active: ["scan-in", "store"], state: { "c-scan": "ok", "c-store": "ok", bucket: "ok" } },
      // 6 given to read alone: no jobs
      { show: [...base, "sync", "refused"], active: ["refused"], blocked: ["refused"], state: { office: "warn" } },
    ],
  },
};
