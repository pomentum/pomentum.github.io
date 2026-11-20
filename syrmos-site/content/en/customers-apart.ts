import type { UseCaseText } from "../types";

// Built from the old walkthrough many-tenants (all seven steps, in order).
export const customersApart: UseCaseText = {
  title: "Keep each customer's automations apart",
  situation: "If one customer's automation goes wrong, can it reach another customer's, or their passwords?",
  team: "Platform teams and service providers",
  context:
    "For a provider running several customers' automations on one platform. In one shared Node-RED, anyone who can change an automation can run anything, and read every other customer's automations and passwords.",
  metricLabels: {
    reach: "Other customers' cells it can reach",
    secrets: "Passwords it holds",
    limits: "Memory and CPU",
  },
  steps: [
    {
      tag: "problem",
      title: "Three customers, one Node-RED",
      body: [
        "Three customers' automations share one Node-RED. Its code step isn't a security boundary, as Node.js itself says, so one line in one customer's automation can get out of it.",
        "From there it reads the others' automations and every password the runtime holds.",
      ],
      metrics: { reach: "all of them", secrets: "every one", limits: "shared" },
    },
    {
      tag: "syrmos",
      title: "A cell per customer",
      body: [
        "With Syrmos, each customer has cells of its own: unmodified Node-RED in a container per cell, with nothing shared between customers.",
        "Each container runs without administrator rights, can't change its own system files, and has hard limits.",
      ],
    },
    {
      tag: "how",
      title: "A network of its own",
      body: [
        "Each cell sits on a private network that only Syrmos and the bus join. Nothing goes out unless it is allowed.",
        "Work reaches a cell through the bus, where each cell has a password of its own.",
      ],
      metrics: { reach: "none" },
    },
    {
      tag: "problem",
      title: "Suppose a cell turns hostile",
      body: [
        "Code in the demo customer's cell turns hostile. It tries the next customer's cell, the internet, the cloud's metadata address, the password store and the platform's database.",
        "None of them is in reach of its network.",
      ],
    },
    {
      tag: "syrmos",
      title: "No password to steal",
      body: [
        "There is nothing to take inside the cell. The automation asks for a connection by name, and Syrmos adds the password on the way out.",
        "A password typed into an automation is refused, so none sits in an automation, a cell or Syrmos itself.",
      ],
      metrics: { secrets: "0" },
    },
    {
      tag: "how",
      title: "Tested, not assumed",
      body: [
        "Probes run from inside a cell, each with a control that shows it would catch a gap. On one machine, all pass: no cell reaches the internet, the metadata address, a database, the password store or another cell.",
      ],
    },
    {
      tag: "syrmos",
      title: "Limits of its own",
      body: [
        "Each cell gets a size, from 128 MB of memory and a quarter of a CPU up to 1 GB and two CPUs; the default is 512 MB and one.",
        "These are hard limits, and each customer also has quotas.",
      ],
      metrics: { limits: "hard limits of its own" },
    },
  ],
  parts: {
    cell: "A container and a private network per cell; nothing shared between customers.",
    gateway: "Adds each call's password outside the cell, so a hostile cell finds none.",
    bus: "The only way work reaches a cell, with a password for each cell.",
  },
  tryIt: {
    text: "The probes are in the Syrmos repository: one test runs them against an installation, and the cell contract lists which probes each kind of installation has passed.",
  },
  statusNote:
    "Shown: the cell contract records 53 of 53 isolation probes passing on the installation's layout (run against the development setup on 2026-11-01), and on the Docker Compose target 21 of 21 network probes and 9 of 9 probes that a cell can't crowd its neighbours. All measured on one Docker host; a spur, or cells run without containers, have no such probes yet. The sizes drawn are the smallest, the default and the largest a cell may have; the probes don't depend on them.",
};
