import type { UseCaseText } from "../types";

export const outsideAgent: UseCaseText = {
  title: "An outside agent through MCP",
  situation: "Your own agent should read runs, fix a pipeline and ask to promote it, with your rights and no more.",
  team: "Engineering teams",
  context:
    "For a team that works with an AI agent in its own client. Without Syrmos, the agent gets an API key with an administrator's rights: it can change production directly, and the log says only that the key did it.",
  metricLabels: {
    actsAs: "The agent acts as",
    protected: "Writes to a protected cell",
    audit: "In the audit log",
  },
  steps: [
    {
      tag: "problem",
      title: "An agent with an admin key",
      body: [
        "The agent holds a key that can do anything, anywhere: read every tenant, deploy into production, approve its own change.",
        "Nobody chose what it may do, and nothing records on whose behalf it acted.",
      ],
      metrics: { actsAs: "an admin key", protected: "possible", audit: "the key" },
    },
    {
      tag: "syrmos",
      title: "A person connects it",
      body: [
        "The control plane is an MCP server. You connect your MCP client to it, sign in through Syrmos's own sign-in, and consent to the scopes the agent may use.",
        "From then on the agent acts as you, never as more. A tenant whose owner did not allow agents is not even seen.",
      ],
      metrics: { actsAs: "the person who allowed it" },
    },
    {
      tag: "how",
      title: "It reads, as you",
      body: [
        "The agent lists the tenant's pipelines and runs, and reads a failed run with its steps to explain what went wrong.",
      ],
    },
    {
      tag: "syrmos",
      title: "It fixes the open cell",
      body: [
        "Where the tenant's owner lets agents write, the agent writes the fix into the open cell, with a dry run first.",
        "It never overwrites a newer edit, and in a tenant whose owner lets agents read only, it writes nothing.",
      ],
    },
    {
      tag: "syrmos",
      title: "It asks; a person decides",
      body: [
        "The agent files a promotion request from the open cell into the protected one. It appears among the tenant's promotion requests, and a person approves or rejects it in the Syrmos UI.",
        "Nothing the agent does deploys, approves, revokes or removes anything.",
      ],
    },
    {
      tag: "syrmos",
      title: "Never more than the person",
      body: [
        "The agent never writes a protected cell. A token without the scope is refused, a token issued for another audience is refused, and once you revoke the client, its token is refused from its next renewal on.",
      ],
      metrics: { protected: "refused" },
    },
    {
      tag: "how",
      title: "On the record",
      body: ["The promotion request is in the audit log, naming the person and the client that acted for them."],
      metrics: { audit: "the person and the client" },
    },
  ],
  parts: {
    mcp: "The agent's way in: as the person who allowed it, with the scopes they chose.",
    cell: "The open cell, where an agent may write when the owner allows it.",
    "protected-cell": "Never written by an agent.",
    promotion: "The agent files the request; a person decides it.",
    audit: "Records the person and the client.",
  },
  tryIt: {
    text: "Turn on the MCP server, connect your own MCP client, and sign in. The trials that show this are in the repository.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/trials/README.md",
    linkText: "Read the trials",
  },
  statusNote:
    "Shown: a trial (20 checks, passed twice on 2026-10-30) has an outside agent with the official MCP client sign in through its own OAuth flow, read pipelines and a failed run, and file a promotion request in the person's name, with the refusals; another (14 checks) has an agent fix a pipeline in an open cell with a dry run first and ask to promote it. Both run against a core in the script's process. In the second trial the agent's fix is not reloaded into a running cell; the promotion trial shows a running cell taking a promoted version.",
};
