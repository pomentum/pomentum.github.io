import type { UseCaseText } from "../types";

export const changingProduction: UseCaseText = {
  title: "Changing production safely",
  situation: "A fix has to reach production, and nobody should be able to skip the checks on the way.",
  team: "Platform teams",
  context:
    "For a team that runs pipelines other people depend on. Without Syrmos, the flow in production is the only copy: someone edits it in place, a mistake is live at once, and an edit made elsewhere is silently overwritten.",
  metricLabels: {
    version: "Version in prod",
    direct: "Direct edits to prod",
    review: "Review on record",
    record: "Audit log",
  },
  steps: [
    {
      tag: "problem",
      title: "Edits straight into production",
      body: [
        "The pipeline in production is edited where it runs. A wrong line goes live with the next deploy, and the version before it is gone.",
        "Nothing says who changed what, or whether anyone looked.",
      ],
      metrics: { version: "the last save", direct: "possible", review: "none", record: "—" },
    },
    {
      tag: "syrmos",
      title: "Two cells, two roles",
      body: [
        "The tenant has an open cell labelled dev and a protected cell labelled prod. Labels describe; they decide nothing.",
        "The protected cell names the cell it takes promotions from, and asks for a review. It changes only by promotion or rollback.",
      ],
      metrics: { version: "v3", direct: "refused" },
    },
    {
      tag: "how",
      title: "Build the fix in the open cell",
      body: [
        "You deploy the fix into the open cell. The deploy is checked against the nodes the cell may use, and kept as a new immutable version: v4.",
        "Work from the intake runs through v4 there, traced like any other run.",
      ],
    },
    {
      tag: "how",
      title: "Runs counted",
      body: [
        "The tenant's promotion process is itself a pipeline. Its first step counts the runs of the newest version in the open cell with `syrmos runs`.",
        "The bar it sets is the tenant's own, changed in the editor like any other pipeline.",
      ],
    },
    {
      tag: "syrmos",
      title: "A person reviews",
      body: [
        "The promotion pipeline asks for a review, and a person approves it in the Syrmos UI.",
        "A rejected review promotes nothing.",
      ],
      metrics: { review: "approved" },
    },
    {
      tag: "syrmos",
      title: "Promoted, on the record",
      body: [
        "`syrmos promote`, with the review's id, merges the pipeline into the protected cell, which takes it because it came from the cell it names, with an approved review.",
        "The audit log records the promotion, naming the cell that made it and the review.",
      ],
      metrics: { version: "v4", record: "promotion" },
    },
    {
      tag: "syrmos",
      title: "A direct edit is refused",
      body: [
        "A deploy straight into the protected cell is refused. So is a promotion once the protected cell no longer names its promoter, even with an approved review.",
        "Every refusal is in the audit log too.",
      ],
      metrics: { record: "refusal" },
    },
    {
      tag: "syrmos",
      title: "Roll back",
      body: [
        "If v4 misbehaves in production, roll the protected cell back to a version it ran before. v3 is still there: every deploy is a version, never an overwrite.",
      ],
      metrics: { version: "v3 again", record: "rollback" },
    },
  ],
  parts: {
    cell: "The open cell is where the fix is built and runs first.",
    "protected-cell": "Takes a new version only from the cell it names, with a review.",
    promotion: "The tenant's own pipeline: runs counted, a review, then syrmos promote.",
    review: "A person approves or rejects; a rejection promotes nothing.",
    audit: "The promotion and every refusal are recorded, chained by hash.",
  },
  tryIt: {
    text: "The development stack seeds this promotion process: the pipeline \"promote hello\" in acme-dev-1, and acme-prod-1 protected, naming acme-dev-1 as its promoter and requiring a review. Open it in the editor.",
    href: "https://github.com/pomentum/syrmos#try-it",
    linkText: "Run the development stack",
  },
  statusNote:
    "Shown: a trial runs this against a NATS server and a real cell, 20 checks passed twice on 2026-10-29: runs counted, a review approved through the API, the promotion with the review's id and its audit record; a rejected review promotes nothing, a direct deploy into the protected cell is refused, and a promotion is refused once the protected cell names no promoter. Rollback is built but is not among the trial's checks, and the trial promotes a simple hello pipeline; the order pipeline drawn here stands in for any pipeline.",
};
