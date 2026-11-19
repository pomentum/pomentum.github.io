import type { UseCaseText } from "../types";

export const communities: UseCaseText = {
  title: "Communities and key nodes, re-run cheaply",
  situation: "Find the graph's central nodes and its communities, and keep them current without rewriting the whole graph each time.",
  team: "Analysts and platform teams",
  context:
    "For a team that wants to know which nodes matter and how the graph clusters, and to run it again as the data changes. Both community algorithms number their clusters arbitrarily, so a plain re-run would rename every community, and rewriting every score touches every node.",
  metricLabels: {
    metrics: "Metrics re-run, 1 % more edges",
    groups: "Communities re-run, 1 % more edges",
    ids: "Community ids kept",
  },
  steps: [
    {
      tag: "problem",
      title: "A plain re-run renames everything",
      body: ["Run the algorithm again after a small change and the communities come back with new numbers, and every node is written again."],
      metrics: { metrics: "every moved score rewritten", groups: "—", ids: "renumbered" },
    },
    {
      tag: "product",
      title: "Metrics, beside the data",
      body: [
        "`POST …/graph/metrics:compute` (the maintain level) computes degree, PageRank and components by default, and betweenness when asked: exact, and skipped above 20,000 nodes. They run on rustworkx, which is always installed.",
        "The results are stored on the nodes, as `graphos_pagerank`, `graphos_component` and the like; writes may not use those names.",
      ],
    },
    {
      tag: "how",
      title: "Communities, as a job",
      body: [
        "`POST …/recompute-communities` runs Louvain, or Leiden, in a process of its own, so the API keeps serving. It needs the optional igraph extra; without it the answer is 501.",
        "One whole-graph job runs per tenant at a time. With `Prefer: respond-async` the answer is 202 and a job to follow.",
      ],
    },
    {
      tag: "how",
      title: "The first run, measured",
      body: [
        "On a synthetic graph of 270,000 nodes and 1.0 million edges: degree, PageRank and components in 51 s; Louvain in 276 s.",
      ],
    },
    {
      tag: "product",
      title: "A re-run writes only what moved",
      body: [
        "A score is rewritten only when it moved by more than 1 %. After 1 % more edges on a graph of 250,000 nodes, the metrics re-run rewrote 19,153 nodes in 17 s, where an earlier release rewrote 250,076 in 40 s.",
        "An unchanged graph gets no new revisions and no change records.",
      ],
      metrics: { metrics: "17 s, 19,153 nodes rewritten" },
    },
    {
      tag: "product",
      title: "Leiden keeps the ids",
      body: [
        "Leiden can start from the stored communities, when the last run was Leiden over the same scope, weights and resolution, so they keep their ids. After 1 % more edges: 28 s, 5,083 nodes rewritten, 63 of 63 ids kept.",
        "Louvain, the default, starts from scratch each time: 103 s, 190,911 nodes rewritten, and 1 of 62 ids kept.",
      ],
      metrics: { groups: "28 s with Leiden (103 s, Louvain)", ids: "63 of 63 with Leiden" },
    },
  ],
  parts: {
    algorithms: "Computed in a process of their own, stored on the nodes.",
    tenant: "One whole-graph job per tenant at a time.",
    ui: "Explore's groups and metrics, with a way to compute again.",
    changes: "A re-run that changes nothing records nothing.",
  },
  tryIt: {
    text: "The algorithms guide says what each one finds, how Louvain and Leiden differ, and how to run them.",
    href: "https://github.com/pomentum/graphos/blob/main/docs/guide/algorithms.md",
    linkText: "Read the algorithms guide",
  },
  statusNote:
    "Measured, on synthetic graphs, in graphos's algorithms guide and Apache AGE notes (the graphos page shows the same runs): first runs on 270,000 nodes and 1.0 million edges, and re-runs after 1 % more edges on 250,080 nodes and 951,272 edges. Tests check that a score is written only when it moved past the tolerance and that Leiden from the stored partition keeps it after a small change.",
};
