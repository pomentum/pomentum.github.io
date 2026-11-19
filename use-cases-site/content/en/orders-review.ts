import type { UseCaseText } from "../types";

export const ordersReview: UseCaseText = {
  title: "Orders that need a person",
  situation: "Most orders can be accepted at once. The large or complex ones need someone to look first.",
  team: "Back office",
  context:
    "For a back office that takes orders from a shop or a partner. Without a review step inside the run, a flow either accepts everything, or sends every order to someone's inbox, and nothing records who decided what.",
  metricLabels: {
    waiting: "Orders waiting for a person",
    run: "This run",
    decided: "Who decided",
  },
  steps: [
    {
      tag: "problem",
      title: "Every order by hand, or none",
      body: [
        "The flow can't stop and wait, so it does one of two things: accept every order, or mail every order to someone who checks it by hand.",
        "Either way, the decision lives in an inbox, not on the record.",
      ],
      metrics: { waiting: "all, or none", run: "—", decided: "an inbox" },
    },
    {
      tag: "how",
      title: "Received and normalised",
      body: [
        "An order arrives as a webhook through the connector bridge and waits in the pipeline's durable intake. It is acknowledged only when its run closes.",
        "The first step turns each sender's shape into one shape the rest of the pipeline expects.",
      ],
      metrics: { waiting: "—", run: "running", decided: "—" },
    },
    {
      tag: "how",
      title: "Scored",
      body: [
        "The step that scores the order is the tenant's own JavaScript, run by `syrmos function` in a WebAssembly sandbox, within limits of time and memory.",
        "Node-RED's Function node stays off in a governed cell.",
      ],
    },
    {
      tag: "syrmos",
      title: "Small orders go through",
      body: ["A small, ordinary order is accepted at once, and the run answers and closes. Nobody had to look at it."],
      metrics: { waiting: "none", run: "done" },
    },
    {
      tag: "syrmos",
      title: "Large orders wait for a person",
      body: [
        "A large or complex order goes to a review step. The run stops there and waits, for as long as it takes.",
        "The review shows in the Syrmos UI, and a notice, a line and a link, can reach the team's chat room.",
      ],
      metrics: { waiting: "only the large ones", run: "waiting for a person" },
    },
    {
      tag: "syrmos",
      title: "The decision continues the run",
      body: [
        "A person approves or rejects the order. The decision resumes the run where it stopped, and it goes on to the answer.",
        "Who decided, and when, is on the record.",
      ],
      metrics: { run: "done", decided: "on the record" },
    },
    {
      tag: "how",
      title: "The whole run, traced",
      body: [
        "Open the run: each step with its node, its place on a timeline and its time, from the order received to the answer, including the wait for the reviewer.",
      ],
    },
  ],
  parts: {
    bridge: "Takes the order's webhook into the durable intake.",
    review: "Stops the run until a person decides; the decision continues it.",
    tracing: "The run's steps on a timeline, the wait included.",
    audit: "Who decided is recorded, chained by hash.",
    registry: "The scoring code runs in syrmos function, not Node-RED's Function node.",
  },
  tryIt: {
    text: "The development stack's demo tenant has an order pipeline in its dev cell, with the scoring step run by syrmos function.",
    href: "https://github.com/pomentum/syrmos#try-it",
    linkText: "Run the development stack",
  },
  statusNote:
    "Target: the demo order pipeline (normalised, scored by syrmos function, traced as a run of seven steps) is in the Syrmos screenshots, and a review that pauses a run and is continued by a person's decision is shown in the trials. An order pipeline that routes large orders to a review has not been shown end to end. The demo's order pipeline has no review step: the review route, and what counts as a large order, are this use case's example, a rule the tenant writes in its own pipeline.",
};
