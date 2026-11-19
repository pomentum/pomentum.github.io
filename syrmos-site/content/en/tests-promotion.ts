import type { UseCaseText } from "../types";

export const testsPromotion: UseCaseText = {
  title: "Tests before a promotion",
  situation: "A pipeline should pass its tests, with no real outside call, before it may be promoted into production.",
  team: "Teams that ship to production",
  context:
    "For a team that changes pipelines often. Node-RED has no maintained way to test a whole flow, so pipelines are tried by hand against the real services, and a version reaches production because someone says it worked.",
  metricLabels: {
    calls: "Outside calls in a test",
    handoffs: "A test run's hand-offs",
    promote: "A promotion with no passing tests",
  },
  steps: [
    {
      tag: "problem",
      title: "Tested by hand, for real",
      body: ["The pipeline is tried by hand, and its calls reach the real payment service. What passed, and on which version, isn't written down."],
      metrics: { calls: "real", handoffs: "sent", promote: "allowed" },
    },
    {
      tag: "syrmos",
      title: "Test cases beside the pipeline",
      body: [
        "Each case says where a message starts, how outside calls should answer, and what must happen: how the run ends, which nodes run, and checks on what they send.",
        "The cases belong to the pipeline, so they follow it from cell to cell.",
      ],
    },
    {
      tag: "how",
      title: "Calls answered by mocks",
      body: [
        "The cases run in the open cell as runs marked test. The cell marks every outside call of a test run, and the credential gateway answers it from the case's mocks, so the real service is never reached.",
      ],
      metrics: { calls: "answered by mocks" },
    },
    {
      tag: "syrmos",
      title: "Nothing leaves",
      body: ["A test run's hand-offs, progress and review are captured for the check, never published."],
      metrics: { handoffs: "captured, never sent" },
    },
    {
      tag: "how",
      title: "A report for this version",
      body: ["The run of the cases ends in a report bound to the pipeline's exact version, by its digest. The audit log records that tests ran, with their counts."],
    },
    {
      tag: "syrmos",
      title: "Required before a promotion",
      body: [
        "A protected cell can require a passing report for the version promoted into it. A version with no passing report is refused.",
      ],
      metrics: { promote: "refused where required" },
    },
  ],
  parts: {
    promotion: "Takes the passing report as the version's evidence.",
    "protected-cell": "Can require passing tests before it takes a version.",
    gateway: "Answers a test run's calls from the mocks.",
    audit: "Records each run of the tests, with counts.",
  },
  tryIt: {
    text: "Write cases in the editor's Tests panel and run them in an open cell. The features list says what is built.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/features.md",
    linkText: "The features list",
  },
  statusNote:
    "Target: test cases, mocks at the gateway, reports and the requirement before a promotion are built and tested in the repository, but no trial shows them end to end. The pipeline and the cases drawn are examples.",
};
