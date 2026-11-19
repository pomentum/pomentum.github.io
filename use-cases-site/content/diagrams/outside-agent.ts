import type { UseCaseMeta } from "../types";

// An outside agent through MCP: a person connects an agent, which acts as that person with the scopes they chose; it reads a
// failed run, fixes the pipeline in the open cell, files a promotion request a person decides, and never writes a protected
// cell. Sources: the agent trials in docs/trials/, the README's MCP server line, on main.

const base = ["person", "agent", "reviewer", "audit", "cp", "tenant", "dev", "prod", "d-1", "p-1"];

export const outsideAgent: UseCaseMeta = {
  slug: "outside-agent",
  kind: "ai",
  status: "shown",
  thumb: 4,
  metrics: ["actsAs", "protected", "audit"],
  parts: ["mcp", "cell", "protected-cell", "promotion", "audit"],
  related: ["assistant-drafts", "changing-production", "many-tenants"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "person", kind: "icon", icon: "person", x: 22, y: 24, w: 104, h: 90, label: "a person", sub: "allows the agent" },
      { id: "agent", kind: "icon", icon: "agent", x: 22, y: 250, w: 104, h: 96, label: "an outside agent", sub: "MCP client" },
      { id: "key", kind: "pill", x: 30, y: 370, w: 150, h: 26, label: "admin API key", tone: "protected" },
      { id: "reviewer", kind: "icon", icon: "reviewer", x: 840, y: 24, w: 104, h: 90, label: "the person decides", sub: "in the Syrmos UI" },
      { id: "audit", kind: "icon", icon: "log", x: 840, y: 300, w: 104, h: 96, label: "audit log", sub: "per tenant" },
      { id: "cp", kind: "panel", x: 220, y: 20, w: 520, h: 104, label: "control plane · MCP server", sub: "as the person, with the scopes they chose", tone: "engine" },
      { id: "tenant", kind: "panel", x: 220, y: 172, w: 540, h: 270, label: "tenant · acme", tone: "neutral" },
      { id: "dev", kind: "panel", x: 240, y: 214, w: 236, h: 206, label: "acme-dev", sub: "open cell · v4", tone: "open" },
      { id: "prod", kind: "panel", x: 504, y: 214, w: 236, h: 206, label: "acme-prod", sub: "protected cell · v4", tone: "protected" },
      { id: "d-1", kind: "chip", x: 262, y: 300, w: 192, h: 30, label: "score the order", hue: 1 },
      { id: "p-1", kind: "chip", x: 526, y: 300, w: 192, h: 30, label: "score the order", hue: 1 },
    ],
    flows: [
      { id: "admin", kind: "fail", pts: [[128, 300], [200, 300], [200, 140], [620, 140], [620, 212]], label: "anything, anywhere", labelAt: 0.6 },
      { id: "consent", kind: "control", pts: [[128, 66], [218, 66]], label: "sign in · scopes", labelAt: 0.5 },
      { id: "mcp", kind: "control", pts: [[128, 290], [180, 290], [180, 104], [218, 104]], label: "MCP", labelAt: 0.4 },
      { id: "read", kind: "control", pts: [[330, 126], [330, 212]], label: "read the failed run", labelAt: 0.45 },
      { id: "write", kind: "control", pts: [[400, 126], [400, 212]], label: "dry run, then write", labelAt: 0.7 },
      { id: "request", kind: "control", pts: [[742, 52], [838, 52]], label: "promotion request", labelAt: 0.5 },
      { id: "decide", kind: "control", pts: [[838, 84], [742, 84]], label: "approved", labelAt: 0.5 },
      { id: "promote", kind: "control", pts: [[478, 256], [502, 256]] },
      { id: "to-prod", kind: "fail", pts: [[128, 300], [200, 300], [200, 140], [640, 140], [640, 212]], label: "write the protected cell", labelAt: 0.62, blockAt: 0.92 },
      { id: "record", kind: "control", pts: [[742, 110], [800, 110], [800, 340], [838, 340]], label: "the person · the client", labelAt: 0.6 },
    ],
    steps: [
      // 1 PROBLEM: an agent with an admin key
      { show: ["agent", "key", "tenant", "dev", "prod", "d-1", "p-1", "admin"], active: ["admin"], state: { key: "bad", prod: "bad" } },
      // 2 a person connects it
      { show: [...base, "consent", "mcp"], active: ["consent", "mcp"], state: { cp: "hi", person: "ok" } },
      // 3 it reads, as the person
      { show: [...base, "mcp", "read"], active: ["read"], state: { "d-1": "bad" }, sub: { "d-1": "score the order · failed run" } },
      // 4 it fixes the open cell
      { show: [...base, "mcp", "write"], active: ["write"], state: { dev: "hi", "d-1": "ok" }, sub: { dev: "open cell · v5 by the agent", "d-1": "score the order · fixed" } },
      // 5 it asks to promote; a person decides
      { show: [...base, "request", "decide", "promote"], active: ["request", "decide", "promote"], state: { reviewer: "ok", prod: "hi" }, sub: { dev: "open cell · v5", prod: "protected cell · v5", "d-1": "score the order · fixed", "p-1": "score the order · fixed" } },
      // 6 never more than the person
      { show: [...base, "mcp", "to-prod"], active: ["to-prod"], blocked: ["to-prod"], sub: { dev: "open cell · v5", prod: "protected cell · v5" } },
      // 7 on the record
      { show: [...base, "record"], active: ["record"], state: { audit: "ok" }, sub: { dev: "open cell · v5", prod: "protected cell · v5" } },
    ],
  },
};
