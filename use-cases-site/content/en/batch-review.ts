import type { UseCaseText } from "../types";

export const batchReview: UseCaseText = {
  title: "A batch reviewed before it is published",
  situation: "Each batch should be matched, looked at by a person, and only then published, with every step of it on the record.",
  team: "Regulated back offices",
  context:
    "For a team whose batches, such as statements or reports, must not go out unseen. A flow that matches and publishes in one go leaves no room for a person, and following one batch across its runs means searching logs by hand.",
  metricLabels: {
    review: "Before publication",
    follow: "Following one batch",
    replay: "A run done again",
  },
  steps: [
    {
      tag: "problem",
      title: "Published unseen",
      body: ["The flow matches the batch and publishes it straight away. Nobody looks, and nothing ties the batch's steps together."],
      metrics: { review: "nobody looks", follow: "by hand, in the logs", replay: "—" },
    },
    {
      tag: "syrmos",
      title: "A key from the start",
      body: [
        "The system that starts the batch gives it a run key of its own. Every run the batch causes carries that key.",
        "The batch arrives through the connector bridge into the cell's intake, and the match runs.",
      ],
    },
    {
      tag: "syrmos",
      title: "It waits for a person",
      body: ["Between matching and publishing, the run stops at a review step and waits for as long as it takes."],
      metrics: { review: "a person" },
    },
    {
      tag: "how",
      title: "Approved, then published",
      body: ["The reviewer approves it, the run continues, and the batch is published. Who approved it is on the record."],
    },
    {
      tag: "syrmos",
      title: "One batch, linked runs",
      body: ["The batch's runs, from intake to publication, are linked under its key. So the whole batch can be followed from its key."],
      metrics: { follow: "linked runs under its key" },
    },
    {
      tag: "how",
      title: "Replayed, on the record",
      body: [
        "A run can be done again from the intake message it started from. The new run names the one it replays and stays under the batch's key.",
        "The replay is in the audit log, with who did it.",
      ],
      metrics: { replay: "replayed, on the record" },
    },
  ],
  parts: {
    review: "Stops the run until a person approves the batch.",
    tracing: "Links the batch's runs under its key, and replays one.",
    audit: "Records the approval and the replay, with who did each.",
    bus: "Holds the batch on the intake until its run closes.",
  },
  tryIt: {
    text: "The trial's script runs it against a NATS server in Docker and a real cell. The trials list says how to run it.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/trials/README.md",
    linkText: "Read the trials",
  },
  statusNote:
    "Shown: a trial (15 checks, passed on 2026-10-24 against a NATS server in Docker and a real cell) follows one batch from intake to publication as linked runs under its key, with the review and who did it on record. Since 2026-10-26 it also replays the match run through the API. The batch drawn is an example.",
};
