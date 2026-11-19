import type { UseCaseMeta } from "../types";
import { api, caller, db, intoApi, row, tenant } from "./kit";

// A spreadsheet in, checked first: a CSV file sent as it is, its separator detected, its columns mapped, every row checked by a
// dry run, then written in 500-row batches. Sources (graphos main): docs/index.html (UI 06), docs/guide/usage.md §4 "CSV import",
// features.md (the import dialog).

const base = ["sheet", "api", "db", "t-acme", "r1", "r2"];

export const csvImport: UseCaseMeta = {
  slug: "csv-import",
  kind: "data",
  status: "target",
  thumb: 3,
  metrics: ["checked", "noid", "again"],
  parts: ["writes", "ui", "api"],
  related: ["bulk-load", "reconcile", "demo-ecosystem"],
  shot: "csv-import",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      caller("sheet", "sheet", "people.csv", 0, "a spreadsheet's export"),
      caller("person", "person", "someone in the web UI", 1),
      api("nodes:csv · edges:csv"),
      db(),
      tenant("t-acme", "acme · Person", 0),
      row("r1", "4 records", 0, 0, 0),
      row("r2", "rows merged by id", 0, 1, 1),
      { id: "check", kind: "panel", x: 506, y: 256, w: 200, h: 200, label: "the check", sub: "every row, nothing written", tone: "neutral" },
      { id: "c-sep", kind: "chip", x: 522, y: 318, w: 168, h: 26, label: "separator: semicolon", hue: 0 },
      { id: "c-empty", kind: "chip", x: 522, y: 352, w: 168, h: 26, label: "row 4: empty id · refused", hue: 3 },
      { id: "c-dup", kind: "chip", x: 522, y: 386, w: 168, h: 26, label: "duplicate id · merged", hue: 2 },
      { id: "c-bad", kind: "chip", x: 522, y: 420, w: 168, h: 26, label: "age \"n/a\" · left out", hue: 2 },
      { id: "nothing", kind: "panel", x: 250, y: 196, w: 480, h: 290, label: "a hand-written loader", sub: "each file its own script", tone: "danger" },
      { id: "batches", kind: "pill", x: 600, y: 140, w: 220, h: 26, label: "500-row batches · safe to resend" },
    ],
    flows: [
      { id: "script", kind: "fail", pts: [[164, 85], [376, 85], [376, 194]], label: "a script per file", labelAt: 0.35 },
      { id: "send", kind: "data", pts: intoApi(0), msg: "text/csv" },
      { id: "ui-send", kind: "control", pts: intoApi(1), label: "map · preview", labelAt: 0.2 },
      { id: "api-check", kind: "control", pts: [[540, 118], [540, 254]], msg: "dry run" },
      { id: "api-t", kind: "gateway", pts: [[376, 118], [376, 254]], msg: "write" },
    ],
    steps: [
      // 1 PROBLEM: a loader per file
      { show: ["sheet", "nothing", "script"], active: ["script"], state: { nothing: "bad" } },
      // 2 send the file as it is
      { show: [...base, "send"], active: ["send"], state: { api: "hi" } },
      // 3 the columns mapped, in the UI
      { show: [...base, "person", "ui-send"], active: ["ui-send"], state: { person: "ok" } },
      // 4 a dry run checks every row
      { show: [...base, "check", "c-sep", "c-empty", "c-dup", "c-bad", "send", "api-check"], active: ["send", "api-check"], state: { check: "hi", "c-empty": "bad" } },
      // 5 written in batches
      { show: [...base, "batches", "send", "api-t"], active: ["send", "api-t"], state: { r1: "ok", r2: "ok", batches: "hi" } },
    ],
  },
};
