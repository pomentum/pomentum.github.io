import type { UseCaseMeta } from "../types";

// A connector drafted from an OData description: the service's $metadata read natively (no DOCTYPE, no fetched references,
// 4 MB), a person ticks the operations (list and read by key by default, writes only when ticked), the draft reviewed into the
// registry; reads follow the service's next links page by page; a write fetches its token against cross-site requests in the
// same call through the gateway, nothing kept; a query every call carries sits on the connection. Target: tested against
// stand-ins. Source: the decision on OData connectors and docs/guide/features.md on main.

export const odataConnector: UseCaseMeta = {
  slug: "odata-connector",
  kind: "integrations",
  status: "target",
  thumb: 4,
  metrics: ["paging", "writes", "secret"],
  parts: ["registry", "gateway", "cell"],
  related: ["community-node", "signed-webhooks", "polled-database"],
  shot: "registry",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "svc", kind: "icon", icon: "building", x: 846, y: 176, w: 100, h: 96, label: "an ERP", sub: "OData service" },
      { id: "person", kind: "icon", icon: "reviewer", x: 22, y: 10, w: 110, h: 90, label: "a person", sub: "ticks the operations" },
      { id: "old", kind: "panel", x: 150, y: 120, w: 320, h: 270, label: "a generic draft", sub: "read as another format", tone: "danger" },
      { id: "o-page", kind: "chip", x: 174, y: 186, w: 272, h: 30, label: "paging: left as a note", hue: 3 },
      { id: "o-key", kind: "chip", x: 174, y: 236, w: 272, h: 30, label: "a key's quotes: lost", hue: 3 },
      { id: "o-write", kind: "chip", x: 174, y: 286, w: 272, h: 30, label: "a write: no token, refused", hue: 3 },
      { id: "draft", kind: "panel", x: 150, y: 120, w: 320, h: 270, label: "connector draft", sub: "from the service's own description", tone: "neutral" },
      { id: "op-list", kind: "chip", x: 174, y: 186, w: 272, h: 30, label: "list customers · paged", hue: 0 },
      { id: "op-read", kind: "chip", x: 174, y: 232, w: 272, h: 30, label: "read a customer by key", hue: 0 },
      { id: "op-create", kind: "chip", x: 174, y: 278, w: 272, h: 30, label: "create an order · ticked", hue: 1 },
      { id: "op-delete", kind: "chip", x: 174, y: 324, w: 272, h: 30, label: "delete · not ticked", hue: 3 },
      { id: "registry", kind: "panel", x: 500, y: 16, w: 250, h: 66, label: "registry", sub: "proposed · approved", tone: "engine" },
      { id: "cell", kind: "panel", x: 500, y: 140, w: 230, h: 250, label: "acme-orders", sub: "open cell", tone: "open" },
      { id: "c-read", kind: "chip", x: 520, y: 210, w: 190, h: 30, label: "read customers", hue: 0 },
      { id: "c-write", kind: "chip", x: 520, y: 300, w: 190, h: 30, label: "create an order", hue: 1 },
      { id: "gateway", kind: "bar", x: 770, y: 110, w: 34, h: 330, label: "credential gateway", tone: "protected" },
      { id: "conn", kind: "pill", x: 610, y: 420, w: 300, h: 26, label: "connection · ?client=100 · token on write", tone: "protected" },
    ],
    flows: [
      { id: "meta", kind: "control", pts: [[890, 194], [890, 100], [310, 100], [310, 118]], label: "$metadata", labelAt: 0.3 },
      { id: "tick", kind: "control", pts: [[76, 102], [76, 293], [148, 293]], label: "tick", labelAt: 0.5 },
      { id: "propose", kind: "control", pts: [[472, 140], [484, 140], [484, 50], [498, 50]], label: "propose", labelAt: 0.6 },
      { id: "reg-cell", kind: "control", pts: [[625, 84], [625, 138]], label: "approved", labelAt: 0.5 },
      { id: "read-gw", kind: "gateway", pts: [[712, 225], [768, 225]], msg: "page 1" },
      { id: "gw-svc", kind: "gateway", pts: [[806, 225], [838, 225]] },
      { id: "next", kind: "gateway", pts: [[838, 255], [806, 255]], msg: "next link" },
      { id: "write-gw", kind: "gateway", pts: [[712, 315], [768, 315]], msg: "POST" },
      { id: "csrf", kind: "gateway", pts: [[806, 315], [880, 315], [880, 294]], label: "fetch a token, then write", labelAt: 0.3 },
      { id: "conn-l", kind: "gateway", pts: [[787, 418], [787, 442]] },
    ],
    steps: [
      // 1 PROBLEM: a generic draft loses what OData says
      { show: ["svc", "old", "o-page", "o-key", "o-write", "meta"], active: ["meta"], state: { "o-page": "warn", "o-key": "warn", "o-write": "bad" } },
      // 2 drafted from its own description
      { show: ["svc", "draft", "op-list", "op-read", "op-create", "op-delete", "meta"], active: ["meta"], state: { draft: "hi" } },
      // 3 a person ticks what it may do
      { show: ["svc", "person", "draft", "op-list", "op-read", "op-create", "op-delete", "tick"], active: ["tick"], state: { "op-create": "ok", "op-delete": "dim", person: "ok" } },
      // 4 reviewed into the registry
      {
        show: ["svc", "draft", "op-list", "op-read", "op-create", "op-delete", "registry", "cell", "c-read", "c-write", "propose", "reg-cell"],
        active: ["propose", "reg-cell"],
        state: { registry: "hi", "op-delete": "dim" },
      },
      // 5 reads, page by page
      { show: ["svc", "registry", "cell", "c-read", "c-write", "gateway", "conn", "read-gw", "gw-svc", "next", "conn-l"], active: ["read-gw", "gw-svc", "next"], state: { "c-read": "ok" } },
      // 6 a write with its token, nothing kept
      { show: ["svc", "registry", "cell", "c-read", "c-write", "gateway", "conn", "write-gw", "csrf", "conn-l"], active: ["write-gw", "csrf", "conn-l"], state: { "c-write": "ok", gateway: "hi", conn: "hi" } },
    ],
  },
};
