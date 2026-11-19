import type { UseCaseMeta } from "../types";

// Signed webhooks to work items: a merged pull request on GitHub, its webhook checked by the connector bridge, moves the Jira
// issue it names and comments on it; the GitHub and Jira secrets stay outside the cell. Source: the pack
// catalogue/packs/jira-from-git (README) and the README's Connect and Works with sections, on main.

const L = 262;
const chip = (id: string, y: number, label: string, hue: 0 | 1 | 2 | 3, x = L, w = 210) => ({ id, kind: "chip" as const, x, y, w, h: 30, label, hue });

const base = ["github", "forger", "bridge", "gateway", "jira", "openbao", "cp", "tenant", "cell", "c-in", "c-check", "c-move", "c-comment", "c-none", "bus"];

export const signedWebhooks: UseCaseMeta = {
  slug: "signed-webhooks",
  kind: "integrations",
  status: "target",
  thumb: 4,
  metrics: ["forged", "tokens", "twice"],
  parts: ["bridge", "gateway", "bus", "registry"],
  related: ["polled-database", "cold-room", "changing-production"],
  shot: "connections",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "github", kind: "icon", icon: "github", x: 22, y: 150, w: 104, h: 96, label: "GitHub", sub: "a merged pull request" },
      { id: "forger", kind: "icon", icon: "attacker", x: 22, y: 330, w: 104, h: 96, label: "a forged request" },
      { id: "jira", kind: "icon", icon: "tracker", x: 840, y: 200, w: 104, h: 96, label: "Jira", sub: "OPS-12" },
      { id: "bridge", kind: "bar", x: 152, y: 110, w: 34, h: 330, label: "connector bridge", tone: "open" },
      { id: "gateway", kind: "bar", x: 776, y: 110, w: 34, h: 330, label: "credential gateway", tone: "protected" },
      { id: "openbao", kind: "pill", x: 820, y: 380, w: 120, h: 26, label: "secrets · OpenBao", tone: "protected" },
      { id: "cp", kind: "panel", x: 300, y: 16, w: 380, h: 66, label: "control plane", sub: "versions · checks · tests", tone: "engine" },
      { id: "flow", kind: "panel", x: 220, y: 110, w: 520, h: 330, label: "one flow", sub: "an open HTTP endpoint", tone: "danger" },
      { id: "f-in", kind: "chip", x: 262, y: 196, w: 220, h: 30, label: "http in · no check", hue: 0 },
      { id: "f-tok", kind: "chip", x: 262, y: 300, w: 220, h: 30, label: "Jira token in a node", hue: 3 },
      { id: "tenant", kind: "panel", x: 220, y: 110, w: 540, h: 330, label: "tenant · acme", tone: "neutral" },
      { id: "cell", kind: "panel", x: 240, y: 132, w: 500, h: 290, label: "acme-prod", sub: "protected cell · jira-from-git", tone: "protected" },
      chip("c-in", 196, "pull request event", 0),
      chip("c-check", 248, "merged? names an issue?", 2),
      chip("c-move", 300, "move the issue to Done", 1),
      chip("c-comment", 352, "comment with the link", 3),
      chip("c-none", 248, "nothing to do", 3, 500, 196),
      { id: "once", kind: "pill", x: 30, y: 452, w: 200, h: 26, label: "a redelivery is stored once" },
      { id: "bus", kind: "hbar", x: 240, y: 462, w: 520, h: 28, label: "bus · NATS JetStream" },
    ],
    flows: [
      { id: "p-gh", kind: "data", pts: [[128, 212], [260, 212]], msg: "event" },
      { id: "p-forge", kind: "fail", pts: [[128, 362], [200, 362], [200, 212], [260, 212]], label: "let in", labelAt: 0.2 },
      { id: "p-out", kind: "fail", pts: [[484, 315], [838, 250]], label: "token in the flow", labelAt: 0.55 },
      { id: "gh-br", kind: "data", pts: [[128, 212], [150, 212]], msg: "signed" },
      { id: "forge-br", kind: "fail", pts: [[128, 362], [150, 362]] },
      { id: "br-bus", kind: "data", pts: [[169, 442], [169, 476], [238, 476]] },
      { id: "bus-in", kind: "data", pts: [[300, 460], [300, 420]] },
      { id: "again", kind: "data", pts: [[128, 222], [150, 222]], msg: "again" },
      { id: "in-check", kind: "data", pts: [[252, 211], [252, 263], [260, 263]] },
      { id: "check-move", kind: "data", pts: [[252, 263], [252, 315], [260, 315]] },
      { id: "check-none", kind: "data", pts: [[474, 263], [498, 263]], label: "closed, no merge", labelAt: 0.5 },
      { id: "move-gw", kind: "gateway", pts: [[474, 315], [774, 315]], msg: "jira · transition" },
      { id: "comment-gw", kind: "gateway", pts: [[474, 367], [774, 367]], msg: "jira · comment" },
      { id: "gw-jira", kind: "gateway", pts: [[812, 300], [838, 260]] },
      { id: "bao-gw", kind: "gateway", pts: [[818, 393], [812, 393]] },
      { id: "tests", kind: "control", pts: [[490, 84], [490, 144]], label: "tests, mocks at the gateway", labelAt: 0.5 },
    ],
    steps: [
      // 1 PROBLEM: anyone can post, the token is in the flow
      { show: ["github", "forger", "jira", "flow", "f-in", "f-tok", "p-gh", "p-forge", "p-out"], active: ["p-gh", "p-forge", "p-out"], state: { "f-in": "bad", "f-tok": "bad", forger: "bad" } },
      // 2 a signed webhook arrives
      { show: [...base, "gh-br", "forge-br", "br-bus", "bus-in"], active: ["gh-br", "br-bus", "bus-in", "forge-br"], blocked: ["forge-br"], state: { bridge: "hi", "c-in": "ok" } },
      // 3 stored once
      { show: [...base, "again", "br-bus", "once"], active: ["again"], state: { bridge: "hi", once: "hi" } },
      // 4 merged, and names an issue
      { show: [...base, "in-check", "check-move", "check-none"], active: ["in-check", "check-move", "check-none"], state: { "c-check": "hi", "c-none": "dim" } },
      // 5 the issue moves, no token in the cell
      { show: [...base, "in-check", "check-move", "move-gw", "gw-jira", "bao-gw"], active: ["move-gw", "gw-jira", "bao-gw"], state: { gateway: "hi", "c-move": "ok", jira: "ok", openbao: "hi" }, sub: { jira: "OPS-12 · Done" } },
      // 6 a comment with the link
      { show: [...base, "in-check", "check-move", "comment-gw", "gw-jira", "bao-gw"], active: ["comment-gw", "gw-jira"], state: { "c-comment": "ok", jira: "ok" }, sub: { jira: "OPS-12 · Done · commented" } },
      // 7 tested before it is deployed
      { show: [...base, "tests"], active: ["tests"], state: { cp: "hi", "c-move": "ok", "c-none": "ok" }, sub: { "c-move": "test: merged → moved ✓", "c-none": "test: no merge → nothing ✓" } },
    ],
  },
};
