import type { UseCaseText } from "../types";

export const mcpTool: UseCaseText = {
  title: "A tool from an outside MCP server",
  situation: "A pipeline should use a tool that another service publishes over MCP, only the tool a person allowed, and only as they accepted it.",
  team: "AI and integration teams",
  context:
    "For a team whose ticket desk, or another service, publishes its actions as MCP tools. Called from a flow, the server's token sits in a node, every tool it offers is in reach, and a tool can change what it does behind the same name.",
  metricLabels: {
    tools: "Tools a pipeline can call",
    changed: "A tool changed behind its name",
    token: "The server's token",
  },
  steps: [
    {
      tag: "problem",
      title: "Every tool, the token in the flow",
      body: ["The flow calls the server with its token in a node. It can call any tool the server offers, and nobody chose which."],
      metrics: { tools: "all of them", changed: "used as it is", token: "in the flow" },
    },
    {
      tag: "syrmos",
      title: "Bound, and one tool allowed",
      body: [
        "A person binds the server to a cell as a connection. They see each tool it offers, with its description and its schemas, and allow the one the pipeline needs.",
      ],
      metrics: { tools: "the one a person allowed", token: "at the gateway" },
    },
    {
      tag: "how",
      title: "A question, the allowed tool",
      body: [
        "Questions arrive in the cell's intake. The pipeline calls the allowed tool with the `syrmos mcp` node, through the credential gateway, and the answer's structured content goes on as the message.",
        "The server's token stays in the gateway's secret store. It never reaches the cell, the pipeline or a log.",
      ],
    },
    {
      tag: "syrmos",
      title: "A tool nobody allowed",
      body: ["A call to a tool nobody allowed is refused, and the tool never runs."],
    },
    {
      tag: "syrmos",
      title: "Changed behind its name",
      body: [
        "The server changes the allowed tool's definition but keeps its name. Calls to it are refused from then on.",
      ],
      metrics: { changed: "refused until accepted again" },
    },
    {
      tag: "how",
      title: "Seen, and accepted again",
      body: ["The person sees the change beside what they accepted before. Once they accept it, the calls go through again."],
    },
  ],
  parts: {
    gateway: "Holds the server's token, and calls only the tool as it was accepted.",
    cell: "Calls the tool by connection name, with no token in its flows.",
  },
  tryIt: {
    text: "The trial's script runs it against a throwaway MCP server and a real cell. The trials list says how to run it.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/trials/README.md",
    linkText: "Read the trials",
  },
  statusNote:
    "Shown: a trial (13 checks, passed on 2026-10-30) runs a throwaway MCP server built with the official SDK, the gateway and a real cell. Not shown yet: a public MCP server, and OAuth against a real authorisation server. The tool names drawn are examples.",
};
