import type { UseCaseText } from "../types";

export const polledDatabase: UseCaseText = {
  title: "Polled database to files",
  situation: "New rows in a database should become files in object storage, each once, none lost.",
  team: "Data and reporting",
  context:
    "For a team that turns rows from an application's database into files other systems pick up. Without Syrmos, a script on a timer holds the database password, reads what it thinks is new, and loses its place when it crashes halfway.",
  metricLabels: {
    password: "Database password in the flow",
    lost: "Rows lost on a restart",
    failed: "A row that fails",
  },
  steps: [
    {
      tag: "problem",
      title: "A script on a timer",
      body: [
        "A script wakes every few minutes, connects with a password it keeps, reads the new rows and writes files.",
        "If it stops halfway, nothing remembers where it got to, and a row that breaks it is simply gone.",
      ],
      metrics: { password: "1", lost: "possible", failed: "lost" },
    },
    {
      tag: "how",
      title: "New rows polled into the intake",
      body: [
        "An operator binds the database as a connection, read only. The cell's connector bridge polls the table for new rows after a cursor the bus keeps, and puts each row into the pipeline's durable intake.",
        "The cell never holds the database's password.",
      ],
      metrics: { password: "0" },
    },
    {
      tag: "how",
      title: "Each row, a run",
      body: [
        "Each row starts a run, traced step by step: the row in, its result shaped, and handed on.",
        "Its intake message is acknowledged only when the run closes.",
      ],
    },
    {
      tag: "syrmos",
      title: "Written to object storage",
      body: [
        "The pipeline hands its result on to a bucket bound as a sink. The bridge writes each message handed on as one object.",
        "A hand-off waits in an outbox until its run succeeds, so a run that fails writes nothing.",
      ],
    },
    {
      tag: "syrmos",
      title: "A broken row, kept",
      body: [
        "A row the pipeline can't handle is tried again as its intake says, then kept as a dead letter, listed with its source, its attempt and the error.",
        "Deploy the fix, offer the dead letter again, and it runs on the fixed version.",
      ],
      metrics: { failed: "kept as a dead letter" },
    },
    {
      tag: "syrmos",
      title: "A restart loses nothing",
      body: [
        "If the cell is killed mid-run, the rows it had not finished are still waiting on the bus. When it starts again, it takes them where it left off.",
      ],
      metrics: { lost: "none" },
    },
  ],
  parts: {
    bridge: "Polls the table after a cursor and writes each result as an object.",
    bus: "Keeps the cursor and the rows until their runs close.",
    cell: "Runs the pipeline; it holds neither the database's password nor the bucket's key.",
    tracing: "Every row's run traced; dead letters listed and offered again.",
  },
  tryIt: {
    text: "No pack starts from this yet: build it in an open cell. The database connection, the polled source and the bucket sink are described in the features list.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/features.md",
    linkText: "Read the features list",
  },
  statusNote:
    "Target: a database polled into the intake and a bucket as a sink are built. A test through a real bus shows a table polled after its cursor, each row once on the intake and in order, and a new row read by the next poll; a trial shows the bucket sink, and a killed cell losing nothing, with records from brokers. A pipeline from a database to files has not been shown end to end, and the trial of event-driven extract, transform and load is still a target.",
};
