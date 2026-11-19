import type { DiagramDef } from "../types";

// The whole service, after the graphos page's own Fig 01 and 02: your services, AI agents and people call graphos-api with a
// bearer token; it alone connects to PostgreSQL and Apache AGE, on an internal network; each tenant is its own AGE graph; graph
// algorithms run beside the API and write back; every write goes to the change feed in the same transaction.

export const overview: DiagramDef = {
  w: 1000,
  h: 600,
  nodes: [
    { id: "svc", kind: "icon", icon: "box", side: "left", x: 4, y: 70, w: 160, h: 86, label: "your services", sub: "typed HTTP · Python client" },
    { id: "agents", kind: "icon", icon: "agent", side: "left", x: 4, y: 200, w: 160, h: 86, label: "AI agents", sub: "MCP · /mcp" },
    { id: "people", kind: "icon", icon: "person", side: "left", x: 4, y: 330, w: 160, h: 86, label: "people", sub: "the web UI" },
    { id: "net", kind: "panel", x: 220, y: 40, w: 760, h: 540, label: "internal network", sub: "the database has no published port", tone: "ghost", dashed: true },
    { id: "api", kind: "panel", x: 250, y: 90, w: 420, h: 80, label: "graphos-api", sub: "/v1 · /mcp · tokens and grants · audit log", tone: "engine" },
    { id: "algo", kind: "panel", x: 700, y: 90, w: 250, h: 80, label: "graph algorithms", sub: "beside the API · igraph optional", tone: "engine" },
    { id: "db", kind: "panel", x: 250, y: 220, w: 700, h: 270, label: "PostgreSQL 18 + Apache AGE 1.8", sub: "only graphos-api connects", tone: "protected" },
    { id: "t-acme", kind: "panel", x: 280, y: 280, w: 200, h: 180, label: "acme", sub: "its own AGE graph", tone: "open" },
    { id: "t-demo", kind: "panel", x: 510, y: 280, w: 200, h: 180, label: "demo", sub: "its own AGE graph", tone: "open" },
    { id: "t-sales", kind: "panel", x: 740, y: 280, w: 190, h: 180, label: "sales", sub: "its own AGE graph", tone: "open" },
    { id: "feed", kind: "hbar", x: 250, y: 520, w: 700, h: 28, label: "change feed · in the same transaction as each write" },
  ],
  flows: [
    { id: "svc-api", kind: "control", pts: [[166, 113], [248, 113]] },
    { id: "agents-api", kind: "control", pts: [[166, 243], [200, 243], [200, 133], [248, 133]] },
    { id: "people-api", kind: "control", pts: [[166, 373], [212, 373], [212, 153], [248, 153]] },
    { id: "api-db", kind: "gateway", pts: [[380, 172], [380, 278]] },
    { id: "api-db2", kind: "gateway", pts: [[610, 172], [610, 278]] },
    { id: "algo-db", kind: "gateway", pts: [[835, 172], [835, 278]] },
    { id: "api-algo", kind: "control", pts: [[672, 130], [698, 130]] },
    { id: "db-feed", kind: "data", pts: [[600, 492], [600, 518]] },
    { id: "feed-svc", kind: "data", pts: [[248, 534], [190, 534], [190, 160], [166, 160]] },
  ],
  steps: [
    {
      show: ["svc", "agents", "people", "net", "api", "algo", "db", "t-acme", "t-demo", "t-sales", "feed", "svc-api", "agents-api", "people-api", "api-db", "api-db2", "algo-db", "api-algo", "db-feed", "feed-svc"],
      active: ["svc-api", "agents-api", "people-api", "api-db", "algo-db", "db-feed", "feed-svc"],
    },
  ],
};
