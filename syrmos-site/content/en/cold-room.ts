import type { UseCaseText } from "../types";

// The tour: the one story that touches every promise. Written for a reader who has never heard of Node-RED or a tenant; each
// fact is the walkthrough's own, from the recorded demo in the Syrmos README (see the status note).
export const coldRoom: UseCaseText = {
  title: "Cold room alerts you can rely on",
  situation: "Fridges report their temperatures. When one warms up, the person on call has to know.",
  team: "Food storage · operations",
  context:
    "A team keeps fridges cold and already wires their sensors together in Node-RED. Today the alert runs in one Node-RED with everyone else's automations, the chat password sits inside it, and anyone can change the alert's limit in production without a second look.",
  metricLabels: {
    alert: "The on-call was told",
    secrets: "Passwords in the automation",
    review: "Changes nobody checked",
    version: "Version live",
  },
  steps: [
    {
      tag: "problem",
      title: "Today: one Node-RED for everyone",
      body: [
        "Every team's automations run together. Anyone who can change one can run anything, and read what the others hold.",
        "The chat password is typed into the automation, so it travels with every copy of it.",
      ],
      metrics: { alert: "—", secrets: "1", review: "possible", version: "whatever is there" },
    },
    {
      tag: "syrmos",
      title: "A sealed space of its own",
      body: [
        "With Syrmos, the cold room automation runs in a cell: its own Node-RED, unmodified, on a network of its own.",
        "This is the live copy. Nobody edits it by hand, and a password typed into it is refused.",
      ],
      metrics: { secrets: "0", review: "refused", version: "v1" },
    },
    {
      tag: "how",
      title: "Readings come in",
      body: [
        "The fridges send their readings over MQTT. Syrmos brings them in and keeps each one until it has been handled, so a restart loses nothing.",
      ],
    },
    {
      tag: "how",
      title: "A fridge warms up",
      body: ["One reading is above 5 °C. The automation's check says yes, and it goes on to the alert. Every other reading passes quietly."],
      metrics: { alert: "not yet" },
    },
    {
      tag: "syrmos",
      title: "The on-call is told, with no password inside",
      body: [
        "The automation asks for its chat connection by name. Syrmos adds the password as the message leaves, so it never appears in the automation or a log.",
      ],
      metrics: { alert: "yes" },
    },
    {
      tag: "how",
      title: "You can see what happened",
      body: ["Open the warm reading later and see each step it took, how long each took, and which version ran."],
    },
    {
      tag: "syrmos",
      title: "Changing the limit, safely",
      body: [
        "You lower the limit to 4 °C in the test copy, where it becomes version 2 and readings run through it.",
        "The live copy takes it only after another person approves. Editing the live copy directly is refused.",
      ],
      metrics: { review: "refused", version: "v2" },
    },
    {
      tag: "syrmos",
      title: "Going back in one step",
      body: ["If the new limit misfires, put the live copy back to the version before. Every version is kept, and the step back is on the record."],
      metrics: { version: "v1 again" },
    },
  ],
  parts: {
    bridge: "Brings the fridges' MQTT readings in; the automation has no broker connection of its own.",
    "protected-cell": "The live copy runs here; it changes only by a promotion or a step back.",
    gateway: "Adds the chat password as the message leaves, so it isn't in the automation.",
    tracing: "Every run recorded step by step, with the version that ran.",
    promotion: "The new limit reaches the live copy after a person approves; a step back returns the version before.",
  },
  tryIt: {
    text: "The recorded demo plays under the walkthrough, in See it in Syrmos. The development setup includes a demo tenant and its cells, but not this automation itself: build it in a test copy.",
  },
  statusNote:
    "Shown: the recorded demo in the Syrmos README takes the demo tenant's cold room automation from fridge readings over MQTT, through a limit changed as a draft, deployed as a new version and a warm reading's run traced, to a promotion into the live copy waiting for another person's review. Not in the recorded demo: how the alert reaches the on-call, drawn here as a chat message, and the step back.",
};
