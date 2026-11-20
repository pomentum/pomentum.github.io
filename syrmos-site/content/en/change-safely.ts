import type { UseCaseText } from "../types";

// Built from the old walkthroughs changing-production (steps 0, 1, 2, 4, 5, 7) and tests-promotion (steps 2, 5).
export const changeSafely: UseCaseText = {
  title: "Change what's live without breaking it",
  situation: "How do you change an automation that runs in production without breaking it, or letting anyone skip the checks?",
  caveat: "Part shown, part a target: the tests and the step back are built, not yet shown.",
  team: "Teams changing live automations",
  context:
    "For a team that runs automations other people depend on. Without Syrmos, the automation in production is the only copy: someone edits it in place, and a mistake is live at once.",
  metricLabels: {
    direct: "Editing production directly",
    approval: "Approval on record",
    tests: "Going live with no passing tests",
  },
  steps: [
    {
      tag: "problem",
      title: "Edits straight into production",
      body: [
        "The automation is edited where it runs. A wrong line goes live with the next deploy, and the version before is gone.",
        "Nothing says who changed what, or whether anyone looked.",
      ],
      metrics: { direct: "possible", approval: "none", tests: "allowed" },
    },
    {
      tag: "syrmos",
      title: "A test copy and a live copy",
      body: [
        "With Syrmos, there is a test copy and a live copy. The live copy takes changes only from the copy it names, with an approval, or by a step back.",
        "Editing the live copy directly is refused.",
      ],
      metrics: { direct: "refused" },
    },
    {
      tag: "how",
      title: "Build the fix in the test copy",
      body: [
        "You put the fix into the test copy. It is checked against the nodes that copy may use, and kept as a new version that never changes: v4.",
        "Work runs through it there, recorded like any run.",
      ],
    },
    {
      tag: "how",
      title: "Tests, with no real calls",
      body: [
        "Before it goes further, its test cases run in the test copy. Every outside call they make is answered by a stand-in, so the real payment service is never reached.",
      ],
    },
    {
      tag: "syrmos",
      title: "Passing tests required",
      body: [
        "The tests end in a report for that exact version. The live copy can require a passing report for the version promoted into it; a version with none is refused.",
      ],
      metrics: { tests: "refused where tests are required" },
    },
    {
      tag: "syrmos",
      title: "A person approves",
      body: ["The promotion asks for an approval, and a person approves it in Syrmos. A rejection promotes nothing."],
      metrics: { approval: "approved" },
    },
    {
      tag: "syrmos",
      title: "Promoted, on the record",
      body: [
        "The live copy takes v4, because it came from the copy it names, with an approval. The audit log records the promotion and the approval behind it.",
      ],
    },
    {
      tag: "syrmos",
      title: "Going back in one step",
      body: [
        "If v4 misbehaves, put the live copy back to v3. Every change is a new version, never an overwrite, and the step back is on the record.",
      ],
    },
  ],
  parts: {
    "protected-cell": "The live copy: takes a version only from the copy it names, with an approval and, where required, passing tests.",
    promotion: "The team's own automation: runs counted, an approval, then the version moved into the live copy.",
    review: "A person approves or rejects; a rejection promotes nothing.",
    audit: "Records each promotion, refusal, step back and test run, each entry chained to the last.",
  },
  tryIt: {
    text: "The development setup includes this promotion: an acme test copy promoting into an acme live copy that asks for an approval. Write tests in the editor's Tests panel.",
  },
  statusNote:
    "Shown: a trial against a real bus and cell, 20 checks passed twice on 2026-10-29: runs counted, a review approved through the API (not the screen drawn), the promotion with the review's id and its record; a rejected review promotes nothing, and a direct change to the live copy is refused. It promotes a simple hello automation; the order automation drawn stands in for any. Target: the step back, and tests with stand-ins, reports and the requirement before a promotion, are built and tested, not shown end to end.",
};
