import type { UseCaseText } from "../types";

export const mcpAgents: UseCaseText = {
  title: "An AI agent reads the graph",
  situation: "An AI agent should answer questions from the graph, read only what its person may read, and leave a record of every call.",
  team: "AI and platform teams",
  context:
    "For a team whose agents need connected data: dependencies, owners, a knowledge graph, an agent's own memory. Without an MCP endpoint, an agent needs custom code against the REST API, and graph databases' own MCP servers offer no per-tenant grants or an audit that names the person.",
  metricLabels: {
    reads: "What the agent may read",
    writes: "Writes",
    audit: "In the audit log",
  },
  steps: [
    {
      tag: "problem",
      title: "Custom code for every agent",
      body: ["The agent reaches the graph through code written for it, with credentials of its own and nothing that ties what it reads to the person it acts for."],
      metrics: { reads: "whatever its code can", writes: "—", audit: "—" },
    },
    {
      tag: "product",
      title: "The same tokens as the API",
      body: [
        "graphos serves `/mcp` on the API's own port, on by default. Whatever a token may read through `/v1`, it may read through `/mcp`, and no more.",
        "A service account with a read grant signs in as any service does. A person's MCP client signs them in by itself: graphos acts as the OAuth server (PKCE, loopback callbacks only), or the client brings a token from your single sign-on.",
      ],
      metrics: { reads: "what its token may read through /v1" },
    },
    {
      tag: "how",
      title: "22 read tools",
      body: [
        "The agent sees graphos's reads as tools: `list_tenants`, `get_schema`, `search_nodes`, `get_neighbors`, `shortest_paths`, `recent_changes`, `run_saved_query` and more. `run_cypher` is there only where the Cypher console is on.",
        "A result over 64 KiB is cut, and the answer says so.",
      ],
    },
    {
      tag: "how",
      title: "A schema written for models",
      body: [
        "`get_schema` gives a summary meant for a model: the labels with their counts and properties, the values themselves where there are at most 20, which labels connect, the search indexes and the saved queries.",
        "The server's instructions tell the agent to run a saved query first when one answers the question.",
      ],
    },
    {
      tag: "product",
      title: "No tool writes",
      body: [
        "No tool writes, and Cypher reads only. A token graphos issues to a person's MCP client reads only, at the read level of that person's tenants.",
        "graphos's guide adds a warning worth keeping: what the graph holds is untrusted input to the model.",
      ],
      metrics: { writes: "none: no tool writes" },
    },
    {
      tag: "how",
      title: "Every call on the record",
      body: ["Every tool call is in the audit log, whatever the setting for logging reads, naming the account or the person that made it."],
      metrics: { audit: "every call" },
    },
  ],
  parts: {
    mcp: "22 read tools, a schema summary and resources for models.",
    access: "The same tokens and grants as the API.",
    audit: "Every tool call, named.",
    tenant: "Only the tenants the token is granted.",
  },
  tryIt: {
    text: "The agents guide says where /mcp is, how to get a token, how to configure a client, and lists every tool.",
    href: "https://github.com/pomentum/graphos/blob/main/docs/guide/agents.md",
    linkText: "Read the agents guide",
  },
  statusNote:
    "Tested: graphos's tests check that every tool is a read with a fixed description, that the token that opens the API opens /mcp and nothing else does, and that an agent reads a granted tenant with every call audited; sign-on through Keycloak 26 was tried with the MCP Python SDK's client. No example script and no benchmark. The question and the saved query drawn are examples.",
};
