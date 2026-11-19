import type { UseCaseMeta } from "../types";

// A tool from an outside MCP server: a person binds the server to a cell as a connection, sees each tool with its description and
// schemas, and allows one; a question in the intake makes the pipeline call it with syrmos mcp through the gateway; a tool nobody
// allowed is refused and never run; a definition changed behind its name is refused until the person accepts it again; the
// server's credential never reaches the cell. Source: the outside MCP tool trial on main (13 checks, 2026-10-30).

const base = ["person", "bridge", "cell", "c-in", "c-call", "c-on", "bus", "gateway", "t-ok", "t-no", "server", "secret"];

export const mcpTool: UseCaseMeta = {
  slug: "mcp-tool",
  kind: "ai",
  status: "shown",
  thumb: 2,
  metrics: ["tools", "changed", "token"],
  parts: ["gateway", "cell"],
  related: ["outside-agent", "rag-ingestion", "assistant-drafts"],
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "person", kind: "icon", icon: "reviewer", x: 560, y: 8, w: 110, h: 90, label: "a person", sub: "allows a tool" },
      { id: "questions", kind: "icon", icon: "chat", x: 22, y: 200, w: 100, h: 96, label: "questions" },
      { id: "bridge", kind: "bar", x: 150, y: 110, w: 34, h: 330, label: "connector bridge", tone: "open" },
      { id: "flow", kind: "panel", x: 220, y: 130, w: 440, h: 260, label: "one flow", sub: "the server's token in a node", tone: "danger" },
      { id: "f-any", kind: "chip", x: 250, y: 220, w: 300, h: 30, label: "call any tool", hue: 3 },
      { id: "cell", kind: "panel", x: 220, y: 120, w: 440, h: 290, label: "acme-desk", sub: "open cell", tone: "open" },
      { id: "c-in", kind: "chip", x: 250, y: 190, w: 380, h: 30, label: "a question in", hue: 0 },
      { id: "c-call", kind: "chip", x: 250, y: 250, w: 380, h: 30, label: "syrmos mcp · the allowed tool", hue: 1 },
      { id: "c-on", kind: "chip", x: 250, y: 310, w: 380, h: 30, label: "its answer, as the message", hue: 2 },
      { id: "bus", kind: "hbar", x: 220, y: 450, w: 440, h: 28, label: "bus · NATS JetStream" },
      { id: "gateway", kind: "bar", x: 700, y: 110, w: 34, h: 330, label: "credential gateway", tone: "protected" },
      { id: "t-ok", kind: "pill", x: 750, y: 130, w: 190, h: 26, label: "tool A · allowed", tone: "open" },
      { id: "t-no", kind: "pill", x: 750, y: 166, w: 190, h: 26, label: "tool B · not allowed", tone: "neutral" },
      { id: "server", kind: "icon", icon: "tracker", side: "left", x: 836, y: 220, w: 100, h: 96, label: "a ticket desk", sub: "MCP server" },
      { id: "secret", kind: "pill", x: 750, y: 400, w: 190, h: 26, label: "its token · OpenBao", tone: "protected" },
    ],
    flows: [
      { id: "leak", kind: "fail", pts: [[552, 235], [834, 235]], label: "any tool, the token in the flow", labelAt: 0.5 },
      { id: "allow", kind: "control", pts: [[614, 100], [614, 116], [845, 116], [845, 128]], label: "allow tool A", labelAt: 0.3 },
      { id: "q", kind: "data", pts: [[124, 205], [248, 205]], msg: "a question" },
      { id: "call", kind: "gateway", pts: [[632, 265], [698, 265]], msg: "tool A" },
      { id: "gw-srv", kind: "gateway", pts: [[736, 265], [834, 265]] },
      { id: "back", kind: "gateway", pts: [[834, 290], [736, 290], [736, 325], [632, 325]], msg: "answer" },
      { id: "bao", kind: "gateway", pts: [[748, 413], [736, 413]] },
      { id: "call-b", kind: "fail", pts: [[632, 265], [698, 265]], label: "tool B: refused", labelAt: 0.5, blockAt: 0.8 },
      { id: "changed", kind: "fail", pts: [[834, 240], [736, 240]], label: "tool A changed: refused", labelAt: 0.5, blockAt: 0.3 },
      { id: "reaccept", kind: "control", pts: [[614, 100], [614, 116], [845, 116], [845, 128]], label: "sees the change, accepts it", labelAt: 0.3 },
    ],
    steps: [
      // 1 PROBLEM: any tool, the token in the flow
      { show: ["questions", "flow", "f-any", "server", "leak"], active: ["leak"], state: { flow: "bad", "f-any": "bad" } },
      // 2 bound, and one tool allowed
      { show: [...base, "questions", "allow"], active: ["allow"], state: { "t-ok": "ok", person: "ok" } },
      // 3 a question, the allowed tool
      { show: [...base, "questions", "q", "call", "gw-srv", "back", "bao"], active: ["q", "call", "gw-srv", "back", "bao"], state: { "c-call": "ok", "c-on": "ok", gateway: "hi" } },
      // 4 a tool nobody allowed
      { show: [...base, "questions", "call-b"], active: ["call-b"], blocked: ["call-b"], state: { "t-no": "bad" } },
      // 5 changed behind its name
      { show: [...base, "questions", "changed"], active: ["changed"], blocked: ["changed"], state: { "t-ok": "warn" }, sub: { "t-ok": "tool A · changed" } },
      // 6 accepted again
      { show: [...base, "questions", "reaccept", "call", "gw-srv"], active: ["reaccept", "call", "gw-srv"], state: { "t-ok": "ok", person: "ok" } },
    ],
  },
};
