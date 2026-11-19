import type { DiagramDef } from "../types";

// The home page's overview, after the README's concept diagram: who works in it → control plane → tenants' open and protected
// cells over the bus; the connector bridge on the left, the credential gateway on the right; below, a spur (dashed, in development):
// a tenant's own machine running a spur cell beside its machines and devices, synced over HTTPS through the spur service,
// a process beside the control plane that keeps nothing (docs/guide/spurs.md, docs/architecture/spur.md; the README's concept picture). A spur does not join the bus: its embedded bus leaf is not built.

const left = [
  { id: "in-mqtt", icon: "sensor" as const, label: "brokers", sub: "MQTT · Kafka · RabbitMQ" },
  { id: "in-hook", icon: "github" as const, label: "signed webhooks", sub: "GitHub · Stripe …" },
  { id: "in-room", icon: "chat" as const, label: "rooms and chat", sub: "Matrix · Telegram …" },
  { id: "in-db", icon: "database" as const, label: "polled rows", sub: "PostgreSQL · MySQL" },
];
const right = [
  { id: "out-code", icon: "tracker" as const, label: "code and trackers", sub: "GitHub · Jira …" },
  { id: "out-chat", icon: "chat" as const, label: "chat", sub: "Slack · Teams …" },
  { id: "out-files", icon: "bucket" as const, label: "files and data", sub: "S3 · SFTP …" },
  { id: "out-model", icon: "model" as const, label: "models and agents", sub: "OpenAI-compatible · MCP" },
];

export const overview: DiagramDef = {
  w: 1000,
  h: 668,
  nodes: [
    { id: "people", kind: "icon", side: "above", icon: "person", x: 318, y: 4, w: 110, h: 84, label: "people" },
    { id: "assistant", kind: "icon", side: "above", icon: "assistant", x: 445, y: 4, w: 110, h: 84, label: "the assistant" },
    { id: "agents", kind: "icon", side: "above", icon: "agent", x: 572, y: 4, w: 110, h: 84, label: "outside agents", sub: "MCP" },
    { id: "cp", kind: "panel", x: 250, y: 106, w: 400, h: 72, label: "control plane", sub: "versions · checks · promotion · traces · audit log", tone: "engine" },
    { id: "bridge", kind: "bar", x: 166, y: 106, w: 34, h: 344, label: "connector bridge", tone: "open" },
    { id: "gateway", kind: "bar", x: 800, y: 106, w: 34, h: 344, label: "credential gateway", tone: "protected" },
    ...left.map((n, i) => ({ ...n, kind: "icon" as const, side: "left" as const, x: 4, y: 104 + i * 92, w: 150, h: 86 })),
    ...right.map((n, i) => ({ ...n, kind: "icon" as const, side: "right" as const, x: 846, y: 104 + i * 92, w: 150, h: 86 })),
    { id: "t-acme", kind: "panel", x: 226, y: 206, w: 262, h: 196, label: "tenant · acme", tone: "neutral" },
    { id: "acme-dev", kind: "panel", x: 242, y: 252, w: 104, h: 126, label: "dev", sub: "open", tone: "open" },
    { id: "acme-prod", kind: "panel", x: 370, y: 252, w: 104, h: 126, label: "prod", sub: "protected", tone: "protected" },
    { id: "t-demo", kind: "panel", x: 512, y: 206, w: 262, h: 196, label: "tenant · demo", tone: "neutral" },
    { id: "demo-dev", kind: "panel", x: 528, y: 252, w: 104, h: 126, label: "dev", sub: "open", tone: "open" },
    { id: "demo-prod", kind: "panel", x: 656, y: 252, w: 104, h: 126, label: "prod", sub: "protected", tone: "protected" },
    { id: "bus", kind: "hbar", x: 226, y: 422, w: 548, h: 28, label: "bus · NATS JetStream" },
    { id: "spursvc", kind: "panel", x: 662, y: 106, w: 126, h: 72, label: "spur service", sub: "beside it", tone: "engine" },
    { id: "spur", kind: "panel", x: 300, y: 486, w: 508, h: 170, label: "spur · in development", sub: "a tenant's own machine, on site", tone: "ghost", dashed: true },
    { id: "spur-cell", kind: "panel", x: 330, y: 536, w: 200, h: 110, label: "acme-line-1", sub: "a spur cell, governed", tone: "open" },
    { id: "spur-read", kind: "chip", x: 346, y: 608, w: 168, h: 26, label: "read the line", hue: 0 },
    { id: "policy", kind: "pill", x: 652, y: 506, w: 128, h: 24, label: "local policy" },
    { id: "devices", kind: "icon", side: "right", icon: "machine", x: 846, y: 548, w: 150, h: 86, label: "machines and devices", sub: "Modbus · OPC UA · MIDI …" },
  ],
  flows: [
    { id: "p-cp", kind: "control", pts: [[373, 90], [373, 104]] },
    { id: "a-cp", kind: "control", pts: [[500, 90], [500, 104]] },
    { id: "g-cp", kind: "control", pts: [[627, 90], [627, 104]] },
    { id: "cp-acme", kind: "control", pts: [[357, 180], [357, 204]] },
    { id: "cp-demo", kind: "control", pts: [[643, 180], [643, 204]] },
    ...left.map((n, i) => ({ id: `${n.id}-f`, kind: "data" as const, pts: [[124, 146 + i * 92], [164, 146 + i * 92]] as [number, number][] })),
    { id: "br-bus", kind: "data", pts: [[202, 436], [224, 436]] },
    { id: "bus-acme", kind: "data", pts: [[422, 420], [422, 380]] },
    { id: "bus-demo", kind: "data", pts: [[580, 420], [580, 380]] },
    { id: "promote-acme", kind: "control", pts: [[348, 315], [368, 315]] },
    { id: "promote-demo", kind: "control", pts: [[634, 315], [654, 315]] },
    { id: "prod-gw", kind: "gateway", pts: [[762, 300], [798, 300]] },
    ...right.map((n, i) => ({ id: `${n.id}-f`, kind: "gateway" as const, pts: [[836, 146 + i * 92], [874, 146 + i * 92]] as [number, number][] })),
    { id: "spur-sync", kind: "control", pts: [[532, 556], [787, 556], [787, 180]], label: "sync over HTTPS", labelAt: 0.25 },
    { id: "svc-cp", kind: "control", pts: [[660, 142], [652, 142]] },
    { id: "spur-dev", kind: "data", pts: [[874, 591], [516, 621]] },
  ],
  steps: [
    {
      show: [
        "people", "assistant", "agents", "cp", "bridge", "gateway",
        ...left.map((n) => n.id), ...right.map((n) => n.id),
        "t-acme", "acme-dev", "acme-prod", "t-demo", "demo-dev", "demo-prod", "bus",
        "spursvc", "spur", "spur-cell", "spur-read", "policy", "devices",
        "p-cp", "a-cp", "g-cp", "cp-acme", "cp-demo", ...left.map((n) => `${n.id}-f`), "br-bus", "bus-acme", "bus-demo",
        "promote-acme", "promote-demo", "prod-gw", ...right.map((n) => `${n.id}-f`), "spur-sync", "svc-cp", "spur-dev",
      ],
      active: [
        "cp-acme", "cp-demo", "in-mqtt-f", "in-hook-f", "br-bus", "bus-acme", "bus-demo", "promote-acme", "prod-gw", "out-code-f", "out-chat-f",
        "spur-sync", "spur-dev",
      ],
    },
  ],
};
