import type { UseCaseMeta } from "../types";

// Tests before a promotion: test cases beside a pipeline (a start, mocks, what must happen), run in an open cell as runs marked test,
// outside calls answered by mocks at the gateway, hand-offs captured and never published; a report bound to the pipeline's digest;
// a protected cell that requires a passing report refuses a promotion without one. Target: built and tested in the repository,
// no trial. Source: the decision on pipeline tests (parts A to C, as built) and docs/guide/features.md (Pipeline tests) on main.

const base = ["cp", "dev", "d-in", "d-pay", "d-hand", "prod", "p-in", "p-pay", "p-hand", "gateway", "api", "cases"];

export const testsPromotion: UseCaseMeta = {
  slug: "tests-promotion",
  kind: "people",
  status: "target",
  thumb: 2,
  metrics: ["calls", "handoffs", "promote"],
  parts: ["promotion", "protected-cell", "gateway", "audit"],
  related: ["changing-production", "batch-review", "assistant-drafts"],
  shot: "editor",
  diagram: {
    w: 960,
    h: 520,
    nodes: [
      { id: "cp", kind: "panel", x: 220, y: 16, w: 460, h: 66, label: "control plane", sub: "test cases · reports · promotion", tone: "engine" },
      { id: "cases", kind: "pill", x: 30, y: 40, w: 170, h: 26, label: "3 test cases" },
      { id: "dev", kind: "panel", x: 60, y: 130, w: 300, h: 260, label: "acme-dev", sub: "open cell", tone: "open" },
      { id: "d-in", kind: "chip", x: 82, y: 196, w: 256, h: 30, label: "order in", hue: 0 },
      { id: "d-pay", kind: "chip", x: 82, y: 246, w: 256, h: 30, label: "call the payment service", hue: 1 },
      { id: "d-hand", kind: "chip", x: 82, y: 296, w: 256, h: 30, label: "hand off to shipping", hue: 2 },
      { id: "prod", kind: "panel", x: 420, y: 130, w: 280, h: 260, label: "acme-prod", sub: "protected · requires passing tests", tone: "protected" },
      { id: "p-in", kind: "chip", x: 442, y: 196, w: 236, h: 30, label: "order in", hue: 0 },
      { id: "p-pay", kind: "chip", x: 442, y: 246, w: 236, h: 30, label: "call the payment service", hue: 1 },
      { id: "p-hand", kind: "chip", x: 442, y: 296, w: 236, h: 30, label: "hand off to shipping", hue: 2 },
      { id: "gateway", kind: "bar", x: 740, y: 110, w: 34, h: 330, label: "credential gateway", tone: "protected" },
      { id: "mock", kind: "pill", x: 790, y: 330, w: 150, h: 26, label: "mock · 200 paid", tone: "open" },
      { id: "api", kind: "icon", icon: "globe", side: "left", x: 836, y: 200, w: 100, h: 96, label: "payment service" },
      { id: "captured", kind: "pill", x: 82, y: 346, w: 256, h: 26, label: "hand-off captured, not sent" },
      { id: "report", kind: "pill", x: 30, y: 420, w: 330, h: 26, label: "report · 3 of 3 passed · this version", tone: "open" },
      { id: "careless", kind: "panel", x: 60, y: 130, w: 640, h: 260, label: "tested by hand", sub: "against the real service", tone: "danger" },
    ],
    flows: [
      { id: "real", kind: "fail", pts: [[702, 260], [834, 260]], label: "a real payment, in a test", labelAt: 0.5 },
      { id: "run", kind: "control", pts: [[200, 84], [200, 128]], label: "run as test runs", labelAt: 0.3 },
      { id: "to-gw", kind: "gateway", pts: [[340, 261], [380, 261], [380, 104], [757, 104], [757, 108]], msg: "marked test" },
      { id: "mock-l", kind: "gateway", pts: [[788, 343], [776, 343]] },
      { id: "no-real", kind: "fail", pts: [[776, 260], [834, 260]], label: "never reached", labelAt: 0.5, blockAt: 0.5 },
      { id: "report-l", kind: "control", pts: [[195, 418], [195, 392]] },
      { id: "promote", kind: "control", pts: [[362, 220], [418, 220]], label: "promote", labelAt: 0.5 },
      { id: "refuse", kind: "fail", pts: [[362, 280], [418, 280]], label: "no report: refused", labelAt: 0.5, blockAt: 0.6 },
    ],
    steps: [
      // 1 PROBLEM: tested by hand, against the real service
      { show: ["careless", "api", "real"], active: ["real"], state: { careless: "bad" } },
      // 2 test cases beside the pipeline
      { show: [...base], state: { cases: "hi" } },
      // 3 run as test runs, calls answered by mocks
      { show: [...base, "mock", "run", "to-gw", "mock-l", "no-real"], active: ["run", "to-gw", "mock-l", "no-real"], blocked: ["no-real"], state: { mock: "hi", "d-pay": "ok" } },
      // 4 nothing leaves
      { show: [...base, "mock", "captured"], state: { captured: "hi", "d-hand": "ok" } },
      // 5 a report for this version
      { show: [...base, "report", "report-l"], active: ["report-l"], state: { report: "ok", dev: "ok" } },
      // 6 required before the promotion
      { show: [...base, "report", "promote", "refuse"], active: ["promote", "refuse"], blocked: ["refuse"], state: { prod: "hi" } },
    ],
  },
};
