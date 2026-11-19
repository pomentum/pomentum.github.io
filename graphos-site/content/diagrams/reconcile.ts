import type { UseCaseMeta } from "../types";
import { api, caller, db, intoApi, row, tenant } from "./kit";

// Reconcile by difference: send the whole set of edges as the source has them (one node's, or a whole type's); graphos adds,
// changes and removes only what differs, in one transaction; a dry run answers the counts. Sources (graphos main):
// docs/index.html (Features), docs/guide/usage.md §4 "Reconcile".

const base = ["source", "api", "db", "t-acme", "e1", "e2", "e3", "e4"];

export const reconcile: UseCaseMeta = {
  slug: "reconcile",
  kind: "data",
  status: "target",
  thumb: 3,
  metrics: ["gap", "written", "preview"],
  parts: ["writes", "reconcile", "changes"],
  related: ["bulk-load", "change-feed", "csv-import"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      caller("source", "tracker", "the source system", 0, "the edges as it has them"),
      api("edges:reconcile · node or type scope"),
      db(),
      tenant("t-acme", "acme · DEPENDS_ON of app", 0, "the stored edges"),
      row("e1", "→ lib-a  kept", 0, 0, 0),
      row("e2", "→ lib-b  changed", 0, 1, 1),
      row("e3", "→ lib-c  removed", 0, 2, 3),
      row("e4", "→ lib-d  added", 0, 3, 2),
      { id: "gapbox", kind: "panel", x: 250, y: 196, w: 480, h: 290, label: "delete the run, then reload", sub: "readers see edges missing meanwhile", tone: "danger" },
      { id: "counts", kind: "pill", x: 506, y: 270, w: 220, h: 26, label: "added 1 · changed 1 · removed 1" },
      { id: "dry", kind: "pill", x: 506, y: 236, w: 220, h: 26, label: "dry run · nothing written", tone: "open" },
      { id: "tx", kind: "pill", x: 506, y: 304, w: 220, h: 26, label: "one transaction", tone: "open" },
      { id: "feed", kind: "pill", x: 506, y: 410, w: 220, h: 26, label: "change feed · 1 upsert, 1 delete" },
    ],
    flows: [
      { id: "reload", kind: "fail", pts: [[164, 85], [376, 85], [376, 194]], label: "delete all, write all", labelAt: 0.35 },
      { id: "set", kind: "data", pts: intoApi(0), msg: "the set" },
      { id: "api-t", kind: "gateway", pts: [[376, 118], [376, 254]], msg: "the difference" },
      { id: "dry-l", kind: "control", pts: [[540, 118], [540, 234]] },
      { id: "feed-l", kind: "gateway", pts: [[478, 423], [504, 423]] },
    ],
    steps: [
      // 1 PROBLEM: delete, then reload
      { show: ["source", "gapbox", "reload"], active: ["reload"], state: { gapbox: "bad" } },
      // 2 send the set as the source has it
      { show: [...base, "set"], active: ["set"], state: { api: "hi" }, sub: { e1: "→ lib-a", e2: "→ lib-b", e3: "→ lib-c", e4: "→ lib-d ?" } },
      // 3 a dry run first
      { show: [...base, "dry", "counts", "set", "dry-l"], active: ["set", "dry-l"], state: { dry: "hi", counts: "hi" } },
      // 4 only the difference, in one transaction
      { show: [...base, "tx", "counts", "set", "api-t"], active: ["set", "api-t"], state: { e2: "warn", e3: "bad", e4: "ok", tx: "hi" } },
      // 5 a kept edge is not written
      { show: [...base, "tx", "api-t"], active: ["api-t"], state: { e1: "ok" } },
      // 6 on the change feed
      { show: [...base, "feed", "feed-l"], active: ["feed-l"], state: { feed: "hi" } },
    ],
  },
};
