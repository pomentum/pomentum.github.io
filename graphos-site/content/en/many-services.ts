import type { UseCaseText } from "../types";

export const manyServices: UseCaseText = {
  title: "One graph, many services",
  situation: "Several services need the same connected data, and none of them should hold the database.",
  team: "Platform teams",
  context:
    "For teams whose services share connected data: dependencies, assets, a knowledge graph. Once several services need it, each one ends up holding database credentials, writing its own Cypher, and solving bulk loading, indexing and isolation on its own.",
  metricLabels: {
    dsn: "Database credentials in services",
    reach: "What a service can reach",
    revoke: "Revoking a service",
  },
  steps: [
    {
      tag: "problem",
      title: "Every service holds the database",
      body: [
        "The orders service and the catalogue service each connect to PostgreSQL with a connection string of their own and write their own Cypher.",
        "Each solves bulk loading, indexing and isolation on its own.",
      ],
      metrics: { dsn: "one per service", reach: "what its login allows", revoke: "—" },
    },
    {
      tag: "product",
      title: "One service owns the graph",
      body: [
        "Only graphos-api connects to the database. An admin gives each service an account of its own (`POST /v1/users` with `kind: service`), and a grant on each tenant it needs (`POST /v1/grants`).",
        "A level says how far a grant goes: read, write, maintain or owner, each including the ones before it.",
      ],
      metrics: { dsn: "none" },
    },
    {
      tag: "how",
      title: "A token that lasts 15 minutes",
      body: [
        "A service signs in with `POST /v1/auth/login` and gets an access token that lasts 900 seconds by default. The Python client signs in again by itself before it runs out.",
        "So a leaked token is useful for minutes, not months.",
      ],
    },
    {
      tag: "how",
      title: "Typed HTTP to its own tenant",
      body: [
        "Every call is typed HTTP with the token as a bearer; the tenant is in the address. The orders service writes to `acme`, the catalogue service reads `sales`.",
        "The contract is published as OpenAPI, versioned under `/v1`.",
      ],
      metrics: { reach: "the tenants it is granted" },
    },
    {
      tag: "product",
      title: "Another tenant: refused before any SQL",
      body: [
        "When the catalogue service calls `acme`, which it has no grant on, the answer is 403, given before any SQL runs. A tenant that isn't registered answers 404.",
      ],
    },
    {
      tag: "product",
      title: "The database has no door of its own",
      body: [
        "The database has no published port and sits on an internal network that only graphos-api joins, which connects as an unprivileged role. Consumers never see a connection string and cannot send SQL.",
        "Disabling a service's account, or resetting its secret, stops its tokens at once on every replica.",
      ],
      metrics: { revoke: "at once, on every replica" },
    },
  ],
  parts: {
    api: "The one service that connects to the database.",
    tenant: "Each tenant its own graph, reached only with a grant.",
    access: "Service accounts, levels per tenant, 15-minute tokens.",
    audit: "One line per request, naming the account that made it.",
  },
  tryIt: {
    text: "The usage guide shows users, service accounts and grants, then writing and reading a first tenant.",
    href: "https://github.com/pomentum/graphos/blob/main/docs/guide/usage.md",
    linkText: "Read the usage guide",
  },
  statusNote:
    "Tested: graphos's tests check that every operation declares its access and needs its level and no more, that a service account can create tenants and owns them, and that disabling a user or resetting its secret stops its tokens at once. The example 05_tenant_pool.py runs several tenants side by side. The services and tenant names drawn are examples.",
};
