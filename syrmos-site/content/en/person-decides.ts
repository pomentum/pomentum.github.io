import type { UseCaseText } from "../types";

// Built from the old walkthroughs orders-review and batch-review.
export const personDecides: UseCaseText = {
  title: "Let a person decide where it matters",
  situation: "Most work can go straight through. What about the cases where someone should look first?",
  caveat: "The batch review is shown in a trial; the orders part is a target.",
  team: "Teams reviewing orders or batches",
  context:
    "For a back office that takes orders, or a team whose batches, such as statements or reports, must not go out unseen. Without a review inside the run, an automation accepts everything or sends everything to an inbox, and nothing records who decided.",
  metricLabels: {
    waiting: "Orders waiting for a person",
    decided: "Who decided",
    batch: "Before a batch is published",
  },
  steps: [
    {
      tag: "problem",
      title: "Every order by hand, or none",
      body: [
        "The automation can't stop and wait. So it accepts every order, or mails every order to someone who checks it by hand.",
        "Either way, the decision lives in an inbox, not on the record.",
      ],
      metrics: { waiting: "all, or none", decided: "an inbox", batch: "nobody looks" },
    },
    {
      tag: "syrmos",
      title: "Small orders go through",
      body: ["With Syrmos, each order is scored first. A small, ordinary order is accepted at once, and the run answers and closes. Nobody had to look."],
    },
    {
      tag: "syrmos",
      title: "Large orders wait for a person",
      body: [
        "A large or complex order goes to a review. The run stops there and waits, for as long as it takes.",
        "The review shows in Syrmos, and a short notice with a link can reach the team's chat room.",
      ],
      metrics: { waiting: "only the large ones" },
    },
    {
      tag: "syrmos",
      title: "The decision continues the run",
      body: ["A person approves or rejects the order. The run picks up where it stopped and sends the answer. Who decided, and when, is on the record."],
      metrics: { decided: "on the record" },
    },
    {
      tag: "syrmos",
      title: "A batch waits for a person too",
      body: ["The same holds for a batch, such as a set of statements: between matching and publishing, the run stops at a review and waits."],
      metrics: { batch: "a person" },
    },
    {
      tag: "how",
      title: "Approved, then published",
      body: ["The reviewer approves it, the run continues, and the batch is published. Who approved it is on the record."],
    },
    {
      tag: "how",
      title: "Done again, on the record",
      body: [
        "A run can be done again from the message it started from. The new run names the one it repeats and stays with the batch's other runs, and who did it is on the record.",
      ],
    },
  ],
  parts: {
    review: "Stops the run until a person decides on an order or approves a batch; the decision continues it.",
    tracing: "Records each run step by step, the wait included, and links a batch's runs together.",
    audit: "Records who decided on each order, who approved each batch and who did a run again.",
  },
  tryIt: {
    text: "The development setup's demo tenant has an order automation in a test copy, without a review: add one there. The trials list says how to run the batch trial.",
  },
  statusNote:
    "Shown: a trial against a real bus and cell (15 checks, passed on 2026-10-24) follows one batch from intake to publication as linked runs, with the review and who approved it on the record; since 2026-10-26 it also does a run again through the API. Target: the demo order automation, received, scored and traced, is in the Syrmos screenshots, and a review that pauses a run until a person decides is shown in the trials, but an order automation that sends large orders to a review has not been shown end to end. What counts as large is the team's own rule.",
};
