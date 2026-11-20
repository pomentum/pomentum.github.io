import type { UseCaseText } from "../types";

// Built from outside-agent, assistant-drafts, mcp-tool and rag-ingestion.
export const aiHelps: UseCaseText = {
  title: "Let AI help, with no more rights than you",
  situation: "If AI drafts automations, fixes them, or is used inside them, what can it actually do?",
  caveat: "Shown in trials, except the assistant's drafts, which are built but not yet shown.",
  team: "Teams letting AI help",
  context:
    "AI isn't what Syrmos exists for; Syrmos puts AI under the same rules as people. An agent acts as the person who allowed it, asks before changing the live copy, and calls only the tools a person chose.",
  metricLabels: {
    actsAs: "Your AI agent acts as",
    production: "Its changes to production",
    tools: "AI tools an automation can call",
  },
  steps: [
    {
      tag: "problem",
      title: "Today: an agent with an admin key",
      body: [
        "Your AI agent holds a key that can do anything: read everyone's automations, change the live copy, approve its own change.",
        "And an automation that calls an AI tool can call any tool the service offers.",
      ],
      metrics: { actsAs: "an admin key", production: "possible", tools: "all of them" },
    },
    {
      tag: "syrmos",
      title: "The assistant drafts; you decide",
      body: [
        "Syrmos's own assistant is held the same way: it drafts an automation from your description and checks it. When you confirm, it is saved as a draft in the test copy; deploying it stays your step.",
      ],
    },
    {
      tag: "syrmos",
      title: "Your agent fixes the test copy",
      body: [
        "Your own agent connects through Syrmos's MCP server and acts as you, never as more. If the owner lets agents write, it writes a fix into the test copy after a dry run.",
      ],
      metrics: { actsAs: "the person who allowed it" },
    },
    {
      tag: "syrmos",
      title: "It asks; a person decides",
      body: [
        "It asks to promote the fix. A person approves or rejects it in Syrmos; the agent deploys and approves nothing.",
      ],
    },
    {
      tag: "syrmos",
      title: "Never more than you",
      body: [
        "Its writes to the live copy are refused, and so is anything beyond what you allowed. Revoke it, and it is refused from its next renewal.",
      ],
      metrics: { production: "refused" },
    },
    {
      tag: "syrmos",
      title: "Only the tool a person allowed",
      body: [
        "The same holds when an automation calls an AI tool: a person sees each tool a service offers and allows the one needed. Syrmos adds the password on the way out.",
      ],
      metrics: { tools: "the one a person allowed" },
    },
    {
      tag: "syrmos",
      title: "A tool changed behind its name",
      body: ["If the service changes that tool but keeps its name, calls to it are refused until the person sees the change and accepts it again."],
    },
    {
      tag: "syrmos",
      title: "No way past the scan",
      body: [
        "When an automation feeds documents to a search index or a model, a rule can make a scan a step no path may skip. A copy without it is refused at deploy.",
      ],
    },
  ],
  parts: {
    mcp: "Your agent's way in, as the person who allowed it.",
    assistant: "Drafts and checks an automation; saves it only when you confirm.",
    gateway: "Calls only the tool a person allowed, and adds its password on the way out.",
    promotion: "The agent asks; a person decides.",
  },
  tryIt: {
    text: "Turn on the MCP server, connect your own MCP client and sign in. The trials are in the repository.",
  },
  statusNote:
    "Shown in trials, against Syrmos's core in the trial's own process: an outside agent signing in with an official MCP client, reading runs and asking to promote in the person's name (20 checks, passed twice on 2026-10-30); an agent fixing a test copy with a dry run first and asking to promote it (14 checks; the fix is not loaded into a running cell); one allowed tool called on a throwaway MCP server through the gateway and a real cell (13 checks, 2026-10-30); a copy without the scan refused at deploy (17 checks, 2026-10-24, the services being stand-ins). Not shown: a public MCP server. Target: the assistant's drafts, built but not shown end to end, nor with a hosted model.",
};
