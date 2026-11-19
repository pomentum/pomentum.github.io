import type { UseCaseText } from "../types";

export const signedWebhooks: UseCaseText = {
  title: "Signed webhooks to work items",
  situation: "A pull request merged on GitHub should move the Jira issue it names, and comment with its link.",
  team: "Engineering teams",
  context:
    "For a team that keeps its work in Jira and its code on GitHub. Without Syrmos, the webhook lands on an open HTTP endpoint that anyone can post to, the Jira token sits in a node, and a redelivered event moves the issue twice.",
  metricLabels: {
    forged: "Forged requests let in",
    tokens: "Tokens in the cell",
    twice: "Issues moved twice",
  },
  steps: [
    {
      tag: "problem",
      title: "Anyone can post, the token is in the flow",
      body: [
        "The flow takes any POST to its endpoint, signed or not. A forged request moves issues as easily as GitHub does.",
        "The Jira token that makes the move is typed into a node, in every export of the flow.",
      ],
      metrics: { forged: "possible", tokens: "2", twice: "possible" },
    },
    {
      tag: "how",
      title: "A signed webhook arrives",
      body: [
        "The repository's webhook points at a webhook connection in GitHub's form, on a public route of the installation. The connector bridge checks the signature as GitHub signs it, before anything runs.",
        "A request with a wrong signature is answered 401, and nothing is stored or reaches the intake.",
      ],
      metrics: { forged: "0", tokens: "0" },
    },
    {
      tag: "how",
      title: "Stored once",
      body: [
        "GitHub can deliver the same event again. The bridge stores a redelivery once, so the pipeline sees the event once and the issue is not moved twice.",
      ],
      metrics: { twice: "never" },
    },
    {
      tag: "how",
      title: "Merged, and names an issue",
      body: [
        "The pipeline looks at the pull request: was it merged, and does its title or branch name an issue, like OPS-12?",
        "A pull request closed without a merge, or one that names no issue, does nothing.",
      ],
    },
    {
      tag: "syrmos",
      title: "The issue moves, with no token in the cell",
      body: [
        "The Jira connector finds the transition that leads to Done by its name, whatever your workflow calls the transition, and makes it.",
        "The call goes through the credential gateway, which adds the Jira account's secret from OpenBao on the way out.",
      ],
    },
    {
      tag: "syrmos",
      title: "A comment with the link",
      body: ["The issue gets a comment with the pull request's address, so whoever opens OPS-12 finds the change that closed it."],
    },
    {
      tag: "how",
      title: "Tested before it is deployed",
      body: [
        "The pack comes with test cases: a merged pull request moving its issue and commenting, and one closed without a merge moving nothing.",
        "They run as runs marked test, with Jira's answers mocked at the gateway. A protected cell can require a passing report before a promotion.",
      ],
    },
  ],
  parts: {
    bridge: "Checks GitHub's signature and stores a redelivery once.",
    gateway: "Adds the Jira secret on the way out; the cell never holds it.",
    bus: "The checked event waits in the pipeline's durable intake.",
    registry: "The pack and the Jira connector are reviewed items in the registry.",
  },
  tryIt: {
    text: "Start from the pack jira-from-git: install it into an open cell from the Pipelines page, bind its two connections (the GitHub webhook and Jira), and set its parameters, the status and the project.",
    href: "https://github.com/pomentum/syrmos/tree/main/catalogue/packs/jira-from-git",
    linkText: "The jira-from-git pack",
  },
  statusNote:
    "Target: the pack, its connections and its test cases are on main, and webhooks are checked as GitHub signs them; a wrong signature is answered 401 with nothing stored, shown by the webhook tests. A trial drives GitHub as steps against a fake provider. The pack has not been run against the real GitHub and Jira, and their webhooks are not shown.",
};
