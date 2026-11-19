import type { UseCaseText } from "../types";

export const deadLetters: UseCaseText = {
  title: "A failed batch, fixed and sent again",
  situation: "A batch that fails should be kept, not lost or retried for ever, and sent again once the pipeline is fixed.",
  team: "Operations teams",
  context:
    "For a team whose pipelines take work that sometimes arrives wrong. In a plain flow a failed message lives in memory: it is lost on a restart, or retried again and again though no retry can change the outcome.",
  metricLabels: {
    batch: "The failed batch",
    retries: "Retries that can't help",
    version: "Sent again, it runs on",
  },
  steps: [
    {
      tag: "problem",
      title: "Lost, or tried for ever",
      body: ["A batch with a mistake in it fails. Held in memory, it is gone after a restart, or it is retried until something gives up."],
      metrics: { batch: "lost or stuck", retries: "until it gives up", version: "—" },
    },
    {
      tag: "how",
      title: "A batch with no total",
      body: ["A strict stage checks each batch's total. This one has none, so the check fails: an error that no later attempt can change."],
    },
    {
      tag: "syrmos",
      title: "Kept as a dead letter, at once",
      body: [
        "Syrmos retries by the kind of error. An error that can't change is not retried in vain: the batch becomes a dead letter on its first attempt.",
        "It is listed with its source, its attempt and the error.",
      ],
      metrics: { batch: "kept as a dead letter", retries: "none" },
    },
    {
      tag: "how",
      title: "The fix, deployed",
      body: ["The pipeline is fixed and deployed as a new version, and the cell applies it."],
    },
    {
      tag: "syrmos",
      title: "Offered again",
      body: [
        "A person offers the dead letter again. The batch runs on the fixed version and is published.",
      ],
      metrics: { batch: "sent again, published", version: "the fixed version" },
    },
    {
      tag: "how",
      title: "On the record",
      body: ["The audit log records that the dead letter was offered again, and who did it."],
    },
  ],
  parts: {
    bus: "Keeps the batch until its run closes, and the dead letter after.",
    tracing: "Lists the dead letter with its source, attempt and error.",
    audit: "Records who offered it again.",
    cell: "Takes the fixed version before the batch runs again.",
  },
  tryIt: {
    text: "The trial's script runs it against a NATS server in Docker and a real cell. The trials list says how to run it.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/trials/README.md",
    linkText: "Read the trials",
  },
  statusNote:
    "Shown: the reviewed batch publication trial (23 checks, passed on 2026-10-26 against a NATS server in Docker and a real cell) fails a batch with no total in a strict stage, lists the dead letter, deploys the fix through the API, offers the batch again, and sees it succeed on the fixed version, with the replay in the audit log.",
};
