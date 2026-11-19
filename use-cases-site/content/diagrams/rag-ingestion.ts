import type { UseCaseMeta } from "../types";

// Documents into search, scanned first: stages joined by the bus fetch a source in batches, scan it, chunk it and load a vector
// store through the tenant's services; a pipeline without the scan is refused at deploy with the path named; a cell killed mid-scan
// resumes from its last batch; every record traces back to its run and the pipeline version that wrote it.
// Source: the RAG ingestion trial on main (17 checks, 2026-10-24) and docs/guide/features.md (Required steps on paths).

const base = ["source", "cp", "cell", "c-fetch", "c-scan", "c-chunk", "c-load", "bus", "gateway", "store"];

export const ragIngestion: UseCaseMeta = {
  slug: "rag-ingestion",
  kind: "ai",
  status: "shown",
  thumb: 5,
  metrics: ["unscanned", "resume", "trace"],
  parts: ["bus", "cell", "gateway", "tracing"],
  related: ["mcp-tool", "polled-database", "assistant-drafts"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "source", kind: "icon", icon: "globe", x: 22, y: 200, w: 100, h: 96, label: "a source", sub: "23 pages" },
      { id: "cp", kind: "panel", x: 250, y: 16, w: 420, h: 66, label: "control plane", sub: "path rules · runs · versions", tone: "engine" },
      { id: "flow", kind: "panel", x: 180, y: 130, w: 520, h: 270, label: "one flow", sub: "fetch, then load", tone: "danger" },
      { id: "f-fetch", kind: "chip", x: 210, y: 200, w: 220, h: 30, label: "fetch the pages", hue: 0 },
      { id: "f-load", kind: "chip", x: 210, y: 260, w: 220, h: 30, label: "load the store", hue: 3 },
      { id: "cell", kind: "panel", x: 180, y: 120, w: 520, h: 300, label: "acme-docs", sub: "open cell · stages joined by the bus", tone: "open" },
      { id: "c-fetch", kind: "chip", x: 210, y: 186, w: 210, h: 30, label: "fetch · 5 pages a batch", hue: 0 },
      { id: "c-scan", kind: "chip", x: 210, y: 236, w: 210, h: 30, label: "scan each page", hue: 2 },
      { id: "c-chunk", kind: "chip", x: 460, y: 186, w: 210, h: 30, label: "chunk", hue: 1 },
      { id: "c-load", kind: "chip", x: 460, y: 236, w: 210, h: 30, label: "load the store", hue: 3 },
      { id: "cursor", kind: "pill", x: 210, y: 300, w: 210, h: 26, label: "progress kept: the last batch" },
      { id: "flagged", kind: "pill", x: 460, y: 300, w: 210, h: 26, label: "3 pages flagged, kept out", tone: "danger" },
      { id: "c-bad", kind: "chip", x: 210, y: 360, w: 460, h: 30, label: "a copy without the scan: fetch → load", hue: 3 },
      { id: "bus", kind: "hbar", x: 180, y: 452, w: 520, h: 28, label: "bus · NATS JetStream" },
      { id: "gateway", kind: "bar", x: 740, y: 110, w: 34, h: 330, label: "credential gateway", tone: "protected" },
      { id: "store", kind: "icon", icon: "database", side: "left", x: 836, y: 210, w: 110, h: 96, label: "vector store", sub: "a tenant's service" },
    ],
    flows: [
      { id: "leak", kind: "fail", pts: [[702, 275], [834, 275]], label: "unscanned pages", labelAt: 0.5 },
      { id: "src-in", kind: "data", pts: [[124, 201], [208, 201]], msg: "5 pages" },
      { id: "stage", kind: "data", pts: [[315, 268], [315, 450]], label: "hand-offs", labelAt: 0.6 },
      { id: "stage-up", kind: "data", pts: [[565, 450], [565, 268]] },
      { id: "load-gw", kind: "gateway", pts: [[672, 251], [738, 251]], msg: "39 chunks" },
      { id: "gw-store", kind: "gateway", pts: [[776, 251], [834, 251]] },
      { id: "deploy-bad", kind: "fail", pts: [[440, 84], [440, 150], [690, 150], [690, 358]], label: "refused: the path skips the scan", labelAt: 0.35, blockAt: 0.3 },
      { id: "trace", kind: "control", pts: [[600, 184], [600, 84]], label: "run · version digest", labelAt: 0.5 },
    ],
    steps: [
      // 1 PROBLEM: pages go into the store unscanned
      { show: ["source", "flow", "f-fetch", "f-load", "store", "leak"], active: ["leak"], state: { "f-load": "bad", flow: "bad" } },
      // 2 stages joined by the bus
      { show: [...base, "stage", "stage-up"], active: ["stage", "stage-up"], state: { cell: "hi" } },
      // 3 a copy without the scan is refused at deploy
      { show: [...base, "c-bad", "deploy-bad"], active: ["deploy-bad"], blocked: ["deploy-bad"], state: { "c-bad": "bad", cp: "hi" } },
      // 4 in batches, progress kept
      { show: [...base, "cursor", "src-in", "stage"], active: ["src-in", "stage"], state: { "c-fetch": "ok", cursor: "hi" } },
      // 5 killed mid-scan, resumed
      { show: [...base, "cursor", "src-in"], active: ["src-in"], state: { cell: "warn", cursor: "hi" }, sub: { cell: "killed mid-scan · started again" } },
      // 6 flagged pages kept out, the clean ones loaded
      { show: [...base, "cursor", "flagged", "stage-up", "load-gw", "gw-store"], active: ["stage-up", "load-gw", "gw-store"], state: { "c-scan": "ok", flagged: "warn", store: "ok" } },
      // 7 every record traces back
      { show: [...base, "trace"], active: ["trace"], trace: ["c-fetch", "c-scan", "c-chunk", "c-load"], state: { cp: "hi" } },
    ],
  },
};
