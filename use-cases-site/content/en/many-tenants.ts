import type { UseCaseText } from "../types";

export const manyTenants: UseCaseText = {
  title: "One platform, many tenants",
  situation: "You host Node-RED for three customers. One of them must never reach another, or any secret.",
  team: "Service providers",
  context:
    "For a provider or an integrator who runs customers' integrations on one platform. Without Syrmos, one Node-RED is one trust domain: a Function node runs in Node's vm module, which Node.js itself says [is not a security mechanism](https://nodejs.org/api/vm.html#vm-executing-javascript), so anyone who can deploy can run anything and read what the others hold.",
  metricLabels: {
    reach: "Neighbours a cell can reach",
    secrets: "Secrets a cell holds",
    probes: "Isolation probes",
    limits: "Limits per cell",
  },
  steps: [
    {
      tag: "problem",
      title: "Three customers, one runtime",
      body: [
        "Three customers' flows share one Node-RED. Code in one customer's Function node escapes Node's vm module in one line.",
        "From there it reads the others' flows and every credential the runtime holds.",
      ],
      metrics: { reach: "all of them", secrets: "every one", probes: "—", limits: "shared" },
    },
    {
      tag: "syrmos",
      title: "A cell per customer",
      body: [
        "Each customer is a tenant with cells of its own: unmodified Node-RED in a container per cell, with no process shared between tenants.",
        "The container runs as a numeric non-root user with a read-only root, no capabilities and hard limits. The control plane deploys to each cell.",
      ],
      metrics: { secrets: "0" },
    },
    {
      tag: "how",
      title: "A network of its own",
      body: [
        "Each cell sits on an internal network of its own that only the control plane and the bus join. Egress is denied by default.",
        "Work reaches a cell through its intake on the bus, where each cell has a credential of its own.",
      ],
      metrics: { reach: "none" },
    },
    {
      tag: "problem",
      title: "A compromised cell",
      body: [
        "Suppose code in the demo tenant's cell turns hostile. It tries the neighbour's cell, the internet, the cloud's metadata address, the secret store and the platform's database.",
        "Every one of those is out of reach of the cell's network.",
      ],
    },
    {
      tag: "syrmos",
      title: "No secret to steal",
      body: [
        "There is nothing to take inside the cell: a pipeline calls a connection by name, and the credential gateway, which knows the cell by its token, adds the secret from OpenBao on the way out.",
        "A secret typed into a node is refused at deploy. No secret is in a flow, a cell or the control plane.",
      ],
    },
    {
      tag: "how",
      title: "Tested, not assumed",
      body: [
        "Probes run from inside a cell, each with a negative control. On the installation's layout all 53 pass: no cell or bridge reaches the internet, the metadata address, a database, the secret store or another cell.",
        "Measured on one Docker host.",
      ],
      metrics: { probes: "53 / 53" },
    },
    {
      tag: "syrmos",
      title: "Limits per cell",
      body: [
        "You choose a size per cell, from 128 MB of memory and a quarter of a CPU up to 1 GB and two CPUs; the default is 512 MB and one CPU. These are hard limits.",
        "Each tenant also has quotas on cells, memory, CPU and bus storage.",
      ],
      metrics: { limits: "hard" },
    },
  ],
  parts: {
    cell: "A container and an internal network per cell; nothing shared between tenants.",
    bus: "The only way work reaches a cell, with a credential per cell.",
    gateway: "Adds each call's secret outside the cell, so a compromised cell finds none.",
    registry: "Only reviewed nodes run in a governed cell, frozen into its image; nothing is installed at runtime.",
  },
  tryIt: {
    text: "The probes are in the repository: the egress test runs against the installation's layout, and the cell contract lists what each target has passed.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/cell-contract.md#conformance-status",
    linkText: "Read the cell contract",
  },
  statusNote:
    "Shown: the cell contract's conformance status records 53 of 53 probes passed on the installation's layout (the egress test against the development stack, 2026-11-01), and on the Compose target 21 of 21 egress probes and 9 of 9 noisy-neighbour probes. The sizes drawn are the smallest, the default and the largest a cell may have, as Syrmos defines them; the probes do not depend on them.",
};
