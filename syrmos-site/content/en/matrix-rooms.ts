import type { UseCaseText } from "../types";

export const matrixRooms: UseCaseText = {
  title: "A chat room that starts pipelines",
  situation: "A message in the team's room should start a pipeline, and the answer and any review it needs should come back to the same room.",
  team: "Operations and DevOps teams",
  context:
    "For a team that works in a self-hosted Matrix room. A chat bot in a flow keeps its token in a node, answers twice when a message arrives twice, and posts wherever it is told.",
  metricLabels: {
    token: "The bot's token",
    twice: "A message sent twice",
    encrypted: "An encrypted room",
  },
  steps: [
    {
      tag: "problem",
      title: "A bot with its token in the flow",
      body: ["The bot reads the room and posts back with a token stored in a node. Anyone who reads the flows reads the token."],
      metrics: { token: "in the flow", twice: "two runs", encrypted: "—" },
    },
    {
      tag: "syrmos",
      title: "The room's server lets Syrmos in",
      body: ["The homeserver's administrator installs the registration Syrmos gives. From then on, messages in the bound rooms reach the cell's connector bridge."],
    },
    {
      tag: "how",
      title: "A message starts a pipeline",
      body: [
        "A person's message in the room goes into the cell's intake and starts a pipeline, like any other source.",
        "A message the server sends twice is held once, and a notice is never answered.",
      ],
      metrics: { twice: "held once" },
    },
    {
      tag: "syrmos",
      title: "The answer, through the gateway",
      body: [
        "The pipeline answers in the room through the credential gateway, which holds the sender's token. Done again, the same post is answered with the same message, not a second one.",
        "No token is in the flow, a log line or a trace.",
      ],
      metrics: { token: "held by the gateway" },
    },
    {
      tag: "how",
      title: "A review, noticed in the room",
      body: ["When the pipeline asks for a review, the room gets one notice: a line and a link to the Reviews page."],
    },
    {
      tag: "syrmos",
      title: "Encrypted rooms refused",
      body: [
        "An encrypted room, a room the sender isn't in, and a room the connection wasn't bound with are refused before anything is sent, and Syrmos says why.",
      ],
      metrics: { encrypted: "refused, with the reason" },
    },
  ],
  parts: {
    bridge: "Takes the room's messages into the intake, and posts the review notices.",
    gateway: "Posts the answer with the sender's token, which the cell never holds.",
    review: "Its notice reaches the room once, with a link.",
    bus: "Holds a message sent twice once.",
  },
  tryIt: {
    text: "The trial's script runs it against a throwaway Matrix homeserver in Docker and a real cell. The trials list says how to run it.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/trials/README.md",
    linkText: "Read the trials",
  },
  statusNote:
    "Shown: a trial against a throwaway Conduit homeserver in Docker, run on 2026-10-29 and again on 2026-11-01: posting to rooms (11 checks), a room starting a pipeline in a real cell (8 checks) and review notices (11 checks). Alerts over failed runs wait for their rules. The room and its message drawn are examples.",
};
