import type { UseCaseMeta } from "../types";
import { api, caller, db, intoApi, outside, row, tenant } from "./kit";

// The change feed: every write recorded in the same transaction; read after a cursor or followed live (Server-Sent Events);
// never skips a committed change; kept seven days. Sources (graphos main): docs/index.html (Features, Benchmarks),
// docs/guide/usage.md "Change feed", concept.md (its design and measurements).

const base = ["writer", "api", "db", "t-acme", "r1", "r2", "feed", "index"];

export const changeFeed: UseCaseMeta = {
  slug: "change-feed",
  kind: "data",
  status: "shown",
  thumb: 4,
  metrics: ["skip", "cost", "kept"],
  parts: ["changes", "writes", "client"],
  related: ["bulk-load", "reconcile", "many-services"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      caller("writer", "box", "a writing service", 0),
      api("/changes · /changes/stream"),
      db(),
      tenant("t-acme", "acme", 0),
      row("r1", "Package · rev 7", 0, 0, 0),
      row("r2", "DEPENDS_ON · rev 3", 0, 1, 1),
      { id: "feed", kind: "panel", x: 506, y: 256, w: 200, h: 200, label: "change feed", sub: "in the same transaction", tone: "neutral" },
      { id: "f1", kind: "chip", x: 522, y: 318, w: 168, h: 26, label: "cursor 41 · upsert · Package", hue: 0 },
      { id: "f2", kind: "chip", x: 522, y: 352, w: 168, h: 26, label: "cursor 42 · upsert · DEPENDS_ON", hue: 1 },
      outside("index", "database", "a search index", 0, "follows the changes"),
      { id: "head", kind: "pill", x: 600, y: 140, w: 180, h: 26, label: "head · cursor 42" },
      { id: "poll", kind: "panel", x: 600, y: 196, w: 180, h: 90, label: "read it all again", sub: "or a counter that skips", tone: "danger" },
      { id: "cost", kind: "pill", x: 600, y: 140, w: 220, h: 26, label: "+1.8 ms · kept 7 days" },
    ],
    flows: [
      { id: "poll-l", kind: "fail", pts: [[798, 85], [700, 85], [700, 194]], label: "everything again", labelAt: 0.4 },
      { id: "w", kind: "data", pts: intoApi(0), msg: "a write" },
      { id: "api-t", kind: "gateway", pts: [[376, 118], [376, 254]] },
      { id: "api-f", kind: "gateway", pts: [[540, 118], [540, 254]], msg: "recorded" },
      { id: "after", kind: "control", pts: [[798, 95], [582, 95]], label: "GET /changes?after=41", labelAt: 0.4 },
      { id: "live", kind: "data", pts: [[582, 75], [798, 75]], msg: "event", label: "stream · SSE", labelAt: 0.6 },
    ],
    steps: [
      // 1 PROBLEM: read it all again
      { show: ["writer", "index", "poll", "poll-l"], active: ["poll-l"], state: { poll: "bad" } },
      // 2 every write recorded, in the same transaction
      { show: [...base, "f1", "f2", "w", "api-t", "api-f"], active: ["w", "api-t", "api-f"], state: { feed: "hi" } },
      // 3 start from the head
      { show: [...base, "f1", "f2", "head"], state: { head: "hi" } },
      // 4 read after a cursor
      { show: [...base, "f1", "f2", "after"], active: ["after"], state: { f2: "ok", index: "ok" } },
      // 5 or follow it live
      { show: [...base, "f1", "f2", "w", "api-t", "api-f", "live"], active: ["w", "api-t", "api-f", "live"], state: { index: "ok" } },
      // 6 what it costs
      { show: [...base, "f1", "f2", "cost"], state: { cost: "hi" } },
    ],
  },
};
