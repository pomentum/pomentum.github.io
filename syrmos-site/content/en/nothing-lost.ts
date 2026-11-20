import type { UseCaseText } from "../types";

// Built from the old walkthroughs dead-letters (steps 0 to 4) and polled-database (steps 4, 5).
export const nothingLost: UseCaseText = {
  title: "Don't lose work when something fails",
  situation: "When something fails halfway, or a machine restarts, is the work lost, stuck, or done twice?",
  caveat: "Part shown, part a target: the failed batch is shown; the database rows are a target.",
  team: "Teams moving batches and records",
  context:
    "For a team whose automations take work that sometimes arrives wrong. In a plain automation, work in progress lives in memory: lost on a restart, or retried though no retry can change the outcome.",
  metricLabels: {
    batch: "A batch that fails",
    retries: "Retries that can't help",
    restart: "Rows lost on a restart",
  },
  steps: [
    {
      tag: "problem",
      title: "Lost, or tried for ever",
      body: ["A batch with a mistake in it fails. Held only in memory, it is gone after a restart, or it is tried again until something gives up."],
      metrics: { batch: "lost or stuck", retries: "until it gives up", restart: "possible" },
    },
    {
      tag: "how",
      title: "A batch with no total",
      body: [
        "With Syrmos, the batch comes in from the system upstream. A strict step checks each batch's total. This one has none, so it fails, and no second try can change that.",
      ],
    },
    {
      tag: "syrmos",
      title: "Kept aside, at once",
      body: [
        "Syrmos retries by the kind of error. This one can't change, so the batch is set aside on its first attempt, listed with where it came from, the attempt and the error.",
      ],
      metrics: { batch: "kept aside", retries: "none" },
    },
    {
      tag: "how",
      title: "The fix, deployed",
      body: ["The automation is fixed and deployed as a new version, v2, and the cell takes it."],
    },
    {
      tag: "syrmos",
      title: "Sent again",
      body: ["A person sends the kept batch again. It runs on the fixed version and is published."],
      metrics: { batch: "sent again, published" },
    },
    {
      tag: "syrmos",
      title: "The same for rows from a database",
      body: [
        "The same holds for rows read from a database. A row the automation can't handle is tried again as set, then kept aside with its source, attempt and error, to send again once fixed.",
      ],
    },
    {
      tag: "syrmos",
      title: "A restart loses nothing",
      body: [
        "If the cell is stopped mid-run, the rows it had not finished are still waiting on the bus. When it starts again, it picks up where it left off.",
      ],
      metrics: { restart: "none" },
    },
  ],
  parts: {
    bus: "Keeps each batch and row until its run finishes, and what is set aside after.",
    tracing: "Lists what was set aside, with its source, attempt and error, ready to send again.",
    bridge: "Brings the batches in, and reads new rows from the database after a bookmark the bus keeps.",
  },
  tryIt: {
    text: "The failed batch runs as a trial against a real bus and a real cell; the trials list says how. For rows from a database, build the automation in a test copy.",
  },
  statusNote:
    "Shown: a trial against a real bus and cell (23 checks, passed on 2026-10-26) fails a batch with no total, lists it as set aside, deploys the fix, sends the batch again and sees it published on the fixed version, with the resend on the record. Target: reading a database's new rows is built and tested through a real bus, and a trial shows a stopped cell losing nothing, with records from message brokers. An automation from a database to files has not been shown end to end.",
};
