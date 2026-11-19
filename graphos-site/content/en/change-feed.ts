import type { UseCaseText } from "../types";

export const changeFeed: UseCaseText = {
  title: "Follow every change",
  situation: "A search index, a cache or another service should learn what changed in the graph, and never miss a write.",
  team: "Integration teams",
  context:
    "For a team that keeps something in step with the graph: a search index, a cache, a report. Reading everything again is slow, and a plain counter of changes can skip a write that committed late: with 99 uncommitted and 100 committed, a reader at 100 would never see 99.",
  metricLabels: {
    skip: "A committed change skipped",
    cost: "Added to a write",
    kept: "Changes kept for",
  },
  steps: [
    {
      tag: "problem",
      title: "Read it all again",
      body: ["The search index has no way to ask what changed, so it reads the whole graph again, or keeps a counter that can step past a change committed late."],
      metrics: { skip: "possible", cost: "—", kept: "—" },
    },
    {
      tag: "product",
      title: "Recorded in the same transaction",
      body: [
        "graphos records every write in the same transaction that makes it: a write that fails or rolls back leaves no record.",
        "A record says what changed, not the values: its cursor, the operation, the kind and label, the ids, the revision, and who wrote it.",
      ],
    },
    {
      tag: "how",
      title: "Start from the head",
      body: ["To sync from scratch, the index takes the head (`GET …/changes/head`), reads the data, then follows the changes from that head on."],
    },
    {
      tag: "how",
      title: "Read after a cursor",
      body: [
        "`GET …/changes?after=` answers up to 1,000 records, the next cursor, and whether there are more.",
        "The feed never skips a committed change. It delivers at least once, so a record can arrive twice.",
      ],
      metrics: { skip: "never" },
    },
    {
      tag: "product",
      title: "Or follow it live",
      body: [
        "`GET …/changes/stream` sends each change as a Server-Sent Event, resumable with `Last-Event-ID`, and a keep-alive every 15 seconds. The Python client has `stream_changes()`.",
      ],
    },
    {
      tag: "how",
      title: "What it costs",
      body: [
        "Measured on the development setup (PostgreSQL in Docker Desktop, 1.2 ms a round trip): +1.8 ms on a single write, 0–14 % on 500-row bulk batches.",
        "Changes are kept 7 days by default; a cursor older than that is answered 410, so the reader syncs again from the head.",
      ],
      metrics: { cost: "+1.8 ms on a single write", kept: "7 days, by default" },
    },
  ],
  parts: {
    changes: "Records every write in its own transaction.",
    writes: "Every write path feeds it, bulk loads and reconciles included.",
    client: "Reads or streams the feed from Python.",
  },
  tryIt: {
    text: "The usage guide's change-feed section shows the cursor, the stream and syncing from scratch.",
    href: "https://github.com/pomentum/graphos/blob/main/docs/guide/usage.md",
    linkText: "Read the usage guide",
  },
  statusNote:
    "Measured, in graphos's concept guide on its development setup: +1.8 ms on a single write and 0–14 % on 500-row bulk batches. Tests check that a late commit is never skipped and the stream, and a soak test ran for over half an hour. The index and the cursors drawn are examples.",
};
