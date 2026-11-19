import type { UseCaseText } from "../types";

export const coldRoom: UseCaseText = {
  title: "Cold room monitoring",
  situation: "Fridge sensors report over MQTT. When a fridge warms up, someone on call has to know.",
  team: "Food storage · operations",
  context:
    "For a team that keeps fridges cold and already wires their sensors together in Node-RED. Without Syrmos, the alert flow shares one runtime with everything else, the chat token sits inside a node, and anyone can change the threshold in production without a second look.",
  metricLabels: {
    alert: "Alert reached someone",
    secrets: "Secrets in the flow",
    review: "Changes without review",
    version: "Version in prod",
  },
  steps: [
    {
      tag: "problem",
      title: "One Node-RED for everything",
      body: [
        "Every team's flows run in one Node-RED. One runtime is one trust domain: anyone who can deploy can run anything, and can read what the others hold.",
        "The chat token that sends the alert is typed into a node. It travels with every export and every backup of the flow.",
      ],
      metrics: { alert: "—", secrets: "1", review: "possible", version: "whatever is there" },
    },
    {
      tag: "syrmos",
      title: "A cell for the tenant",
      body: [
        "The cold room pipeline runs in a cell of its own: unmodified Node-RED in a container and on a network of its own, belonging to one tenant.",
        "This cell is protected. Nobody edits it; it changes only by promotion or rollback. A secret typed into a node is refused at deploy.",
      ],
      metrics: { secrets: "0", review: "refused", version: "v1" },
    },
    {
      tag: "how",
      title: "Readings arrive",
      body: [
        "The fridges publish their readings to an MQTT broker. The cell has no MQTT node of its own: the connector bridge carries the broker's messages onto the bus, into the pipeline's durable intake.",
        "A reading is acknowledged only when its run closes. If the cell restarts, nothing is lost.",
      ],
    },
    {
      tag: "how",
      title: "A fridge warms up",
      body: [
        "One reading comes in above the threshold. The pipeline's check, \"warmer than 5 °C?\", says yes, and the run goes on to the alert.",
        "Every other reading is counted and passes quietly.",
      ],
      metrics: { alert: "not yet" },
    },
    {
      tag: "syrmos",
      title: "Alert without a secret",
      body: [
        "The pipeline calls its chat connection by name. The credential gateway knows the cell by its token, adds the secret from OpenBao on the way out, and the message reaches the on-call.",
        "The token never enters the cell, the flow or a log.",
      ],
      metrics: { alert: "yes" },
    },
    {
      tag: "how",
      title: "Every step traced",
      body: [
        "The run is traced step by step: the reading in, the check, the alert, each with its place on a timeline and its time.",
        "Open the warm reading's run later and see exactly what happened, and which version of the pipeline ran.",
      ],
    },
    {
      tag: "syrmos",
      title: "Change the threshold safely",
      body: [
        "You lower the threshold to 4 °C in the open cell. It is kept as a draft, checked, and deployed there as a new version, and readings run through it.",
        "A promotion into the protected cell asks for a review; another person approves it, and only then does prod take version 2. A direct edit of prod is refused.",
      ],
      metrics: { review: "refused", version: "v2" },
    },
    {
      tag: "syrmos",
      title: "Roll back in one step",
      body: [
        "If the new threshold misfires, roll prod back to a version it ran before. Every deploy is an immutable version, so the old one is still there.",
        "The rollback, like the promotion, is on the record.",
      ],
      metrics: { version: "v1 again" },
    },
  ],
  parts: {
    bridge: "Carries the fridges' MQTT messages into the pipeline's intake; the cell has no broker node.",
    "protected-cell": "Prod runs here; it changes only by promotion or rollback.",
    gateway: "Adds the chat secret on the way out, so no token is in the cell.",
    tracing: "Every run traced step by step, with the version that ran.",
    promotion: "The new threshold reaches prod after its runs and a reviewer's approval; a rollback returns the version before.",
  },
  tryIt: {
    text: "The recorded demo plays under the walkthrough, in See it in Syrmos. The development stack seeds the demo tenant and its cells, but not the cold room pipeline itself, so build it in an open cell.",
  },
  statusNote:
    "Shown: the recorded demo in the Syrmos README takes the demo tenant's cold room pipeline from fridge readings over MQTT, through a threshold change kept as a draft, a deploy as a new version and a warm reading's run traced, to a promotion into the protected prod cell waiting for another person's review. Not in the recorded demo: how the alert reaches the on-call, drawn here as a chat message through the credential gateway, and the rollback.",
};
