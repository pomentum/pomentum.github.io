import type { UseCaseMeta } from "../types";
import { caller, db, outside, row, tenant } from "./kit";

// Leaving: every tenant is an ordinary AGE graph in ordinary PostgreSQL tables, readable with AGE's Cypher or plain SQL with no
// graphos running; an export loads into plain AGE. Sources (graphos main): docs/index.html (FAQ "Can I leave?"),
// docs/guide/without-graphos.md, installation.md (a read-only role).

const base = ["db", "t-acme", "l1", "l2", "l3"];

export const leaveAnytime: UseCaseMeta = {
  slug: "leave-anytime",
  kind: "platform",
  status: "shown",
  thumb: 4,
  metrics: ["format", "without", "export"],
  parts: ["plain-age", "tenant", "writes"],
  related: ["bulk-load", "tenants-sso", "many-services"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      caller("reader", "person", "a reader", 0, "SQL or Cypher"),
      caller("ops", "reviewer", "you, leaving", 1),
      { id: "gone", kind: "panel", x: 250, y: 40, w: 330, h: 76, label: "graphos-api", sub: "not running", tone: "ghost", dashed: true },
      db("ordinary tables"),
      tenant("t-acme", "acme · an AGE graph", 0, "a schema named acme"),
      row("l1", "table: Package", 0, 0, 0),
      row("l2", "table: DEPENDS_ON", 0, 1, 1),
      row("l3", "graphos_* columns: ignore", 0, 2, 2),
      outside("plain", "database", "a plain AGE graph", 1, "ndjson_to_age.py"),
      outside("dump", "bucket", "pg_dump · a snapshot", 2),
      { id: "lock", kind: "panel", x: 250, y: 196, w: 480, h: 290, label: "a format of its own", sub: "readable only through the service", tone: "danger" },
      { id: "role", kind: "pill", x: 506, y: 270, w: 220, h: 26, label: "read-only role · writes refused", tone: "open" },
      { id: "check", kind: "pill", x: 506, y: 400, w: 220, h: 26, label: "checksums matched" },
    ],
    flows: [
      { id: "stuck", kind: "fail", pts: [[164, 85], [376, 85], [376, 194]], label: "only through the service", labelAt: 0.35 },
      { id: "sql", kind: "data", pts: [[164, 85], [230, 85], [230, 330], [274, 330]], msg: "SELECT", label: "no graphos running", labelAt: 0.2 },
      { id: "out", kind: "data", pts: [[478, 365], [740, 365], [740, 235], [798, 235]], msg: "export" },
      { id: "dump-l", kind: "data", pts: [[478, 420], [760, 420], [760, 385], [798, 385]], msg: "pg_dump" },
      { id: "ops-l", kind: "control", pts: [[164, 235], [210, 235], [210, 380], [274, 380]] },
    ],
    steps: [
      // 1 PROBLEM: a format of its own
      { show: ["reader", "lock", "stuck"], active: ["stuck"], state: { lock: "bad" } },
      // 2 ordinary AGE tables
      { show: [...base, "gone"], state: { "t-acme": "hi", l3: "dim" } },
      // 3 read with no graphos running
      { show: [...base, "gone", "reader", "sql", "role"], active: ["sql"], state: { reader: "ok", role: "hi" } },
      // 4 take it out
      { show: [...base, "gone", "ops", "ops-l", "dump", "dump-l"], active: ["ops-l", "dump-l"], state: { dump: "ok" } },
      // 5 into plain AGE, checked
      { show: [...base, "gone", "plain", "out", "check"], active: ["out"], state: { plain: "ok", check: "hi" } },
    ],
  },
};
