import type { UseCaseMeta } from "../types";
import { api, caller, db, intoApi, outside, row, tenant } from "./kit";

// An AI agent reads the graph over MCP: /mcp on the API's own port, the same tokens and grants as /v1, 22 read tools and a
// schema summary written for models; no tool writes, every call audited. Sources (graphos main): docs/index.html (Features),
// docs/guide/agents.md and its decision records (the MCP surface; MCP uses the API's tokens).

const base = ["agent", "api", "db", "t-acme", "r1", "r2", "tools"];

export const mcpAgents: UseCaseMeta = {
  slug: "mcp-agents",
  kind: "agents",
  status: "target",
  thumb: 3,
  metrics: ["reads", "writes", "audit"],
  parts: ["mcp", "access", "audit", "tenant"],
  related: ["many-services", "communities", "demo-ecosystem"],
  shot: "query",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      caller("agent", "agent", "an AI agent", 0, "an MCP client"),
      caller("person", "person", "the person it acts for", 1, "signs in once"),
      api("/mcp · the same tokens as /v1"),
      db(),
      tenant("t-acme", "acme", 0, "granted: read"),
      row("r1", "Package · Person · Team", 0, 0, 0),
      row("r2", "saved query: owners", 0, 1, 1),
      { id: "tools", kind: "panel", x: 506, y: 256, w: 200, h: 200, label: "22 read tools", sub: "a schema summary for models", tone: "neutral" },
      { id: "t1", kind: "chip", x: 522, y: 318, w: 168, h: 26, label: "get_schema", hue: 0 },
      { id: "t2", kind: "chip", x: 522, y: 352, w: 168, h: 26, label: "search_nodes · get_neighbors", hue: 0 },
      { id: "t3", kind: "chip", x: 522, y: 386, w: 168, h: 26, label: "run_saved_query", hue: 1 },
      { id: "t4", kind: "chip", x: 522, y: 420, w: 168, h: 26, label: "no tool writes", hue: 3 },
      outside("auditlog", "log", "audit log", 0, "every call"),
      { id: "custom", kind: "panel", x: 250, y: 196, w: 480, h: 290, label: "custom code against the API", sub: "no grants for the agent, no record of the person", tone: "danger" },
    ],
    flows: [
      { id: "glue", kind: "fail", pts: [[164, 85], [376, 85], [376, 194]], label: "glue code", labelAt: 0.35 },
      { id: "signin", kind: "control", pts: intoApi(1), label: "sign in (OAuth, PKCE)", labelAt: 0.2 },
      { id: "call", kind: "control", pts: intoApi(0), msg: "tool call" },
      { id: "api-tools", kind: "control", pts: [[540, 118], [540, 254]] },
      { id: "read", kind: "gateway", pts: [[376, 118], [376, 254]], msg: "read" },
      { id: "write-x", kind: "fail", pts: [[164, 75], [248, 75]], label: "a write", labelAt: 0.4, blockAt: 0.6 },
      { id: "audit-l", kind: "control", pts: [[582, 70], [798, 70]] },
    ],
    steps: [
      // 1 PROBLEM: custom code
      { show: ["agent", "custom", "glue"], active: ["glue"], state: { custom: "bad" } },
      // 2 the same tokens as /v1
      { show: [...base, "person", "signin"], active: ["signin"], state: { api: "hi", person: "ok" } },
      // 3 tools, as the caller's grants allow
      { show: [...base, "t1", "t2", "call", "api-tools", "read"], active: ["call", "api-tools", "read"], state: { t2: "ok", "t-acme": "ok" } },
      // 4 a schema summary, and saved queries first
      { show: [...base, "t1", "t2", "t3", "call", "api-tools"], active: ["call", "api-tools"], state: { t1: "hi", t3: "hi" } },
      // 5 no tool writes
      { show: [...base, "t1", "t2", "t3", "t4", "write-x"], active: ["write-x"], blocked: ["write-x"], state: { t4: "warn" } },
      // 6 every call on the record
      { show: [...base, "t1", "t2", "t3", "t4", "auditlog", "call", "audit-l"], active: ["call", "audit-l"], state: { auditlog: "ok" } },
    ],
  },
};
