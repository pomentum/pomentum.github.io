import type { UseCaseMeta } from "../types";

// Orders that need a person: an order normalised and scored; small ones accepted at once, large ones wait for a person's review,
// whose decision continues the run. Sources: the demo order pipeline (README, UI shots: "score the order" run by syrmos
// function, a run of seven steps on a timeline) and reviews that resume a run (the trials in docs/trials/).

const L = 262;
const R = 492;
const chip = (id: string, x: number, y: number, label: string, hue: 0 | 1 | 2 | 3) => ({ id, kind: "chip" as const, x, y, w: 196, h: 30, label, hue });

const base = ["orders", "bridge", "cp", "tenant", "cell", "c-in", "c-norm", "c-score", "c-big", "c-accept", "c-review", "c-answer", "bus", "reviewer", "room"];

export const ordersReview: UseCaseMeta = {
  slug: "orders-review",
  kind: "people",
  status: "target",
  thumb: 4,
  metrics: ["waiting", "run", "decided"],
  parts: ["bridge", "review", "tracing", "audit", "registry"],
  related: ["changing-production", "signed-webhooks", "assistant-drafts"],
  shot: "run",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "orders", kind: "icon", icon: "cart", x: 22, y: 222, w: 100, h: 96, label: "orders", sub: "webhook" },
      { id: "inbox", kind: "icon", icon: "person", x: 830, y: 222, w: 110, h: 96, label: "someone", sub: "checks by hand" },
      { id: "reviewer", kind: "icon", icon: "reviewer", x: 830, y: 96, w: 110, h: 90, label: "a reviewer", sub: "in the web UI" },
      { id: "room", kind: "icon", icon: "chat", x: 830, y: 300, w: 110, h: 96, label: "the team's room", sub: "a notice" },
      { id: "bridge", kind: "bar", x: 152, y: 110, w: 34, h: 330, label: "connector bridge", tone: "open" },
      { id: "cp", kind: "panel", x: 300, y: 16, w: 380, h: 66, label: "control plane", sub: "reviews · runs traced · audit log", tone: "engine" },
      { id: "flow", kind: "panel", x: 220, y: 110, w: 520, h: 330, label: "one flow", sub: "accepts everything, or waits on someone", tone: "danger" },
      { id: "f-in", kind: "chip", x: 260, y: 190, w: 196, h: 30, label: "order received", hue: 0 },
      { id: "f-score", kind: "chip", x: 260, y: 250, w: 196, h: 30, label: "score the order", hue: 1 },
      { id: "f-mail", kind: "chip", x: 260, y: 310, w: 196, h: 30, label: "e-mail it to someone", hue: 3 },
      { id: "tenant", kind: "panel", x: 220, y: 110, w: 540, h: 330, label: "tenant · acme", tone: "neutral" },
      { id: "cell", kind: "panel", x: 240, y: 132, w: 500, h: 290, label: "acme-prod", sub: "protected cell · the order pipeline", tone: "protected" },
      chip("c-in", L, 196, "order received", 0),
      chip("c-norm", L, 242, "normalise", 0),
      chip("c-score", L, 288, "score the order", 1),
      chip("c-big", L, 334, "large or complex?", 2),
      chip("c-accept", R, 242, "accept at once", 3),
      chip("c-review", R, 304, "ask a person", 2),
      chip("c-answer", R, 366, "answer", 3),
      { id: "bus", kind: "hbar", x: 220, y: 462, w: 540, h: 28, label: "bus · NATS JetStream" },
    ],
    flows: [
      { id: "o-flow", kind: "data", pts: [[124, 205], [258, 205]], msg: "order" },
      { id: "mail", kind: "fail", pts: [[458, 325], [828, 325], [828, 300]], label: "every order, by hand", labelAt: 0.6 },
      { id: "o-br", kind: "data", pts: [[124, 270], [150, 270]], msg: "order" },
      { id: "br-bus", kind: "data", pts: [[169, 442], [169, 476], [218, 476]] },
      { id: "bus-in", kind: "data", pts: [[360, 460], [360, 420]] },
      { id: "in-norm", kind: "data", pts: [[250, 211], [250, 257], [260, 257]] },
      { id: "norm-score", kind: "data", pts: [[250, 257], [250, 303], [260, 303]] },
      { id: "score-big", kind: "data", pts: [[250, 303], [250, 349], [260, 349]] },
      { id: "big-accept", kind: "data", pts: [[460, 349], [474, 349], [474, 257], [490, 257]], label: "small", labelAt: 0.5 },
      { id: "big-review", kind: "data", pts: [[460, 349], [480, 349], [480, 319], [490, 319]], label: "large", labelAt: 0.15 },
      { id: "accept-answer", kind: "data", pts: [[690, 257], [706, 257], [706, 381], [690, 381]] },
      { id: "ask", kind: "control", pts: [[600, 302], [600, 84]], label: "review asked", labelAt: 0.55 },
      { id: "to-reviewer", kind: "control", pts: [[682, 46], [828, 120]] },
      { id: "notice", kind: "control", pts: [[682, 66], [790, 66], [790, 340], [828, 340]], label: "notice", labelAt: 0.7 },
      { id: "approve", kind: "control", pts: [[828, 150], [682, 74]], label: "approved", labelAt: 0.5 },
      { id: "resume", kind: "control", pts: [[640, 84], [640, 302]], label: "the run goes on", labelAt: 0.55 },
      { id: "review-answer", kind: "data", pts: [[590, 336], [590, 364]] },
    ],
    steps: [
      // 1 PROBLEM: every order waits, or none does
      { show: ["orders", "inbox", "flow", "f-in", "f-score", "f-mail", "o-flow", "mail"], active: ["o-flow", "mail"], state: { "f-mail": "bad", inbox: "bad" } },
      // 2 received and normalised
      { show: [...base, "o-br", "br-bus", "bus-in", "in-norm"], active: ["o-br", "br-bus", "bus-in", "in-norm"], state: { "c-in": "ok", "c-norm": "ok" } },
      // 3 scored
      { show: [...base, "in-norm", "norm-score", "score-big"], active: ["norm-score", "score-big"], state: { "c-score": "hi" } },
      // 4 small orders go through
      { show: [...base, "in-norm", "norm-score", "score-big", "big-accept", "accept-answer"], active: ["big-accept", "accept-answer"], state: { "c-accept": "ok", "c-answer": "ok" } },
      // 5 large orders wait for a person
      { show: [...base, "in-norm", "norm-score", "score-big", "big-review", "ask", "to-reviewer", "notice"], active: ["big-review", "ask", "to-reviewer", "notice"], state: { "c-review": "warn", reviewer: "hi", room: "hi" }, sub: { "c-review": "ask a person · waiting" } },
      // 6 the decision continues the run
      { show: [...base, "in-norm", "norm-score", "score-big", "big-review", "approve", "resume", "review-answer"], active: ["approve", "resume", "review-answer"], state: { reviewer: "ok", "c-review": "ok", "c-answer": "ok" }, sub: { "c-review": "ask a person · approved" } },
      // 7 the whole run, traced
      { show: [...base, "in-norm", "norm-score", "score-big", "big-review", "review-answer"], trace: ["c-in", "c-norm", "c-score", "c-big", "c-review", "c-answer"], state: { cp: "hi" }, sub: { "c-review": "ask a person · approved" } },
    ],
  },
};
