import type { UseCaseText } from "../types";

export const communityNode: UseCaseText = {
  title: "A community node, governed",
  situation: "A team wants a Node-RED community node for its ERP, without the node holding the login or running unchecked code.",
  team: "Node-RED teams",
  context:
    "For a team that already uses nodes from the Node-RED community. Such a node keeps the service's login in its config node, inside the flow, and its package's code runs with everything the runtime can do.",
  metricLabels: {
    login: "The login",
    check: "Before it runs",
    quarantine: "A package reported malicious",
  },
  steps: [
    {
      tag: "problem",
      title: "Any package, its login in the flow",
      body: [
        "The community node calls the ERP itself, with the real login stored in its config node.",
        "Whoever reads the flows reads the login, and nobody checked the package before it ran.",
      ],
      metrics: { login: "in the flow", check: "nothing", quarantine: "keeps running" },
    },
    {
      tag: "syrmos",
      title: "Checked before it runs",
      body: [
        "Anyone with write on a tenant can check the package in the Registry: its code and metadata are read, never installed or run, and its publisher, provenance, signatures and known advisories are checked, again at lock and daily.",
        "A version younger than 14 days, unless an operator sets another age, is refused, so a bad release has time to be reported first.",
        "The node is described, where it puts each credential and which property is its address, and another operator approves it.",
      ],
      metrics: { check: "checked, and a second person" },
    },
    {
      tag: "syrmos",
      title: "A connector cell of its own",
      body: [
        "The package runs in a cell of its own, with that package and its one connection, joined to the tenant's other cells by hand-offs on the bus.",
        "Its cell loads only its allow-list's packages and runs under Node's permission model.",
      ],
    },
    {
      tag: "how",
      title: "A placeholder, and the login at the gateway",
      body: [
        "The node's config is bound to a Syrmos connection. The cell gives it a placeholder, never the real login, and points its address at the cell's link.",
        "Its calls go through the credential gateway, which adds the login on the way out, held to the connection's allowed destinations.",
      ],
      metrics: { login: "at the gateway, not the cell" },
    },
    {
      tag: "how",
      title: "A session, kept sealed",
      body: [
        "Some nodes need a session: a token fetched first, sent back with the session's cookies. Where the connection says so, the gateway keeps those cookies sealed for the cell's link, bound to the tenant, the cell and the connection, for 12 hours at most.",
        "No node ever sees them.",
      ],
    },
    {
      tag: "syrmos",
      title: "Quarantined at once",
      body: [
        "If a malicious-package report names the package, the registry quarantines it at once. Its calls are refused at the gateway, and a deploy that uses it is refused too.",
      ],
      metrics: { quarantine: "refused at the gateway" },
    },
  ],
  parts: {
    registry: "Checks the package and its node's description, approved by a second person; quarantines it on a malicious report.",
    gateway: "Adds the login, keeps a session sealed, refuses a quarantined package.",
    cell: "A connector cell: one package, one connection.",
    bus: "Joins the connector cell to the tenant's other cells by hand-offs.",
  },
  tryIt: {
    text: "The registry guide says how to check a package, bind a community node to a connection and quarantine one.",
    href: "https://github.com/pomentum/syrmos/blob/main/docs/guide/registry.md",
    linkText: "Read the registry guide",
  },
  statusNote:
    "Target: built, and tried on 2026-11-19 with a real community package for an ERP's OData service in the cell image, with no network. It reached a stand-in gateway with the cell's token alone, and a write with its session reached a stand-in service with the real login. It has not yet run against a real service.",
};
