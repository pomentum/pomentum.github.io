import type { UseCaseText } from "../types";

// Built from the old walkthroughs matrix-rooms, signed-webhooks, topic-per-pipeline, odata-connector and community-node.
export const connectServices: UseCaseText = {
  title: "Connect your services without handing out passwords",
  situation: "Automations reach chat, code hosting, an ERP, a broker. Who holds those passwords, and what stops a fake request?",
  caveat: "The chat room and broker parts are shown in trials; the GitHub, ERP and community node parts are targets.",
  team: "Teams connecting outside services",
  context:
    "Automations answer in a chat room, take webhooks from GitHub, move Jira issues and read an ERP. Each password is typed into the automation, anyone can post to its address, and a message delivered twice runs twice.",
  metricLabels: {
    password: "The chat bot's password",
    forged: "Forged requests let in",
    twice: "A message sent twice",
  },
  steps: [
    {
      tag: "problem",
      title: "A chat bot with its password inside",
      body: ["The bot reads the team's room and posts back with a password stored in the automation. Anyone who reads the automation reads the password."],
      metrics: { password: "in the flow", forged: "possible", twice: "two runs" },
    },
    {
      tag: "how",
      title: "A message starts an automation",
      body: [
        "With Syrmos, a person's message in the room comes in like any other source and starts an automation. A message the chat server sends twice is held once.",
      ],
      metrics: { twice: "handled once" },
    },
    {
      tag: "syrmos",
      title: "The answer, with no password inside",
      body: [
        "The automation answers in the room, and Syrmos adds the password on the way out. It isn't in the automation, a log or a trace.",
      ],
      metrics: { password: "held outside it" },
    },
    {
      tag: "how",
      title: "Only GitHub's own requests get in",
      body: [
        "The same holds when work comes from GitHub. Syrmos checks each webhook's signature as GitHub signs it, before anything runs; a request with a wrong signature is turned away and nothing is stored.",
      ],
      metrics: { forged: "0" },
    },
    {
      tag: "syrmos",
      title: "The Jira issue moves",
      body: [
        "A merged pull request that names an issue moves it to Done in Jira, whatever your workflow calls that move. Syrmos adds the Jira password on the way out.",
      ],
    },
    {
      tag: "how",
      title: "One broker connection, shared",
      body: [
        "A broker works the same way: automations share one connection, and each reads only its own topics within it. One reads every room; another reads room 1 alone.",
      ],
    },
    {
      tag: "syrmos",
      title: "An ERP write, with its token",
      body: [
        "For an ERP over OData, such as SAP S/4HANA, Syrmos fetches the token the service asks for in the same call as each write, adds the password, and keeps nothing afterwards. Neither reaches the automation or a log.",
      ],
    },
    {
      tag: "how",
      title: "A community node, a placeholder",
      body: [
        "A Node-RED community node for the ERP gets a placeholder, never the real password. Syrmos adds the password on the way out, and only to the connection's allowed destinations.",
      ],
    },
  ],
  parts: {
    gateway: "Adds the password on the way out, for the chat room, Jira, the ERP and a community node.",
    bridge: "Brings in chat messages, GitHub's webhooks and broker topics, checking GitHub's signature before anything runs.",
    registry: "Holds the ERP connector and the community node, each approved by a second person before use.",
  },
  tryIt: {
    text: "The chat room and broker trials run against servers in Docker; the trials list says how. Two guides cover the ERP connector and community nodes.",
  },
  statusNote:
    "Shown: a trial against a throwaway chat server in Docker, run on 2026-10-29 and again on 2026-11-01: posting to rooms (11 checks), a room starting an automation in a real cell (8 checks) and review notices (11 checks); and a broker trial (23 of 23 checks, 2026-11-19) in which a second automation on the same connection reads one room's topic alone. Target: GitHub's signature check is shown by tests, but not against the real GitHub and Jira. The ERP connector and the community node are built and tried against stand-ins, not a real ERP.",
};
