import type { UseCaseText } from "../types";

export const demoEcosystem: UseCaseText = {
  title: "Explore a software ecosystem",
  situation: "Hundreds of packages, people and teams, and you want to see which packages matter and how they group.",
  team: "Engineering and platform teams",
  context:
    "For anyone who wants to see graphos on a graph that looks like real work. A graph of a million nodes cannot be drawn, but its communities can; the demo shows the same thing at a size you can look at: an invented software ecosystem, loaded by one example script.",
  metricLabels: {
    size: "The demo graph",
    central: "Most central package",
    groups: "Communities",
  },
  steps: [
    {
      tag: "problem",
      title: "Hundreds of packages, no picture",
      body: ["Packages depend on each other, people maintain them, teams own them. As a list, nothing says which packages everything leans on, or how they cluster."],
      metrics: { size: "—", central: "—", groups: "—" },
    },
    {
      tag: "product",
      title: "Load the demo",
      body: [
        "The example `08_demo_ecosystem.py` registers the tenant `demo` and loads it through the API in batches of 500. Every name in it is made up.",
        "It prints 443 nodes and 1,870 edges; running it again rewrites the same graph.",
      ],
      metrics: { size: "443 nodes · 1,870 edges" },
    },
    {
      tag: "how",
      title: "Its schema, declared",
      body: [
        "graphos ships no labels of its own; the example declares them: `Package`, with `Library`, `Framework` and `Tool` beneath it, `Person`, `Team`, `Organisation` and `Topic`, and the edge types `DEPENDS_ON`, `MAINTAINS`, `MEMBER_OF`, `PART_OF` and `TAGGED`.",
        "It also declares a search index on names, and label styles that size each package by its PageRank.",
      ],
    },
    {
      tag: "how",
      title: "Metrics, with nothing extra",
      body: [
        "graphos computes degree, PageRank, components and betweenness over `DEPENDS_ON`, beside the API, and stores them on the nodes. The example prints 280 packages in 2 components.",
        "PageRank's top package is `corelog`; betweenness's is `shiplite`.",
      ],
      metrics: { central: "corelog, by PageRank" },
    },
    {
      tag: "product",
      title: "Communities, with the igraph extra",
      body: [
        "With the optional igraph extra, the example runs Louvain, weighting `DEPENDS_ON` most, and prints 6 communities with a modularity of 0.741.",
        "Without the extra, the demo loads without them.",
      ],
      metrics: { groups: "6, modularity 0.741" },
    },
    {
      tag: "how",
      title: "See it in Explore",
      body: [
        "In the web UI, Explore draws the graph coloured by community. Selecting `corelog` shows the metrics graphos computed for it: PageRank 0.1067, a degree of 21, all incoming.",
        "Where the Cypher console is on, the example also saves queries such as `most_depended_on` and `maintainers_of`.",
      ],
    },
  ],
  parts: {
    algorithms: "PageRank, components, betweenness and, with the extra, communities.",
    ui: "Explore draws the graph, its groups and its map.",
    tenant: "The demo is one tenant, with the labels the example declares.",
    client: "The example loads it with the Python client.",
  },
  tryIt: {
    text: "Start graphos (with the igraph extra for communities), then run the example. The installation guide says how.",
    href: "https://github.com/pomentum/graphos/blob/main/clients/python/examples/08_demo_ecosystem.py",
    linkText: "The demo example",
  },
  statusNote:
    "Example: the script is in graphos's repository and its printed results are quoted in the algorithms guide; it is checked by the linter in CI but not run there. The numbers in the screenshot match its output.",
};
