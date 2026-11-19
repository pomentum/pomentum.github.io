import type { UseCaseText } from "../types";

export const assistantDrafts: UseCaseText = {
  title: "The assistant drafts a pipeline",
  situation: "You describe what you need; the assistant proposes a pipeline, and nothing changes until you confirm.",
  team: "Pipeline builders",
  context:
    "For people who know what a pipeline should do but not every node it takes. Without a governed assistant, a chat tool writes a flow you paste in unchecked, or an assistant with broad rights changes things on its own, and its model key sits wherever it was configured.",
  metricLabels: {
    unasked: "Changes without your OK",
    checked: "Checked before you see it",
    key: "Model key in a cell",
  },
  steps: [
    {
      tag: "problem",
      title: "A blank canvas",
      body: ["You know what should happen: a request comes in, gets shaped, and a message goes to the team's room. You don't know every node it takes, and the cell is empty."],
      metrics: { unasked: "—", checked: "—", key: "—" },
    },
    {
      tag: "how",
      title: "Describe it",
      body: [
        "Open the assistant's panel, on any view, and describe the pipeline in your own words.",
        "The assistant works with the same tools as the MCP server, as you.",
      ],
    },
    {
      tag: "how",
      title: "A model, through the gateway",
      body: [
        "The assistant runs on a model provider a platform operator defined, any OpenAI-compatible one, called through the credential gateway.",
        "No model key is in core or in a cell.",
      ],
      metrics: { key: "none" },
    },
    {
      tag: "syrmos",
      title: "Proposed and checked",
      body: [
        "The assistant proposes a whole pipeline. It is checked by a deploy's dry run, the same check a real deploy gets, and repaired at most twice.",
        "What you see has already passed the check, or says what didn't.",
      ],
      metrics: { checked: "a deploy's dry run" },
    },
    {
      tag: "syrmos",
      title: "Nothing changes until you confirm",
      body: [
        "When you confirm, the pipeline is saved as the cell's draft. Deploying it is still your step, with its own check.",
        "The assistant doesn't deploy on its own.",
      ],
      metrics: { unasked: "0" },
    },
    {
      tag: "how",
      title: "Within what it may do",
      body: [
        "A platform operator sets what the assistant may do in each area of its tools: off, read, propose, and for pipelines, build. A tenant's owner may lower it.",
      ],
    },
  ],
  parts: {
    assistant: "Proposes, checks with a dry run, and saves a draft only when you confirm.",
    gateway: "Calls the model provider; no key in core or a cell.",
    cell: "The open cell where the draft lands.",
    registry: "The proposed pipeline is held to the nodes the cell may use.",
  },
  tryIt: {
    text: "Turn the assistant on and define a model provider on the platform's Connections, as a platform operator; the installation guide says how.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/installation.md",
    linkText: "The installation guide",
  },
  statusNote:
    "Target: building a pipeline from a description is built, as the Syrmos feature list records: proposed, checked by a deploy's dry run, repaired at most twice, and saved as the draft when the person confirms. No trial or demo shows it end to end yet, and a hosted model provider has not yet been checked live. The pipeline drawn here is an example.",
};
