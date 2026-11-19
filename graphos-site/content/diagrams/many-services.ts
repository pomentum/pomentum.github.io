import type { UseCaseMeta } from "../types";
import { api, caller, db, intoApi, row, tenant } from "./kit";

// One graph service for many services: each service gets a service account and a grant per tenant, signs in for a 15-minute
// token, and calls typed HTTP; only graphos-api connects to the database, which has no published port. Sources (graphos main):
// docs/index.html (In 30 seconds, Fig 01 and 02), docs/guide/usage.md §2, features.md (access, network), installation.md.

const base = ["svc-a", "svc-b", "api", "db", "t-acme", "t-sales", "r-a1", "r-a2", "r-s1", "r-s2"];

export const manyServices: UseCaseMeta = {
  slug: "many-services",
  kind: "platform",
  status: "target",
  thumb: 4,
  metrics: ["dsn", "reach", "revoke"],
  parts: ["api", "tenant", "access", "audit"],
  related: ["tenants-sso", "mcp-agents", "bulk-load"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      caller("svc-a", "box", "orders service", 0, "service account"),
      caller("svc-b", "box", "catalogue service", 1, "service account"),
      caller("admin", "person", "an admin", 2),
      api(),
      db(),
      tenant("t-acme", "acme", 0),
      tenant("t-sales", "sales", 1),
      row("r-a1", "Order", 0, 0, 0),
      row("r-a2", "PLACED_BY", 0, 1, 1),
      row("r-s1", "Product", 1, 0, 0),
      row("r-s2", "IN_CATEGORY", 1, 1, 1),
      { id: "dsn-a", kind: "pill", x: 22, y: 140, w: 140, h: 24, label: "a DSN, own Cypher", tone: "danger" },
      { id: "dsn-b", kind: "pill", x: 22, y: 290, w: 140, h: 24, label: "a DSN, own Cypher", tone: "danger" },
      { id: "grants", kind: "pill", x: 600, y: 52, w: 200, h: 26, label: "orders: write on acme", tone: "open" },
      { id: "grants2", kind: "pill", x: 600, y: 84, w: 200, h: 26, label: "catalogue: read on sales", tone: "open" },
      { id: "token", kind: "pill", x: 600, y: 132, w: 200, h: 26, label: "token · 15 minutes" },
      { id: "net", kind: "pill", x: 744, y: 470, w: 200, h: 26, label: "internal network · no port", tone: "protected" },
    ],
    flows: [
      { id: "direct-a", kind: "fail", pts: [[164, 85], [230, 85], [230, 330], [274, 330]], label: "SQL from each service", labelAt: 0.15 },
      { id: "direct-b", kind: "fail", pts: [[164, 235], [240, 235], [240, 400], [274, 400]] },
      { id: "admin-api", kind: "control", pts: [[164, 385], [224, 385], [224, 104], [248, 104]], label: "POST /v1/users · /v1/grants", labelAt: 0.1 },
      { id: "a-api", kind: "control", pts: intoApi(0), msg: "token" },
      { id: "b-api", kind: "control", pts: intoApi(1) },
      { id: "api-acme", kind: "gateway", pts: [[376, 118], [376, 254]], msg: "SQL" },
      { id: "api-sales", kind: "gateway", pts: [[540, 118], [540, 254]], msg: "SQL" },
      { id: "b-acme", kind: "fail", pts: [[540, 118], [540, 180], [376, 180], [376, 254]], label: "catalogue → acme: 403", labelAt: 0.5, blockAt: 0.4 },
      { id: "no-port", kind: "fail", pts: [[164, 85], [230, 85], [230, 330], [248, 330]], label: "no published port", labelAt: 0.2, blockAt: 0.7 },
    ],
    steps: [
      // 1 PROBLEM: every service holds the database
      { show: ["svc-a", "svc-b", "dsn-a", "dsn-b", "db", "t-acme", "t-sales", "r-a1", "r-a2", "r-s1", "r-s2", "direct-a", "direct-b"], active: ["direct-a", "direct-b"], state: { "dsn-a": "bad", "dsn-b": "bad" } },
      // 2 one service owns the graph; accounts and grants
      { show: [...base, "admin", "admin-api", "grants", "grants2"], active: ["admin-api"], state: { api: "hi", grants: "ok", grants2: "ok" } },
      // 3 a service signs in: a 15-minute token
      { show: [...base, "token", "grants", "grants2", "a-api", "b-api"], active: ["a-api", "b-api"], state: { token: "hi" } },
      // 4 each reaches its own tenant
      { show: [...base, "grants", "grants2", "a-api", "b-api", "api-acme", "api-sales"], active: ["a-api", "b-api", "api-acme", "api-sales"], state: { "t-acme": "ok", "t-sales": "ok" } },
      // 5 a tenant it is not granted: refused before any SQL
      { show: [...base, "grants", "grants2", "b-api", "b-acme"], active: ["b-api", "b-acme"], blocked: ["b-acme"], state: { "t-acme": "hi" } },
      // 6 only graphos-api reaches the database
      { show: [...base, "net", "no-port", "a-api", "api-acme"], active: ["no-port", "a-api", "api-acme"], blocked: ["no-port"], state: { net: "hi", db: "hi" } },
    ],
  },
};
